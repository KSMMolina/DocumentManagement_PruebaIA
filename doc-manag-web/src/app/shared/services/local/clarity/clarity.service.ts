// libs/clarity/clarity.service.ts
import { Injectable, Inject, Optional, signal } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { filter } from "rxjs/operators";
import Clarity from "@microsoft/clarity";
import { CLARITY_CONFIG, ClarityConfig } from "./clarity-config";

@Injectable({ providedIn: "root" })
export class ClarityService {
  private initialized = signal(false);
  private lastEventTimestamps = new Map<string, number>();
  private cfg: Required<ClarityConfig>;

  constructor(
    private router: Router,
    @Optional() @Inject(CLARITY_CONFIG) config?: ClarityConfig
  ) {
    // Valores por defecto
    this.cfg = {
      projectId: config?.projectId || "",
      runInit: config?.runInit ?? false,
      autoTrackPages: config?.autoTrackPages ?? false,
      autoTrackErrors: config?.autoTrackErrors ?? false,
      throttleIntervalMs: config?.throttleIntervalMs ?? 5000,
    };

    if (window.localStorage.getItem("disabledClarity")) return;

    if (!this.cfg.projectId)
      console.error("ClarityService: projectId requerido");
    else if (this.cfg.runInit) this.initSDK();
  }

  /** Inicializa SDK y trackers automáticos */
  private initSDK(): void {
    Clarity.init(this.cfg.projectId);
    this.initialized.set(true);
    if (this.cfg.autoTrackPages) this.trackPageViews();
    if (this.cfg.autoTrackErrors) this.trackErrors();
  }

  /** Rastrea vistas de página en cada navegación SPA */
  trackPageViews(): void {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((nav: NavigationEnd) => {
        this.event("PageView", { url: nav.urlAfterRedirects });
      });
  }

  /**
   * Dispara un evento personalizado en Clarity.
   * @param name - Nombre del evento.
   * @param properties - (Opcional) Propiedades que se añadirán como tags.
   */
  event(name: string, properties?: Record<string, any>): void {
    if (!this.initialized) {
      console.warn("ClarityService: event antes de init");
      return;
    }
    const now = Date.now();
    const last = this.lastEventTimestamps.get(name) || 0;
    if (now - last < this.cfg.throttleIntervalMs) {
      return;
    }
    this.lastEventTimestamps.set(name, now);

    // Si hay propiedades, las guardamos como tags de sesión
    if (properties) {
      Object.entries(properties).forEach(([key, value]) => {
        Clarity.setTag(key, String(value));
      });
    }

    // Clarity.event solo acepta el nombre del evento
    Clarity.event(name);
  }

  /**
   * Identifica al usuario actual.
   * @param userId - ID único de usuario.
   * @param customSessionId - (Opcional) Sesión personalizada.
   */
  identify(userId: string, customSessionId?: string): void {
    if (!this.initialized) return;
    Clarity.identify(userId, customSessionId);
  }

  /**
   * Añade metadata global para la sesión actual.
   * @param key - Clave del tag.
   * @param value - Valor del tag.
   */
  setTag(key: string, value: string | string[]): void {
    if (!this.initialized) return;
    Clarity.setTag(key, value);
  }

  /**
   * Captura errores JS no gestionados y promesas rechazadas.
   */
  private trackErrors(): void {
    window.addEventListener("error", (e: ErrorEvent) => {
      this.event("JSError", {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
      });
    });
    window.addEventListener(
      "unhandledrejection",
      (e: PromiseRejectionEvent) => {
        this.event("UnhandledRejection", { reason: e.reason });
      }
    );
  }

  /**
   * Registra métricas de rendimiento de carga de página.
   */
  trackPerformance(): void {
    if (!("performance" in window)) return;
    const t = (window as any).performance.timing;
    this.event("PerformanceMetrics", {
      loadTime: t.loadEventEnd - t.navigationStart,
      domReady: t.domContentLoadedEventEnd - t.navigationStart,
    });
  }
}
