import { LayoutService } from "@layout.service";
import {
  EnvironmentInjector,
  createComponent,
  ApplicationRef,
  ComponentRef,
  TemplateRef,
  ElementRef,
  Directive,
  Renderer2,
  OnDestroy,
  Injector,
  inject,
  output,
  signal,
  input,
  model,
} from "@angular/core";
import { safeEffect } from "@shared/signals/signal";
import { Subscription, fromEvent, timer } from "rxjs";
import { OverlayComponent } from "@shared/ui/components/overlay/overlay.component";
import { isClickFromOmittedElement } from "@shared/services/local/helper.service";
import { transformBooleanInput } from "@shared/utils/transform-input";

/**
 * Defines the types of activation modes for the overlay.
 */
type ActivationBy = "hover" | "click";

/**
 * Defines the possible positions of the overlay relative to the target element.
 */
type PositionsOverlay =
  | "top-left"
  | "top-center"
  | "top-right"
  | "right-center"
  | "left-center"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

/**
 * Defines the offset values for overlay positioning.
 */
interface OffsetPositionOverlay {
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
}

export type ActionOverlayExecutedBy =
  | "manualOpen"
  | "manualClose"
  | "parentOpen"
  | "parentClose"
  | "insideClose"
  | "outsideClose";

export type ActionOverlay = "open" | "close";

/**
 * A custom directive to create an overlay that can be activated by hover or click.
 * Allows for dynamic positioning and adjustment based on the parent element size.
 * This overlay is used for the panel in SelecCustom and AutocompleteCustom
 * Author: Jesús David Muñoz Gallego
 *
 * @example
 * <div appOverlay
 *      [overlayPosition]="'bottom-center'"
 *      [overlayHTML]="overlayTemplate"
 *      [overlayActivateBy]="'hover'"
 *      [closeInsideOverlay]="true"
 *      [overlayWidth]="'200px'"
 * >
 * </div>
 */
@Directive({
  selector: "[appOverlay]",
  standalone: true,
})
export class OverlayDirective implements OnDestroy {
  private environmentInjector = inject(EnvironmentInjector);
  private applicationRef = inject(ApplicationRef);
  private layoutService = inject(LayoutService);
  private elementRef = inject(ElementRef);
  private renderer = inject(Renderer2);
  private injector = inject(Injector);

  public overlayHTML = input<TemplateRef<any>>(undefined, {
    alias: "appOverlay",
  }); // The content of the overlay, either text or a template.

  public actionOverlayExecutedBy = output<ActionOverlayExecutedBy>(); // Emits the status change of the overlay (opened/closed).

  public overlayActivateBy = input<ActivationBy>("click"); // Mode of activation (hover or click).
  public overlayPosition = input<PositionsOverlay>("bottom-center"); // Position of the overlay relative to the target element.
  public offsetPositionOverlay = input<OffsetPositionOverlay>(); // Optional offset adjustments for overlay positioning.
  public closeInsideOverlay = input(false, {
    transform: transformBooleanInput,
  }); // Determines if clicking inside the overlay should close it.
  public closeInsideParent = input(false, {
    transform: transformBooleanInput,
  }); // Determines if clicking inside the parent should close it.
  public overlayWidth = input<string>(""); // Sets a specific width for the overlay.
  public overlayContext = input<any>({});

  public overlayFullScreen = input(false, {
    transform: transformBooleanInput,
  });

  public actionOverlay = model<ActionOverlay>("close");
  public disableOverlay = input(false, {
    transform: transformBooleanInput,
  });

  private isOverlayOpened = signal(false); // Tracks the open state of the overlay.

  private overlayComponentRef = signal<ComponentRef<OverlayComponent>>(null); // The main element of the overlay.
  private overlayElement = signal<HTMLElement>(null); // The main element of the overlay.

  private parentResizeObserver!: ResizeObserver; // Observer for resizing the parent element.
  private timerSubscription!: Subscription; // Timer for tooltip delay actions.
  private resizeObserver!: ResizeObserver; // Observer for resizing the tooltip element.
  private subscriptions: Subscription[] = []; // Array of subscriptions for event management.

