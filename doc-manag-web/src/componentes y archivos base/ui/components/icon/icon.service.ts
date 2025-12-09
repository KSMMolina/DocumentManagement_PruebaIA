import { inject, Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { catchError, finalize, map, shareReplay, switchMap, tap, timeout } from "rxjs/operators";
import { BehaviorSubject, Observable, of, from } from "rxjs";

export interface IconCacheEntry {
  originalSvg: string;
  optimizedSvg: string;
  size: number;
  originalSize: number;
  timestamp: number;
  expiresAt: number;
  compressionRatio: number;
}

export interface IconOptimizationOptions {
  removeComments?: boolean;
  removeMetadata?: boolean;
  removeUnusedDefs?: boolean;
  minifyStyles?: boolean;
  removeDimensions?: boolean;
  optimizePaths?: boolean;
  removeEmptyGroups?: boolean;
}

export interface IconMetrics {
  totalRequests: number;
  cacheHits: number;
  cacheMisses: number;
  totalSizeSaved: number;
  averageCompressionRatio: number;
  errorCount: number;
}

@Injectable({ providedIn: "root" })
export class IconService {
  private cache = new Map<string, Observable<SafeHtml>>();
  private detailedCache = new Map<string, IconCacheEntry>();
  private loadingStates = new Map<string, Observable<SafeHtml>>();

  private metrics: IconMetrics = {
    totalRequests: 0,
    cacheHits: 0,
    cacheMisses: 0,
    totalSizeSaved: 0,
    averageCompressionRatio: 0,
    errorCount: 0,
  };

  private metricsSubject = new BehaviorSubject<IconMetrics>(this.metrics);
  public metrics$ = this.metricsSubject.asObservable();

  private readonly defaultOptions: IconOptimizationOptions = {
    removeComments: true,
    removeMetadata: true,
    removeUnusedDefs: true,
    minifyStyles: true,
    removeDimensions: true,
    optimizePaths: true,
    removeEmptyGroups: true,
  };

  private readonly cacheDuration = 24 * 60 * 60 * 1000; // 24 horas
  private readonly requestTimeout = 10000; // 10 segundos
  private readonly DB_NAME = 'IconCacheDB';
  private readonly DB_VERSION = 1;
  private readonly STORE_NAME = 'icons';
  
  private db: IDBDatabase | null = null;
  private dbReady: Promise<void>;

  private sanitizer: DomSanitizer = inject(DomSanitizer);
  private httpClient: HttpClient = inject(HttpClient);

  constructor() {
    this.dbReady = this.initializeIndexedDB();
    this.initializeCache();
  }

  /**
   * Obtiene un ícono SVG optimizado desde URL, cacheado, con optimizaciones aplicadas
   * @param url URL del ícono
   * @param optimizationOptions Opciones de optimización
   * @returns Observable<SafeHtml>
   */
  getIcon(
    url: string,
    optimizationOptions?: Partial<IconOptimizationOptions>
  ): Observable<SafeHtml> {
    const cacheKey = this.generateCacheKey(url, optimizationOptions);

    this.metrics.totalRequests++;

    // Verificar cache en memoria
    if (this.cache.has(cacheKey)) {
      const cachedEntry = this.detailedCache.get(cacheKey);
      if (cachedEntry && cachedEntry.expiresAt > Date.now()) {
        this.metrics.cacheHits++;
        this.updateMetrics();
        return this.cache.get(cacheKey)!;
      } else {
        // Cache expirado, limpiar de memoria e IndexedDB
        this.cache.delete(cacheKey);
        this.detailedCache.delete(cacheKey);
        this.deleteFromIndexedDB(cacheKey);
      }
    }

    // Verificar si ya está cargando
    if (this.loadingStates.has(cacheKey)) {
      return this.loadingStates.get(cacheKey)!;
    }

    const load$ = from(this.loadFromIndexedDB(cacheKey)).pipe(
      switchMap((cachedEntry) => {
        if (cachedEntry && cachedEntry.expiresAt > Date.now()) {
          this.metrics.cacheHits++;
          this.updateMetrics();

          const safeHtml = this.sanitizer.bypassSecurityTrustHtml(
            cachedEntry.optimizedSvg
          );
          const cached$ = of(safeHtml).pipe(shareReplay(1));

          this.cache.set(cacheKey, cached$);
          this.detailedCache.set(cacheKey, cachedEntry);

          return cached$;
        }

        if (cachedEntry) {
          this.deleteFromIndexedDB(cacheKey);
        }

        this.metrics.cacheMisses++;
        return this.fetchAndCacheIcon(url, cacheKey, optimizationOptions);
      }),
      catchError(() => {
        this.metrics.cacheMisses++;
        return this.fetchAndCacheIcon(url, cacheKey, optimizationOptions);
      }),
      finalize(() => {
        this.loadingStates.delete(cacheKey);
      }),
      shareReplay(1)
    );

    this.loadingStates.set(cacheKey, load$);

    return load$;
  }

  /**
   * Realiza la petición HTTP y cachea el resultado
   */
  private fetchAndCacheIcon(
    url: string,
    cacheKey: string,
    optimizationOptions?: Partial<IconOptimizationOptions>
  ): Observable<SafeHtml> {
    const request$ = this.httpClient
      .get(url, {
        responseType: "text",
        headers: this.buildHeaders(),
      })
      .pipe(
        timeout(this.requestTimeout),
        map((svg: string) => this.optimizeSVG(svg, optimizationOptions)),
        tap((optimizedSvg: string) => {
          this.storeCacheEntry(cacheKey, url, optimizedSvg);
        }),
        map((svg: string) => this.sanitizer.bypassSecurityTrustHtml(svg)),
        tap(() => {
          this.loadingStates.delete(cacheKey);
          this.updateMetrics();
        }),
        shareReplay(1),
        catchError((error) => {
          this.loadingStates.delete(cacheKey);
          this.metrics.errorCount++;
          this.updateMetrics();
          console.error(`Error loading icon from ${url}:`, error);
          throw error;
        })
      );

    this.cache.set(cacheKey, request$);
    this.loadingStates.set(cacheKey, request$);

    return request$;
  }

  /**
   * Precarga múltiples iconos
   * @param urls Array de URLs a precargar
   * @param options Opciones de optimización globales
   */
  preloadIcons(
    urls: string[],
    options?: {
      customClass?: string;
      optimizationOptions?: Partial<IconOptimizationOptions>;
    }
  ): Observable<void> {
    const preloadPromises = urls.map((url) =>
      this.getIcon(url, options?.optimizationOptions).toPromise()
    );

    return new Observable((observer) => {
      Promise.allSettled(preloadPromises)
        .then((results) => {
          const failed = results.filter((r) => r.status === "rejected").length;
          if (failed > 0) {
            console.warn(
              `Failed to preload ${failed} icons out of ${urls.length}`
            );
          }
          observer.next();
          observer.complete();
        })
        .catch((error) => observer.error(error));
    });
  }

  /**
   * Obtiene métricas de rendimiento
   */
  getMetrics(): IconMetrics {
    return { ...this.metrics };
  }

  /**
   * Limpia el cache expirado de memoria e IndexedDB
   */
  async cleanExpiredCache(): Promise<void> {
    const now = Date.now();
    const expiredKeys: string[] = [];

    this.detailedCache.forEach((entry, key) => {
      if (entry.expiresAt < now) {
        expiredKeys.push(key);
      }
    });

    // Limpiar de memoria
    expiredKeys.forEach((key) => {
      this.cache.delete(key);
      this.detailedCache.delete(key);
    });

    // Limpiar de IndexedDB
    await this.dbReady;
    if (this.db) {
      const transaction = this.db.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      
      for (const key of expiredKeys) {
        store.delete(key);
      }
    }

    // if (expiredKeys.length > 0) {
    //   console.log(
    //     `🧹 Icon Cache: Cleaned ${expiredKeys.length} expired entries from memory and IndexedDB`
    //   );
    // }
  }

  /**
   * Limpia todo el cache de memoria e IndexedDB
   */
  async clearCache(): Promise<void> {
    this.cache.clear();
    this.detailedCache.clear();
    this.loadingStates.clear();
    
    // Limpiar IndexedDB
    await this.dbReady;
    if (this.db) {
      const transaction = this.db.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      store.clear();
    }
  }

  /**
   * Obtiene estadísticas detalladas del cache
   */
  getCacheStats(): {
    totalEntries: number;
    totalSize: number;
    oldestEntry: number;
    newestEntry: number;
    averageCompressionRatio: number;
  } {
    let totalSize = 0;
    let oldestEntry = Date.now();
    let newestEntry = 0;
    let totalCompressionRatio = 0;

    this.detailedCache.forEach(entry => {
      totalSize += entry.size;
      oldestEntry = Math.min(oldestEntry, entry.timestamp);
      newestEntry = Math.max(newestEntry, entry.timestamp);
      totalCompressionRatio += entry.compressionRatio;
    });

    return {
      totalEntries: this.detailedCache.size,
      totalSize,
      oldestEntry,
      newestEntry,
      averageCompressionRatio: this.detailedCache.size > 0 
        ? totalCompressionRatio / this.detailedCache.size 
        : 0
    };
  }

  // Métodos privados
  private optimizeSVG(
    svg: string, 
    optimizationOptions?: Partial<IconOptimizationOptions>
  ): string {
    const options = { ...this.defaultOptions, ...optimizationOptions };
    let optimized = svg;

    // Remover comentarios XML
    if (options.removeComments) {
      optimized = optimized.replace(/<!--[\s\S]*?-->/g, '');
    }

    // Remover metadata innecesaria
    if (options.removeMetadata) {
      optimized = optimized.replace(/<metadata[\s\S]*?<\/metadata>/gi, '');
      optimized = optimized.replace(/<title[\s\S]*?<\/title>/gi, '');
      optimized = optimized.replace(/<desc[\s\S]*?<\/desc>/gi, '');
      optimized = optimized.replace(/xmlns:[\w-]+="[^"]*"/g, '');
    }

    // Remover grupos vacíos
    if (options.removeEmptyGroups) {
      optimized = optimized.replace(/<g[^>]*>\s*<\/g>/gi, '');
    }

    // Optimizar paths
    if (options.optimizePaths) {
      optimized = this.optimizePaths(optimized);
    }

    // Minificar estilos
    if (options.minifyStyles) {
      optimized = this.minifyStyles(optimized);
    }

    // Remover dimensiones para hacer responsive
    if (options.removeDimensions) {
      optimized = optimized.replace(/\s*width="[^"]*"/gi, '');
      optimized = optimized.replace(/\s*height="[^"]*"/gi, '');
    }

    // Remover defs no utilizados
    if (options.removeUnusedDefs) {
      optimized = this.removeUnusedDefs(optimized);
    }

    // Agregar clase personalizada
    optimized = optimized.replace('<svg ', `<svg class='width-100 height-100' `);

    // Minificar espacios en blanco
    optimized = optimized
      .replace(/>\s+</g, '><')
      .replace(/\s+/g, ' ')
      .replace(/\s*([{}:;,>])\s*/g, '$1')
      .trim();

    return optimized;
  }

  private optimizePaths(svg: string): string {
    return svg.replace(/d="([^"]*)"/g, (match, path) => {
      const optimizedPath = path
        // Reducir precisión decimal
        .replace(/(\d+\.\d{3,})/g, (num: string) => parseFloat(num).toFixed(2))
        // Remover espacios innecesarios
        .replace(/\s+/g, ' ')
        // Optimizar comandos consecutivos
        .replace(/([LMZ])\s+\1/g, '$1')
        .trim();
      return `d="${optimizedPath}"`;
    });
  }

  private minifyStyles(svg: string): string {
    // Minificar estilos inline
    svg = svg.replace(/style="([^"]*)"/g, (match, styles) => {
      const minified = styles
        .replace(/\s*;\s*/g, ';')
        .replace(/\s*:\s*/g, ':')
        .replace(/;\s*}/g, '}')
        .replace(/\s+/g, ' ')
        .trim();
      return `style="${minified}"`;
    });

    // Minificar elementos <style>
    svg = svg.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, (match, styles) => {
      const minified = styles
        .replace(/\s*{\s*/g, '{')
        .replace(/\s*}\s*/g, '}')
        .replace(/\s*;\s*/g, ';')
        .replace(/\s*:\s*/g, ':')
        .replace(/\s+/g, ' ')
        .trim();
      return `<style>${minified}</style>`;
    });

    return svg;
  }

  private removeUnusedDefs(svg: string): string {
    const defsMatch = svg.match(/<defs[^>]*>([\s\S]*?)<\/defs>/i);
    if (!defsMatch) return svg;

    const defsContent = defsMatch[1];
    const idMatches = defsContent.match(/id="([^"]*)"/g);
    if (!idMatches) return svg;

    const definedIds = idMatches.map(match => match.replace(/id="([^"]*)"/, '$1'));
    const svgWithoutDefs = svg.replace(/<defs[^>]*>[\s\S]*?<\/defs>/i, '');

    // Verificar qué IDs se usan
    const usedIds = definedIds.filter(id => {
      const usageRegex = new RegExp(`url\\(#${id}\\)|href="#${id}"|xlink:href="#${id}"`, 'gi');
      return usageRegex.test(svgWithoutDefs);
    });

    if (usedIds.length === 0) {
      return svg.replace(/<defs[^>]*>[\s\S]*?<\/defs>/i, '');
    }

    // Para una implementación completa, aquí filtrarías solo los elementos usados
    return svg;
  }

  private generateCacheKey(
    url: string, 
    options?: Partial<IconOptimizationOptions>
  ): string {
    const optionsStr = options ? JSON.stringify(options) : '';
    return `${url}_${btoa(optionsStr)}`;
  }

  private buildHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Cache-Control': 'public, max-age=3600',
      'Accept': 'image/svg+xml, image/*, */*'
    });
  }

  private storeCacheEntry(cacheKey: string, url: string, optimizedSvg: string): void {
    const originalSize = new Blob([optimizedSvg]).size; // Aproximación
    const optimizedSize = new Blob([optimizedSvg]).size;
    const compressionRatio = originalSize > 0 ? optimizedSize / originalSize : 1;

    const entry: IconCacheEntry = {
      originalSvg: optimizedSvg, // En producción, podrías no guardar esto
      optimizedSvg,
      size: optimizedSize,
      originalSize,
      timestamp: Date.now(),
      expiresAt: Date.now() + this.cacheDuration,
      compressionRatio
    };

    // Guardar en memoria
    this.detailedCache.set(cacheKey, entry);
    this.metrics.totalSizeSaved += Math.max(0, originalSize - optimizedSize);
    
    // Guardar en IndexedDB de forma asíncrona
    this.saveToIndexedDB(cacheKey, entry);
  }

  private updateMetrics(): void {
    const totalAttempts = this.metrics.cacheHits + this.metrics.cacheMisses;
    if (totalAttempts > 0) {
      this.metrics.averageCompressionRatio = this.metrics.totalSizeSaved / totalAttempts;
    }
    this.metricsSubject.next({ ...this.metrics });
  }

  private initializeCache(): void {
    // Cargar cache desde IndexedDB al iniciar
    this.dbReady.then(() => {
      this.loadAllFromIndexedDB();
    });

    // Limpieza automática cada hora
    setInterval(() => {
      this.cleanExpiredCache();
    }, 60 * 60 * 1000);

    // Ya no limpiamos al cerrar la pestaña para mantener persistencia
    // window.addEventListener('beforeunload', () => {
    //   this.clearCache();
    // });
  }

  // Métodos de IndexedDB
  
  /**
   * Inicializa la base de datos IndexedDB
   */
  private initializeIndexedDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onerror = () => {
        console.error('Error opening IndexedDB:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Crear object store si no existe
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          const objectStore = db.createObjectStore(this.STORE_NAME, { keyPath: 'key' });
          objectStore.createIndex('expiresAt', 'expiresAt', { unique: false });
          objectStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  /**
   * Guarda una entrada en IndexedDB
   */
  private async saveToIndexedDB(key: string, entry: IconCacheEntry): Promise<void> {
    try {
      await this.dbReady;
      if (!this.db) return;

      const transaction = this.db.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      
      store.put({ key, ...entry });
      
      await new Promise<void>((resolve, reject) => {
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      });
    } catch (error) {
      console.error('Error saving to IndexedDB:', error);
    }
  }

  /**
   * Carga una entrada desde IndexedDB
   */
  private async loadFromIndexedDB(key: string): Promise<IconCacheEntry | null> {
    try {
      await this.dbReady;
      if (!this.db) return null;

      const transaction = this.db.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.get(key);

      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          const result = request.result;
          if (result) {
            const { key: _, ...entry } = result;
            resolve(entry as IconCacheEntry);
          } else {
            resolve(null);
          }
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error loading from IndexedDB:', error);
      return null;
    }
  }

  /**
   * Elimina una entrada de IndexedDB
   */
  private async deleteFromIndexedDB(key: string): Promise<void> {
    try {
      await this.dbReady;
      if (!this.db) return;

      const transaction = this.db.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      store.delete(key);
    } catch (error) {
      console.error('Error deleting from IndexedDB:', error);
    }
  }

  /**
   * Carga todas las entradas desde IndexedDB al iniciar
   */
  private async loadAllFromIndexedDB(): Promise<void> {
    try {
      await this.dbReady;
      if (!this.db) return;

      const transaction = this.db.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const results = request.result;
        const now = Date.now();
        let loadedCount = 0;
        let expiredCount = 0;

        results.forEach((result: any) => {
          const { key, ...entry } = result;
          
          // Solo cargar si no ha expirado
          if (entry.expiresAt > now) {
            this.detailedCache.set(key, entry as IconCacheEntry);
            
            // Crear observable para el cache en memoria
            const safeHtml = this.sanitizer.bypassSecurityTrustHtml(entry.optimizedSvg);
            const cached$ = of(safeHtml).pipe(shareReplay(1));
            this.cache.set(key, cached$);
            
            loadedCount++;
          } else {
            // Eliminar entradas expiradas
            this.deleteFromIndexedDB(key);
            expiredCount++;
          }
        });

        // if (loadedCount > 0) {
        //   console.log(`📥 Loaded ${loadedCount} icons from IndexedDB cache`);
        // }
        // if (expiredCount > 0) {
        //   console.log(`🧹 Removed ${expiredCount} expired icons from IndexedDB`);
        // }
      };

      request.onerror = () => {
        console.error('Error loading all from IndexedDB:', request.error);
      };
    } catch (error) {
      console.error('Error in loadAllFromIndexedDB:', error);
    }
  }
}
