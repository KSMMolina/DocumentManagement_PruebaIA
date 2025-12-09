import { NgStyle } from "@angular/common";
import {
  ChangeDetectionStrategy,
  HostListener,
  ElementRef,
  Component,
  viewChild,
  computed,
  signal,
  output,
  input,
  model,
} from "@angular/core";
import { Dialog } from "@shared/services/local/dialog.service";
import { ButtonComponent } from "@shared/ui/components/button/button.component";
import { IconComponent } from "@shared/ui/components/icon/icon.component";
import { PdfViewerModule } from "ng2-pdf-viewer";
import { PinchZoomComponent } from "@meddv/ngx-pinch-zoom";
import { IPost } from "@shared/Core/social-network/post/domain/interfaces";
import { IGeneric } from "@shared/Core/architecture/interface/generic.interface";

export type MediaKind = "image" | "pdf";
export interface MediaItem {
  kind: MediaKind;
  index: number;
  url: string;
  id: string;
}

@Component({
  selector: "app-fullscreen",
  imports: [
    PinchZoomComponent,
    ButtonComponent,
    PdfViewerModule,
    IconComponent,
    NgStyle,
  ],

  templateUrl: "./fullscreen.component.html",
  styleUrl: "./fullscreen.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FullscreenComponent implements Dialog {
  public galleryFullscreen =
    viewChild<ElementRef<HTMLElement>>("galleryFullscreen");

  public imageZoom = viewChild<ElementRef<HTMLElement>>("imageZoom");
  public imageRef = viewChild<ElementRef<HTMLElement>>("imageRef");

  public dialogClose = output();

  /**
   * Lista de archivos
   */
  public files = input<IGeneric.Files[]>();

  public indexSelected = model(0);

  /**
   *CARRUSEL
   */

  public windowWidth = signal(window.innerWidth);

  public trackAnimating = signal(false);

  private dragging = signal(false);

  // Posición inicial y desplazamiento acumulado del gesto
  private dragStartX = signal(0);

  private dragDeltaX = signal(0);

  public isCarouselDisabled = computed(
    () => this.files().length <= 1 || this.isZoomed()
  );

  // Estado de zoom para deshabilitar carrusel
  public currentZoomScale = signal(1);

  public isZoomed = computed(() => this.currentZoomScale() > 1);

  // Calcula el transform de la “track” según el índice actual + arrastre
  public trackTransform = computed(() => {
    const base = -this.indexSelected() * this.windowWidth();
    return `translateX(${base + this.dragDeltaX()}px)`;
  });

  // Recalcula ancho al cambiar el tamaño de la ventana
  @HostListener("window:resize")
  remeasure() {
    this.windowWidth.set(window.innerWidth);
  }

  /* Inicio del gesto */
  slideStart(ev: MouseEvent | TouchEvent) {
    if (this.isCarouselDisabled()) return;
    this.dragStartX.set(this.getClientX(ev));
    this.trackAnimating.set(false); // desactiva transición mientras arrastras
    this.dragging.set(true);
    this.dragDeltaX.set(0);
  }

  /* Movimiento */
  slideMove(ev: MouseEvent | TouchEvent) {
    if (!this.dragging() || this.isCarouselDisabled()) return;
    const x = this.getClientX(ev);
    const delta = x - this.dragStartX();
    const idx = this.indexSelected();
    const last = this.files().length - 1;

    const clamped =
      idx === 0
        ? Math.min(0, delta) // no ir atrás en el primer slide
        : idx === last
        ? Math.max(0, delta) // no ir adelante en el último
        : delta;

    this.dragDeltaX.set(clamped);
  }

  /* Fin del gesto: aplica umbral 50% para decidir si cambiar de slide */
  slideEnd() {
    if (!this.dragging()) return;

    const disabled = this.isCarouselDisabled();
    this.dragging.set(false);

    if (disabled) {
      this.trackAnimating.set(false);
      this.dragDeltaX.set(0);
      return;
    }

    const dx = this.dragDeltaX();
    const threshold = this.windowWidth() * 0.5; // mitad de pantalla como umbral
    let next = this.indexSelected();

    // Swipe izquierda = avanzar, swipe derecha = retroceder
    if (dx <= -threshold) next = Math.min(next + 1, this.files().length - 1);
    else if (dx >= threshold) next = Math.max(next - 1, 0);

    // Actualiza índice y dispara animación
    this.indexSelected.set(next);
    this.trackAnimating.set(true);
    this.dragDeltaX.set(0);
  }

  // Normaliza eventos de mouse y touch para obtener coordenada X
  private getClientX(ev: MouseEvent | TouchEvent): number {
    return ev instanceof MouseEvent ? ev.clientX : ev.touches[0]?.clientX ?? 0;
  }

  // Navegación por teclado
  @HostListener("window:keydown", ["$event"])
  onKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        if (!this.isCarouselDisabled()) {
          const next = Math.max(this.indexSelected() - 1, 0);
          this.indexSelected.set(next);
          this.trackAnimating.set(true);
        }
        break;
      case "ArrowRight":
        event.preventDefault();
        if (!this.isCarouselDisabled()) {
          const next = Math.min(
            this.indexSelected() + 1,
            this.files().length - 1
          );
          this.indexSelected.set(next);
          this.trackAnimating.set(true);
        }
        break;
      case "Escape":
        event.preventDefault();
        this.dialogClose.emit();
        break;
    }
  }
  /**
   * END CARRUSEL
   */

  /**
   * ZOOM INTEGRATION
   */

  // Configuración de zoom para diferentes tipos de interacción
  public zoomConfig = {
    wheel: {
      transitionDuration: 200,
      doubleTap: false,
      wheelZoom: true,
      minScale: 1,
      maxScale: 3,
    },
    hover: {
      transitionDuration: 300,
      wheelZoom: false,
      doubleTap: false,
      minScale: 1,
      maxScale: 2,
    },
    move: {
      transitionDuration: 150,
      wheelZoom: false,
      doubleTap: false,
      minScale: 1,
      maxScale: 2.5,
    },
    click: {
      wheelZoom: false,
      transitionDuration: 300,
      doubleTap: true,
      doubleTapScale: 2,
      minScale: 1,
      maxScale: 3,
    },
  };

  // Tipo de zoom actual (por defecto 'click' para móvil y desktop)
  public currentZoomType = signal<"wheel" | "hover" | "move" | "click">(
    "click"
  );

  public getCurrentZoomConfig() {
    return this.zoomConfig[this.currentZoomType()];
  }

  // Cambiar tipo de zoom dinámicamente
  public setZoomType(type: "wheel" | "hover" | "move" | "click") {
    this.currentZoomType.set(type);
  }

  // Detectar si es dispositivo móvil para optimizar configuración
  public isMobile(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }

  //desactiva carrusel
  public onZoomChange(event: any) {
    const scale =
      typeof event === "number" ? event : event?.scale || event?.detail || 1;
    this.currentZoomScale.set(scale);
  }
  /*END ZOOM */
}