  constructor() {
    safeEffect(
      (overlayHTML, disableOverlay) => {
        this.clearSubscriptions();
        overlayHTML && !disableOverlay && this.setupEventSubscriptions();
      },
      [this.overlayHTML, this.disableOverlay]
    );

    safeEffect(
      (action) => {
        if (action === "open") {
          this.showOverlay();
          this.actionOverlayExecutedBy.emit("manualOpen");
        } else if (action === "close") {
          this.removeOverlay();
          this.actionOverlayExecutedBy.emit("manualClose");
        }
      },
      [this.actionOverlay]
    );

    safeEffect(
      (isMobile) => {
        isMobile
          ? this.disconnectResizeObserver()
          : this.observeParentSizeChanges();
        if (!this.isOverlayOpened()) return;
        this.removeOverlay();
        this.showOverlay();
      },
      [this.layoutService.isMobile]
    );
  }

  private clearSubscriptions() {
    this.subscriptions.forEach((subscription) => subscription?.unsubscribe());
    this.subscriptions = [];
  }

  /**
   * Sets up event listeners based on the activation method (hover or click).
   * Adds listeners to handle showing, hiding, and toggling the overlay.
   */
  private setupEventSubscriptions() {
    this.clearSubscriptions();

    const eventOverlay = (action: "show" | "remove") => {
      if (this.timerSubscription) this.timerSubscription.unsubscribe();

      this.timerSubscription = timer(150).subscribe(() => {
        action === "show" ? this.showOverlay() : this.removeOverlay();
        this.actionOverlayExecutedBy.emit(
          action === "show" ? "parentOpen" : "parentClose"
        );
      });
    };

    switch (this.overlayActivateBy()) {
      case "hover":
        if (this.layoutService.isMobile()) {
          this.subscriptions.push(
            fromEvent(this.elementRef.nativeElement, "click").subscribe(
              (event) => {
                if (
                  isClickFromOmittedElement(event as Event, "omit-click-select")
                )
                  return;

                eventOverlay(
                  this.isOverlayOpened() && this.closeInsideParent()
                    ? "remove"
                    : "show"
                );
              }
            )
          );
        } else {
          this.subscriptions.push(
            fromEvent(this.elementRef.nativeElement, "mouseenter").subscribe(
              () => eventOverlay("show")
            )
          );
          this.subscriptions.push(
            fromEvent(this.elementRef.nativeElement, "mouseleave").subscribe(
              () => eventOverlay("remove")
            )
          );
        }
        break;
      case "click":
        this.subscriptions.push(
          fromEvent(this.elementRef.nativeElement, "click").subscribe(
            (event) => {
              if (
                isClickFromOmittedElement(event as Event, "omit-click-select")
              )
                return;

              eventOverlay(
                this.isOverlayOpened() && this.closeInsideParent()
                  ? "remove"
                  : "show"
              );
            }
          )
        );
        break;
    }

    this.subscriptions.push(
      fromEvent(this.elementRef.nativeElement, "focus").subscribe(() =>
        eventOverlay("show")
      )
    );
  }

  /**
   * Observes changes in the size of the parent element to adjust overlay positioning.
   */
  private observeParentSizeChanges(): void {
    this.parentResizeObserver = new ResizeObserver(
      () => this.isOverlayOpened() && this.adjustPosition()
    );
    this.disconnectResizeObserver();
    this.parentResizeObserver.observe(this.elementRef.nativeElement);
  }

  private disconnectResizeObserver() {
    this.parentResizeObserver?.disconnect();
  }

