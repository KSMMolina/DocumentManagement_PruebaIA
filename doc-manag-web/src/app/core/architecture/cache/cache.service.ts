import { Injectable } from "@angular/core";
import { Observable, of, tap } from "rxjs";
import { IGeneric } from "../interface/generic.interface";

interface CacheEntry<T> {
  data: IGeneric.Response<T>;
  timestamp: number;
  accessCount: number;
  lastAccess: number;
}

interface CacheConfig {
  maxSize?: number; // Máximo número de entradas (default: 100)
  ttl?: number; // Tiempo de vida en milisegundos (default: 5 minutos)
  enableAutoCleanup?: boolean; // Limpieza automática (default: true)
  cleanupInterval?: number; // Intervalo de limpieza en ms (default: 1 minuto)
}

@Injectable({
  providedIn: "root",
})
export class CacheService {
  private cache = new Map<string, CacheEntry<any>>();
  private cleanupTimer?: number;

  private config: Required<CacheConfig> = {
    maxSize: 100,
    ttl: 5 * 60 * 1000, // 5 minutos
    enableAutoCleanup: true,
    cleanupInterval: 60 * 1000, // 1 minuto
  };

  constructor() {
    this.startAutoCleanup();
  }

  /**
   * Configura el comportamiento del cache
   */
  public configure(config: CacheConfig): void {
    this.config = { ...this.config, ...config };

    if (this.config.enableAutoCleanup) this.startAutoCleanup();
    else this.stopAutoCleanup();
  }

  /**
   * Obtiene datos del cache o ejecuta la petición HTTP
   */
  public getOrFetch<T>(
    key: string,
    httpRequest: () => Observable<IGeneric.Response<T>>,
    forceRefresh: boolean = false
  ): Observable<IGeneric.Response<T>> {
    if (forceRefresh) {
      this.delete(key);
      return this.executeAndCache(key, httpRequest);
    }

    const cachedEntry = this.cache.get(key);

    // Verificar si existe, es válido y no ha expirado
    if (cachedEntry && this.isValid(cachedEntry)) {
      // Actualizar estadísticas de acceso
      cachedEntry.accessCount++;
      cachedEntry.lastAccess = Date.now();
      return of(cachedEntry.data);
    }

    return this.executeAndCache(key, httpRequest);
  }

  /**
   * Ejecuta la petición HTTP y guarda el resultado en cache
   */
  private executeAndCache<T>(
    key: string,
    httpRequest: () => Observable<IGeneric.Response<T>>
  ): Observable<IGeneric.Response<T>> {
    return httpRequest().pipe(
      tap((response) => {
        if (response && this.hasValidData(response)) {
          this.set(key, response);
        }
      })
    );
  }

  /**
   * Guarda en cache aplicando estrategia LRU si se excede el límite
   */
  private set<T>(key: string, data: IGeneric.Response<T>): void {
    // Si se alcanzó el límite, eliminar la entrada menos usada
    if (this.cache.size >= this.config.maxSize) {
      this.evictLRU();
    }

    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      accessCount: 1,
      lastAccess: Date.now(),
    };

    this.cache.set(key, entry);
  }

  /**
   * Elimina la entrada menos recientemente usada (LRU - Least Recently Used)
   */
  private evictLRU(): void {
    let oldestKey: string | null = null;
    let oldestTime = Infinity;

    this.cache.forEach((entry, key) => {
      if (entry.lastAccess < oldestTime) {
        oldestTime = entry.lastAccess;
        oldestKey = key;
      }
    });

    if (oldestKey) this.delete(oldestKey);
  }

  /**
   * Verifica si una entrada es válida (no ha expirado)
   */
  private isValid<T>(entry: CacheEntry<T>): boolean {
    const now = Date.now();
    const age = now - entry.timestamp;
    return age < this.config.ttl && this.hasValidData(entry.data);
  }

  /**
   * Valida si el Response tiene datos válidos
   */
  private hasValidData<T>(response: IGeneric.Response<T>): boolean {
    if (!response?.data) return false;

    if (Array.isArray(response.data)) {
      return response.data.length > 0;
    }

    if (typeof response.data === "object") {
      return Object.keys(response.data).length > 0;
    }

    return true;
  }

  /**
   * Limpieza automática de entradas expiradas
   */
  private startAutoCleanup(): void {
    this.stopAutoCleanup();

    if (this.config.enableAutoCleanup) {
      this.cleanupTimer = window.setInterval(() => {
        this.cleanupExpired();
      }, this.config.cleanupInterval);
    }
  }

  /**
   * Detiene la limpieza automática
   */
  private stopAutoCleanup(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = undefined;
    }
  }

  /**
   * Elimina todas las entradas expiradas
   */
  private cleanupExpired(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    this.cache.forEach((entry, key) => {
      const age = now - entry.timestamp;
      if (age >= this.config.ttl) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach((key) => this.delete(key));

    // if (keysToDelete.length > 0) {
    //   console.log(`[CacheService] Limpiadas ${keysToDelete.length} entradas expiradas`);
    // }
  }

  /**
   * Limpia item del cache
   */
  public delete(key: string, ...params: any[]): void {
    this.cache.delete(this.generateKey(key, ...params));
  }

  /**
   * Limpia todo el cache
   */
  public clear(): void {
    this.cache.clear();
  }

  /**
   * Verifica si existe un cache válido para una key
   */
  public has(key: string): boolean {
    const entry = this.cache.get(key);
    return entry ? this.isValid(entry) : false;
  }

  /**
   * Obtiene el tamaño actual del cache
   */
  public size(): number {
    return this.cache.size;
  }

  /**
   * Obtiene las keys del cache
   */
  public keys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Obtiene estadísticas del cache
   */
  public getStats() {
    const entries = Array.from(this.cache.entries());
    const now = Date.now();

    return {
      totalEntries: this.cache.size,
      maxSize: this.config.maxSize,
      ttl: this.config.ttl,
      entries: entries.map(([key, entry]) => ({
        key,
        age: now - entry.timestamp,
        accessCount: entry.accessCount,
        expired: !this.isValid(entry),
      })),
    };
  }

  /**
   * Genera una key de cache a partir de parámetros
   */
  public generateKey(prefix: string, ...params: any[]): string {
    return `${prefix}:${JSON.stringify(params)}`;
  }

  /**
   * Limpieza al destruir el servicio
   */
  ngOnDestroy(): void {
    alert("Sale cache service");
    this.stopAutoCleanup();
    this.clear();
  }
}
