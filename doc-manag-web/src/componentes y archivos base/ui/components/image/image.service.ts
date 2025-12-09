import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, of, throwError } from 'rxjs';
import { catchError, map, shareReplay, switchMap, tap } from 'rxjs/operators';

export interface ImageCacheEntry {
  blob: Blob;
  mimeType: string;
  size: number;
  timestamp: number;
  expiresAt: number;
  url: string;
}

export interface ImageCacheMetrics {
  totalRequests: number;
  cacheHits: number;
  cacheMisses: number;
  totalSize: number;
  errorCount: number;
}

@Injectable({ providedIn: 'root' })
export class ImageCacheService {
  private cache = new Map<string, string>(); // URL -> Blob URL
  private loadingStates = new Map<string, Observable<string>>();
  
  private metrics: ImageCacheMetrics = {
    totalRequests: 0,
    cacheHits: 0,
    cacheMisses: 0,
    totalSize: 0,
    errorCount: 0,
  };

  private readonly DB_NAME = 'ImageCacheDB';
  private readonly DB_VERSION = 1;
  private readonly STORE_NAME = 'images';
  private readonly cacheDuration = 7 * 24 * 60 * 60 * 1000; // 7 días
  
  private db: IDBDatabase | null = null;
  private dbReady: Promise<void>;

  private httpClient: HttpClient = inject(HttpClient);

  constructor() {
    this.dbReady = this.initializeIndexedDB();
    this.initializeCache();
  }

  /**
   * Obtiene una imagen cacheada y retorna un Blob URL
   * @param url URL de la imagen
   * @returns Observable<string> Blob URL para usar en src
   */
  getImage(url: string): Observable<string> {
    if (!url) {
      return throwError(() => new Error('URL is required'));
    }

    this.metrics.totalRequests++;

    // Verificar cache en memoria
    if (this.cache.has(url)) {
      this.metrics.cacheHits++;
      return of(this.cache.get(url)!);
    }

    // Verificar si ya está cargando
    if (this.loadingStates.has(url)) {
      return this.loadingStates.get(url)!;
    }

    // Intentar cargar desde IndexedDB
    const request$ = from(this.loadFromIndexedDB(url)).pipe(
      switchMap((cachedEntry) => {
        if (cachedEntry && cachedEntry.expiresAt > Date.now()) {
          // Encontrado en IndexedDB y no expirado
          this.metrics.cacheHits++;
          const blobUrl = URL.createObjectURL(cachedEntry.blob);
          this.cache.set(url, blobUrl);
          return of(blobUrl);
        } else {
          // No encontrado o expirado, descargar
          if (cachedEntry) {
            this.deleteFromIndexedDB(url);
          }
          this.metrics.cacheMisses++;
          return this.fetchAndCacheImage(url);
        }
      }),
      catchError(() => {
        // Error al leer IndexedDB, intentar descargar
        this.metrics.cacheMisses++;
        return this.fetchAndCacheImage(url);
      }),
      shareReplay(1),
      tap(() => {
        this.loadingStates.delete(url);
      }),
      catchError((error) => {
        this.loadingStates.delete(url);
        this.metrics.errorCount++;
        console.error(`Error loading image from ${url}:`, error);
        return throwError(() => error);
      })
    );

    this.loadingStates.set(url, request$);
    return request$;
  }

  /**
   * Descarga y cachea una imagen
   */
  private fetchAndCacheImage(url: string): Observable<string> {
    return this.httpClient
      .get(url, {
        responseType: 'blob',
        headers: {
          'Cache-Control': 'public, max-age=604800', // 7 días
        },
      })
      .pipe(
        tap((blob: Blob) => {
          this.storeCacheEntry(url, blob);
        }),
        map((blob: Blob) => {
          const blobUrl = URL.createObjectURL(blob);
          this.cache.set(url, blobUrl);
          return blobUrl;
        })
      );
  }

  /**
   * Precarga múltiples imágenes
   */
  preloadImages(urls: string[]): Observable<void> {
    const preloadPromises = urls.map((url) => this.getImage(url).toPromise());

    return new Observable((observer) => {
      Promise.allSettled(preloadPromises)
        .then((results) => {
          const failed = results.filter((r) => r.status === 'rejected').length;
          if (failed > 0) {
            console.warn(
              `Failed to preload ${failed} images out of ${urls.length}`
            );
          }
          observer.next();
          observer.complete();
        })
        .catch((error) => observer.error(error));
    });
  }

  /**
   * Obtiene métricas del caché
   */
  getMetrics(): ImageCacheMetrics {
    return { ...this.metrics };
  }

  /**
   * Limpia el cache expirado
   */
  async cleanExpiredCache(): Promise<void> {
    await this.dbReady;
    if (!this.db) return;

    const transaction = this.db.transaction([this.STORE_NAME], 'readonly');
    const store = transaction.objectStore(this.STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      const results = request.result;
      const now = Date.now();
      const expiredUrls: string[] = [];

      results.forEach((result: any) => {
        if (result.expiresAt < now) {
          expiredUrls.push(result.url);
        }
      });

      // Limpiar de memoria
      expiredUrls.forEach((url) => {
        const blobUrl = this.cache.get(url);
        if (blobUrl) {
          URL.revokeObjectURL(blobUrl);
          this.cache.delete(url);
        }
      });

      // Limpiar de IndexedDB
      if (expiredUrls.length > 0) {
        const deleteTransaction = this.db!.transaction(
          [this.STORE_NAME],
          'readwrite'
        );
        const deleteStore = deleteTransaction.objectStore(this.STORE_NAME);
        expiredUrls.forEach((url) => deleteStore.delete(url));

        // console.log(
        //   `🧹 Image Cache: Cleaned ${expiredUrls.length} expired entries`
        // );
      }
    };
  }