  /**
   * Handles document click events to close the overlay if clicked outside.
   * @param event - The click event.
   */
  private onDocumentClick = (event: Event) => {
    if (this.timerSubscription) this.timerSubscription?.unsubscribe();

    if (this.isOverlayOpened()) {
      const targetElement = event.target as HTMLElement;
      let overlayComponent = this.overlayComponentRef().location
        .nativeElement as HTMLElement;

      if (
        ["APP-NOTIFICATION", "APP-OVERLAY"].includes(
          overlayComponent?.nextElementSibling?.tagName
        )
      )
        return;

      if (this.layoutService.isMobile())
        overlayComponent = overlayComponent.children?.[1] as HTMLElement;

      const clickedInsideParent =
        this.elementRef.nativeElement.contains(targetElement);
      const clickedInsideOverlay = overlayComponent?.contains(targetElement);

      if (
        (this.closeInsideParent() && clickedInsideParent) ||
        (this.closeInsideOverlay() && clickedInsideOverlay) ||
        (!clickedInsideParent && !clickedInsideOverlay)
      ) {
        this.actionOverlayExecutedBy.emit(
          `${
            clickedInsideParent
              ? "parent"
              : clickedInsideOverlay
              ? "inside"
              : "outside"
          }Close`
        );
        this.removeOverlay();
      }
    }
  };

  /**
   * Event handler for window resize and scroll events to adjust overlay positioning.
   */
  private onWindowEvent = (): void => {
    this.overlayComponentRef().location.nativeElement &&
      this.isOverlayOpened() &&
      this.adjustPosition();
  };

  /**
   * Shows the overlay by creating the overlay element.
   */
  private showOverlay = () => {
    if (!this.overlayHTML() || this.isOverlayOpened()) return;

    this.isOverlayOpened.set(true);
    this.actionOverlay.set("open");

    this.createOverlayElement();
  };

  /**
   * Removes the overlay and cleans up the event subscriptions and observers.
   */
  private removeOverlay = () => {
    if (!this.isOverlayOpened()) return;

    const destroyOverlay = () => {
      if (this.overlayComponentRef()) {
        this.applicationRef.detachView(this.overlayComponentRef().hostView);
        this.overlayComponentRef().destroy();
        this.overlayComponentRef.set(null);
      }

      this.isOverlayOpened.set(false);
      this.actionOverlay.set("close");

      if (this.parentResizeObserver) this.parentResizeObserver.disconnect();
      if (this.resizeObserver) this.resizeObserver.disconnect();

      window.removeEventListener("click", this.onDocumentClick, true);
      window.removeEventListener("scroll", this.onWindowEvent, true);
      window.removeEventListener("resize", this.onWindowEvent, true);
      this.renderer.removeClass(document.body, "overlay-opened");
    };

    this.overlayComponentRef().setInput("hideOverlay", true);
    setTimeout(() => destroyOverlay(), 200);
  };

  /**
   * Creates the overlay element, sets its content, and positions it correctly.
   */
  private createOverlayElement = () => {
    this.overlayComponentRef.set(
      createComponent(OverlayComponent, {
        environmentInjector: this.environmentInjector,
        elementInjector: this.injector,
      })
    );

    this.overlayElement.set(this.overlayComponentRef().location.nativeElement);

    this.applicationRef.attachView(this.overlayComponentRef().hostView);
    document.body.appendChild(this.overlayElement());

    this.overlayComponentRef().setInput("template", this.overlayHTML());
    this.overlayComponentRef().setInput("context", this.overlayContext());
    this.overlayComponentRef().setInput("fullScreen", this.overlayFullScreen());

    this.overlayComponentRef().instance.overlayClose.subscribe(() =>
      this.removeOverlay()
    );

    if (this.layoutService.isMobile()) {
      this.renderer.setStyle(this.overlayElement(), "position", "fixed");
      this.renderer.setStyle(this.overlayElement(), "z-index", "100");
      this.renderer.setStyle(this.overlayElement(), "height", "100%");
      this.renderer.setStyle(this.overlayElement(), "width", "100%");
      this.renderer.setStyle(this.overlayElement(), "left", "0");
      this.renderer.setStyle(this.overlayElement(), "top", "0");

      this.renderer.addClass(document.body, "overlay-opened");
    } else {
      this.renderer.setStyle(this.overlayElement(), "visibility", "hidden");

      requestAnimationFrame(() => {
        if (this.overlayElement()) {
          this.adjustPosition();
          this.renderer.setStyle(
            this.overlayElement(),
            "visibility",
            "visible"
          );

          this.resizeObserver = new ResizeObserver(() => {
            this.adjustPosition();
          });
          this.resizeObserver.observe(this.overlayElement());
        }
      });

      window.addEventListener("scroll", this.onWindowEvent, true);
      window.addEventListener("resize", this.onWindowEvent, true);
    }

    window.addEventListener("click", this.onDocumentClick, true);
  };

