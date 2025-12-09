import { NgClass, NgTemplateOutlet } from "@angular/common";
import {
  ChangeDetectionStrategy,
  TemplateRef,
  Component,
  inject,
  output,
  input,
  viewChild,
  ElementRef,
  Renderer2,
  OnDestroy,
} from "@angular/core";
import { LayoutService } from "@layout.service";
import {
  fadeInCustomAnimation,
  slideCustomAnimation,
} from "@shared/animations/animations.global";
import { safeEffect } from "@shared/signals/signal";
import { transformBooleanInput } from "@shared/utils/transform-input";
import { Subscription, timer } from "rxjs";

@Component({
  selector: "app-overlay",
  imports: [NgClass, NgTemplateOutlet],
  templateUrl: "./overlay.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    fadeInCustomAnimation("fadeInOut", { enter: "200ms", leave: "200ms" }),
    slideCustomAnimation("slideEnterAndLeaveBottom", "Y", "1rem", "0", {
      enter: "200ms",
      leave: "200ms",
    }),
  ],
})
export class OverlayComponent implements OnDestroy {
  public layoutService = inject(LayoutService);
  private elementRef = inject(ElementRef);
  private renderer = inject(Renderer2);

  public overlayContent =
    viewChild<ElementRef<HTMLDivElement>>("overlayContent");

  /**
   * Evento de cierre del overlay
   */
  public overlayClose = output<void>();

  /**
   * Template del overlay
   */
  public template = input.required<TemplateRef<any>>();

  /**
   * Contexto del template
   */
  public context = input<any>();

  /**
   * Indica si el overlay ocupa el 90% de la pantalla
   */
  public fullScreen = input(false, { transform: transformBooleanInput });

  /**
   * Indica si oculta el overlay
   */
  public hideOverlay = input<boolean>();

  private timerSubscription!: Subscription;

  constructor() {
    safeEffect(
      (isMobile, fullScreen) =>
        isMobile && fullScreen ? this.initListeners() : this.removeListeners(),
      [this.layoutService.isMobile, this.fullScreen]
    );
  }

  private initListeners(): void {
    this.removeListeners();

    setTimeout(() => {
      this.renderer.setStyle(
        this.overlayContent()?.nativeElement,
        "height",
        `${0}px`
      );
      this.renderer.setStyle(
        this.overlayContent()?.nativeElement,
        "bottom",
        `${0}px`
      );
    }, 0);
    window.visualViewport?.addEventListener("resize", () =>
      this.setPositionOverlayContent()
    );

    this.timerSubscription = timer(300).subscribe(() =>
      this.setPositionOverlayContent()
    );
  }

  private setPositionOverlayContent() {

    const height = window.visualViewport?.height || window.innerHeight;
    const availableHeight = height * 0.9;

    /** Setea el height del body */
    this.renderer?.setStyle(document.body, "height", `${height}px`);

    /** Setea el height del elemento */
    this.renderer?.setStyle(
      this.elementRef.nativeElement,
      "height",
      `${height}px`
    );

    /** Setea el height del overlay content */
    this.renderer?.setStyle(
      this.overlayContent()?.nativeElement,
      "height",
      `${availableHeight}px`
    );

    /** Setea el top del overlay content */
    setTimeout(() => {
      if (!this.overlayContent()) return;
      this.renderer?.setStyle(
        this.overlayContent()?.nativeElement,
        "top",
        `${height - availableHeight}px`
      );

      /** Remueve el bottom del overlay content */
      this.renderer?.removeStyle(this.overlayContent()?.nativeElement, "bottom");
    }, 1000);
  }

  private removeListeners(): void {
    window.visualViewport?.removeEventListener("resize", () =>
      this.setPositionOverlayContent()
    );
  }

  ngOnDestroy(): void {
    this.timerSubscription?.unsubscribe();
    this.removeListeners();
  }
}