  /**
   * Limpia todo el cache
   */
  async clearCache(): Promise<void> {
    // Revocar todos los Blob URLs
    this.cache.forEach((blobUrl) => {
      URL.revokeObjectURL(blobUrl);
    });
    
    this.cache.clear();
    this.loadingStates.clear();

    // Limpiar IndexedDB
    await this.dbReady;
    if (this.db) {
      const transaction = this.db.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      store.clear();
    }

    // console.log('🧹 Image Cache: All cache cleared');
  }

  /**
   * Obtiene estadísticas del cache
   */
  async getCacheStats(): Promise<{
    totalEntries: number;
    totalSize: number;
    oldestEntry: number;
    newestEntry: number;
  }> {
    await this.dbReady;
    if (!this.db) {
      return {
        totalEntries: 0,
        totalSize: 0,
        oldestEntry: 0,
        newestEntry: 0,
      };
    }

    return new Promise((resolve) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const results = request.result;
        let totalSize = 0;
        let oldestEntry = Date.now();
        let newestEntry = 0;

        results.forEach((entry: any) => {
          totalSize += entry.size;
          oldestEntry = Math.min(oldestEntry, entry.timestamp);
          newestEntry = Math.max(newestEntry, entry.timestamp);
        });

        resolve({
          totalEntries: results.length,
          totalSize,
          oldestEntry,
          newestEntry,
        });
      };

      request.onerror = () => {
        resolve({
          totalEntries: 0,
          totalSize: 0,
          oldestEntry: 0,
          newestEntry: 0,
        });
      };
    });
  }

  // Métodos privados de IndexedDB

  private initializeIndexedDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onerror = () => {
        console.error('Error opening IndexedDB for images:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          const objectStore = db.createObjectStore(this.STORE_NAME, {
            keyPath: 'url',
          });
          objectStore.createIndex('expiresAt', 'expiresAt', { unique: false });
          objectStore.createIndex('timestamp', 'timestamp', { unique: false });
          objectStore.createIndex('mimeType', 'mimeType', { unique: false });
        }
      };
    });
  }

  private async saveToIndexedDB(
    url: string,
    entry: ImageCacheEntry
  ): Promise<void> {
    try {
      await this.dbReady;
      if (!this.db) return;

      const transaction = this.db.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);

      store.put({ url, ...entry });

      await new Promise<void>((resolve, reject) => {
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      });
    } catch (error) {
      console.error('Error saving image to IndexedDB:', error);
    }
  }

  private async loadFromIndexedDB(
    url: string
  ): Promise<ImageCacheEntry | null> {
    try {
      await this.dbReady;
      if (!this.db) return null;

      const transaction = this.db.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.get(url);

      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          const result = request.result;
          if (result) {
            const { url: _, ...entry } = result;
            resolve(entry as ImageCacheEntry);
          } else {
            resolve(null);
          }
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error loading image from IndexedDB:', error);
      return null;
    }
  }

  private async deleteFromIndexedDB(url: string): Promise<void> {
    try {
      await this.dbReady;
      if (!this.db) return;

      const transaction = this.db.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      store.delete(url);
    } catch (error) {
      console.error('Error deleting image from IndexedDB:', error);
    }
  }

  private storeCacheEntry(url: string, blob: Blob): void {
    const entry: ImageCacheEntry = {
      blob,
      mimeType: blob.type,
      size: blob.size,
      timestamp: Date.now(),
      expiresAt: Date.now() + this.cacheDuration,
      url,
    };

    this.metrics.totalSize += blob.size;
    this.saveToIndexedDB(url, entry);
  }

  private initializeCache(): void {
    // Cargar cache desde IndexedDB al iniciar
    this.dbReady.then(() => {
      this.loadAllFromIndexedDB();
    });

    // Limpieza automática cada 24 horas
    setInterval(
      () => {
        this.cleanExpiredCache();
      },
      24 * 60 * 60 * 1000
    );
  }

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
          const { url, blob, expiresAt } = result;

          // Solo cargar si no ha expirado
          if (expiresAt > now) {
            const blobUrl = URL.createObjectURL(blob);
            this.cache.set(url, blobUrl);
            loadedCount++;
          } else {
            // Eliminar entradas expiradas
            this.deleteFromIndexedDB(url);
            expiredCount++;
          }
        });

        // if (loadedCount > 0) {
        //   console.log(`📥 Loaded ${loadedCount} images from IndexedDB cache`);
        // }
        // if (expiredCount > 0) {
        //   console.log(
        //     `🧹 Removed ${expiredCount} expired images from IndexedDB`
        //   );
        // }
      };

      request.onerror = () => {
        console.error('Error loading all images from IndexedDB:', request.error);
      };
    } catch (error) {
      console.error('Error in loadAllFromIndexedDB:', error);
    }
  }

  /**
   * Limpia los Blob URLs al destruir el servicio
   */
  ngOnDestroy(): void {
    this.cache.forEach((blobUrl) => {
      URL.revokeObjectURL(blobUrl);
    });
    this.cache.clear();
  }
}