  /**
   * Adjusts the position of the overlay based on the configured position and offsets.
   */
  private adjustPosition = () => {
    if (!this.elementRef?.nativeElement || !this.overlayElement()) return;

    const hostPos = this.elementRef.nativeElement.getBoundingClientRect();
    const overlayPos = this.overlayElement().getBoundingClientRect();
    this.renderer.setStyle(
      this.overlayElement(),
      "width",
      `${this.overlayWidth() || hostPos.width + "px"}`
    );

    if (hostPos && overlayPos) {
      let top = hostPos.top,
        left = hostPos.left;

      const defaultMargin = 5;

      // Positioning logic based on the specified overlayPosition
      switch (this.overlayPosition()) {
        case "top-left":
          top = hostPos.top - overlayPos.height - defaultMargin;
          left = hostPos.left;
          break;
        case "top-center":
          top = hostPos.top - overlayPos.height - defaultMargin;
          left = hostPos.left + hostPos.width / 2 - overlayPos.width / 2;
          break;
        case "top-right":
          top = hostPos.top - overlayPos.height - defaultMargin;
          left = hostPos.right - overlayPos.width;
          break;
        case "right-center":
          top = hostPos.top + hostPos.height / 2 - overlayPos.height / 2;
          left = hostPos.right + defaultMargin;
          break;
        case "left-center":
          top = hostPos.top + hostPos.height / 2 - overlayPos.height / 2;
          left = hostPos.left - overlayPos.width - defaultMargin;
          break;
        case "bottom-left":
          top = hostPos.bottom + defaultMargin;
          left = hostPos.left;
          break;
        case "bottom-center":
          top = hostPos.bottom + defaultMargin;
          left = hostPos.left + hostPos.width / 2 - overlayPos.width / 2;
          break;
        case "bottom-right":
          top = hostPos.bottom + defaultMargin;
          left = hostPos.right - overlayPos.width;
          break;
      }

      // Adjust position based on optional offset configuration
      const adjustOffsetPositionOverlay = () => {
        if (this.offsetPositionOverlay()) {
          Object.keys(this.offsetPositionOverlay()).forEach((key) => {
            if (["bottom", "top"].includes(key)) {
              top =
                top +
                this.offsetPositionOverlay()[
                  key as keyof OffsetPositionOverlay
                ];
            }
            if (["left", "right"].includes(key)) {
              left =
                left +
                this.offsetPositionOverlay()[
                  key as keyof OffsetPositionOverlay
                ];
            }
          });
        }
      };

      adjustOffsetPositionOverlay();

      // Adjust to keep overlay within view bounds
      if (top < window.scrollY) top = hostPos.bottom + defaultMargin;
      if (top + overlayPos?.height > window.scrollY + window.innerHeight)
        top = hostPos.top - overlayPos?.height - defaultMargin;
      if (left < 0) left = hostPos.right + defaultMargin;
      if (left + overlayPos?.width > window.innerWidth)
        left = hostPos.left - overlayPos?.width - defaultMargin;

      // adjustOffsetPositionOverlay();

      // Ensure tooltip stays within visible bounds
      top = Math.max(top, window.scrollY);
      left = Math.max(left, defaultMargin);

      // Apply positioning styles to overlay element
      this.renderer.setStyle(this.overlayElement(), "top", `${top}px`);
      this.renderer.setStyle(this.overlayElement(), "left", `${left}px`);
      this.renderer.setStyle(this.overlayElement(), "position", "fixed");
      this.renderer.setStyle(this.overlayElement(), "z-index", "100");
    }
  };

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription?.unsubscribe());

    this.removeOverlay();
  }
}
