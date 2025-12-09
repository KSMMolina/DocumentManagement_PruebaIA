import { AsyncPipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  HostBinding,
  Component,
  ElementRef,
  Renderer2,
  computed,
  inject,
  signal,
  input,
} from "@angular/core";
import { Assets } from "@assets";
import { safeEffect } from "@shared/signals/signal";
import { ItemSkeletonComponent } from "../item-skeleton/item-skeleton.component";
import { IconService } from "@icon.service";
import {
  transformBooleanInput,
  transformUpperCaseInput,
} from "@shared/utils/transform-input";
import { finalize, Observable, Subject, takeUntil } from "rxjs";
import { SafeHtml } from "@angular/platform-browser";

export type IconSize =
  | "s"
  | "xs"
  | "m"
  | "l"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "6xl"
  | "7xl"
  | "8xl"
  | "9xl";

@Component({
  selector: "app-icon",
  templateUrl: "./icon.component.html",
  styleUrl: "./icon.component.scss",
  imports: [ItemSkeletonComponent, AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent {
  @HostBinding("class") defaultClass = "center-all icon-wrapper";

  /**
   * Indica si el icono es svg
   * @default true
   */
  public isSvg = input(true, { transform: transformBooleanInput });

  /**
   * Icono
   */
  public icon = input("", { transform: transformUpperCaseInput });

  /**
   * Clases adicionales
   * @default ''
   */
  public classes = input<string>();

  /**
   * Tamaño del icono
   * @default 'l'
   */
  public size = input<IconSize>();

  /**
   * Color del icono
   */
  public color = input<string>();

  /**
   * Habilita carga lazy para el icono
   * @default false
   */
  public lazy = input(false, { transform: transformBooleanInput });

  /**
   * Precarga el icono
   * @default false
   */
  public preload = input(false, { transform: transformBooleanInput });

  /**
   * Optimizaciones personalizadas para el SVG
   */
  public optimizationOptions = input<{
    removeComments?: boolean;
    removeMetadata?: boolean;
    removeDimensions?: boolean;
    optimizePaths?: boolean;
  }>();

  public iconUrl = computed(() => `${Assets.icons[this.icon()]}`);

  public iconClassSize = computed(
    () => ` width-${this.size()} height-${this.size()}`
  );

  public iconClass = computed(() =>
    (
      this.classes() + (!this.size() ? " width-50" : this.iconClassSize())
    ).trimStart()
  );

  public isLoading = signal(false);
  public hasError = signal(false);
  public isLoad = signal(false);

  public iconSvg?: Observable<SafeHtml>;

  private destroy$ = new Subject<void>();

  private iconService: IconService = inject(IconService);
  private intersectionObserver?: IntersectionObserver;
  private elementRef: ElementRef = inject(ElementRef);
  private renderer2: Renderer2 = inject(Renderer2);

  constructor() {
    // Efecto para generar SVG cuando cambian las propiedades relevantes
    safeEffect(() => {
      if (this.isSvg() && this.icon()) {
        this.lazy() ? this.setupLazyLoading() : this.generateSvg();
      }
    }, [
      this.icon,
      this.isSvg,
      this.color,
      this.size,
      this.optimizationOptions,
    ]);

    // Efecto para precargar si es necesario
    safeEffect(
      (preload) => {
        if (preload && this.isSvg() && this.icon() && !this.lazy())
          this.preloadIcon();
      },
      [this.preload]
    );
  }

  private setupLazyLoading(): void {
    if ("IntersectionObserver" in window) {
      this.intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.generateSvg();
              this.intersectionObserver?.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: "50px", // Cargar cuando esté a 50px de ser visible
        }
      );

      this.intersectionObserver.observe(this.elementRef.nativeElement);
    }
    // Fallback para navegadores sin IntersectionObserver
    else this.generateSvg();
  }

  private generateSvg(): void {
    if (!this.icon() || !this.isSvg()) return;

    this.isLoading.set(true);
    this.hasError.set(false);
    this.isLoad.set(false);

    // Aplicar clases CSS al elemento
    this.applyIconClasses();

    // Preparar opciones de optimización
    const optimizationOptions = {
      removeComments: true,
      removeMetadata: true,
      removeDimensions: true,
      optimizePaths: true,
      ...this.optimizationOptions(),
    };

    // Obtener el icono optimizado
    this.iconSvg = this.iconService
      .getIcon(this.iconUrl(), optimizationOptions)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isLoading.set(false);
        })
      );

    // Suscribirse para manejar el resultado
    this.iconSvg.subscribe({
      next: () => {
        this.isLoad.set(true);
        this.hasError.set(false);
      },
      error: (error) => {
        console.error("Error loading icon:", error);
        this.hasError.set(true);
        this.isLoad.set(false);
      },
    });
  }

  private preloadIcon(): void {
    if (!this.icon() || !this.isSvg()) {
      return;
    }

    const optimizationOptions = {
      removeComments: true,
      removeMetadata: true,
      removeDimensions: true,
      optimizePaths: true,
      ...this.optimizationOptions(),
    };

    // Precargar sin suscribirse al resultado
    this.iconService
      .getIcon(this.iconUrl(), optimizationOptions)
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  private applyIconClasses(): void {
    // Limpiar clases anteriores
    this.elementRef.nativeElement.className = "center-all icon-wrapper";

    // Aplicar nuevas clases
    this.iconClass()
      .split(" ")
      .filter((cls) => cls.trim())
      .forEach((cls) =>
        this.renderer2.addClass(this.elementRef.nativeElement, cls)
      );
  }

  /**
   * Método público para forzar la recarga del icono
   */
  public reloadIcon(): void {
    if (this.isSvg()) {
      this.generateSvg();
    } else {
      // Para imágenes regulares, disparar evento de recarga
      const imgElement = this.elementRef.nativeElement.querySelector("img");
      if (imgElement) {
        imgElement.src = imgElement.src; // Forzar recarga
      }
    }
  }

  /**
   * Obtiene métricas del servicio de iconos
   */
  public getIconMetrics() {
    return this.iconService.getMetrics();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }
}
