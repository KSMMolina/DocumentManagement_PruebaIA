import {
  ViewContainerRef,
  AfterViewInit,
  TemplateRef,
  ElementRef,
  Directive,
  OnDestroy,
  Renderer2,
  inject,
  signal,
  input,
} from "@angular/core";
import { fromEvent, Subscription, timer } from "rxjs";
import { LayoutService } from "@layout.service";
import { safeEffect } from "@shared/signals/signal";
import { transformBooleanInput } from "@shared/utils/transform-input";

/**
 * Interface for tooltip configuration options.
 */
interface ConfigTooltip {
  position?:
    | "top"
    | "left"
    | "right"
    | "bottom"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"; // Position of the tooltip relative to the target element.
  activationMode?: "hover" | "click"; // Mode of activation (hover or click).
  classes?: string; // Additional CSS classes for styling.
  margin?: {
    top?: number; // Margin from the top edge.
    right?: number; // Margin from the right edge.
    left?: number; // Margin from the left edge.
    bottom?: number; // Margin from the bottom edge.
  };
  onlyWhenTextIsCut?: boolean;
  size?: "m" | "s" | "xs";
  hideArrow?: boolean;
}

/**
 * Defines the offset values for overlay positioning.
 */
interface OffsetPositionTooltip {
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
}

/**
 * Directive to create a customizable tooltip with dynamic positioning and arrow.
 * Author: Jesús David Muñoz Gallego
 */
@Directive({
  selector: "[appTooltip]",
  standalone: true,
})
export class TooltipDirective implements AfterViewInit, OnDestroy {
  public tooltipContent = input<string | TemplateRef<HTMLElement>>("", {
    alias: "appTooltip",
  }); // The content of the tooltip, either text or a template.

  public configTooltip = input<ConfigTooltip>(); // Configuration for tooltip positioning, activation, and styling.
  public offsetPositionTooltip = input<OffsetPositionTooltip>(); // Optional offset adjustments for overlay positioning.
  public hideTooltipInMobile = input(false, {
    transform: transformBooleanInput,
  });

  private arrowTooltipElement = signal<HTMLElement | undefined>(undefined); // Element representing the tooltip arrow.
  private tooltipElement = signal<HTMLElement | undefined>(undefined); // Main tooltip element.

  private parentResizeObserver!: ResizeObserver; // Observer for resizing the parent element.
  private resizeObserver!: ResizeObserver; // Observer for resizing the tooltip element.
  private timerSubscription!: Subscription; // Timer for tooltip delay actions.
  private subscriptions: Subscription[] = []; // Object of subscriptions for event management.

  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly layoutService = inject(LayoutService);
  private readonly elementRef = inject(ElementRef);
  private readonly renderer = inject(Renderer2);

  constructor() {
    safeEffect(
      (tooltipContent) => {
        this.clearSubscriptions();
        tooltipContent && this.setupEventSubscriptions();
      },

      [this.tooltipContent]
    );
  }

  ngAfterViewInit(): void {
    this.elementRef.nativeElement.parentElement?.classList.add(
      "position-relative"
    );

    this.observeParentSizeChanges();

    if (this.configTooltip()?.onlyWhenTextIsCut)
      this.elementRef.nativeElement.classList.add(
        "text-overflow-ellipsis",
        "overflow-hidden",
        "white-space-nowrap"
      );
  }

  private getKeyboardHeight(): number {
    if (window.visualViewport) {
      return window.innerHeight - window.visualViewport.height;
    }

    if (screen.height && window.innerHeight) {
      return screen.height - window.innerHeight;
    }

    return 0;
  }

  private clearSubscriptions() {
    this.subscriptions.forEach((subscription) => subscription?.unsubscribe());
    this.subscriptions = [];
  }

  /**
   * Sets up event subscriptions based on activation mode (hover or click).
   * Adds subscriptions to show, hide, and toggle the tooltip.
   */
  private setupEventSubscriptions() {
    this.clearSubscriptions();
    const event = this.configTooltip()?.activationMode ?? "hover"; // Default activation mode is hover.

    const eventTooltip = (action: "show" | "remove") => {
      if (this.timerSubscription) this.timerSubscription.unsubscribe();

      if (this.hideTooltipInMobile() && this.layoutService.isMobile()) return;

      this.timerSubscription = timer(150).subscribe(() =>
        action === "show" ? this.showTooltip() : this.removeTooltip()
      );
    };

    switch (event) {
      case "hover":
        if (this.layoutService.isMobile()) {
          this.subscriptions.push(
            fromEvent(this.elementRef.nativeElement, "click").subscribe(() =>
              eventTooltip(this.tooltipElement() ? "remove" : "show")
            )
          );
        } else {
          this.subscriptions.push(
            fromEvent(this.elementRef.nativeElement, "mouseenter").subscribe(
              () => eventTooltip("show")
            )
          );

          this.subscriptions.push(
            fromEvent(this.elementRef.nativeElement, "mouseleave").subscribe(
              () => eventTooltip("remove")
            )
          );
        }
        break;
      case "click":
        this.subscriptions.push(
          fromEvent(this.elementRef.nativeElement, "click").subscribe(() =>
            eventTooltip(this.tooltipElement() ? "remove" : "show")
          )
        );
        break;
    }

    this.subscriptions.push(
      fromEvent(this.elementRef.nativeElement, "focus").subscribe(() =>
        eventTooltip("show")
      )
    );

    this.subscriptions.push(
      fromEvent(this.elementRef.nativeElement, "blur").subscribe(() =>
        eventTooltip("remove")
      )
    );
  }

  /**
   * Observes changes in the size of the parent element to adjust tooltip positioning.
   */
  private observeParentSizeChanges(): void {
    this.parentResizeObserver = new ResizeObserver(
      () => this.tooltipElement() && this.adjustPosition()
    );
    this.parentResizeObserver?.disconnect();
    this.parentResizeObserver?.observe(this.elementRef.nativeElement);
  }

  /**
   * Handles document click events to close the tooltip if clicked outside.
   * @param event - The click event.
   */
  private onDocumentClick = (event: Event) => {
    if (this.timerSubscription) this.timerSubscription?.unsubscribe();

    this.timerSubscription = timer(150).subscribe(() => {
      if (this.tooltipElement()) {
        const targetElement = event.target as HTMLElement;
        const clickedInsideParent =
          this.elementRef.nativeElement.contains(targetElement);

        if (
          !clickedInsideParent ||
          this.configTooltip()?.activationMode !== "click"
        )
          this.removeTooltip();
      }
    });
  };

  /**
   * Event handler for window resize and scroll events to adjust tooltip positioning.
   */
  private readonly onWindowEvent = (): void => {
    this.tooltipElement() && this.adjustPosition();
  };

  /**
   * Shows the tooltip by creating the tooltip element.
   */
  private readonly showTooltip = () => {
    if (this.tooltipElement() || !this.tooltipContent()) return;

    this.createTooltipElement();
  };

  /**
   * Removes the tooltip and cleans up the event subscriptions and observers.
   */
  private readonly removeTooltip = () => {
    if (!this.tooltipElement()) return;

    if (typeof this.tooltipContent() !== "string")
      this.viewContainerRef.clear();

    this.renderer.removeChild(
      this.elementRef.nativeElement.parentElement,
      this.tooltipElement()
    );
    this.arrowTooltipElement.set(undefined);
    this.tooltipElement.set(undefined);

    if (this.resizeObserver) this.resizeObserver.disconnect();
    if (this.timerSubscription) this.timerSubscription.unsubscribe();

    window.removeEventListener("click", this.onDocumentClick, true);
    window.removeEventListener("scroll", this.onWindowEvent, true);
    window.removeEventListener("resize", this.onWindowEvent, true);
  };

  /**
   * Creates the tooltip element, including the arrow, and positions it correctly.
   */
  private readonly createTooltipElement = () => {
    // Create main tooltip element
    const tooltip = this.renderer.createElement("div") as HTMLElement;
    this.tooltipElement.set(tooltip);

    /** Parent element */
    const parent = document.body;
    this.renderer.appendChild(parent, tooltip);
    this.renderer.setStyle(tooltip, "visibility", "hidden");

    if (!this.configTooltip()?.hideArrow) {
      // Create arrow element and append it to the tooltip
      const arrow = this.renderer.createElement("div") as HTMLElement;
      this.arrowTooltipElement.set(arrow);
      this.renderer.appendChild(tooltip, arrow);
      this.renderer.addClass(arrow, "tooltip-arrow");
    }

    // Add content to the tooltip
    if (typeof this.tooltipContent() !== "string") {
      const view = this.viewContainerRef.createEmbeddedView(
        this.tooltipContent() as TemplateRef<HTMLElement>
      );
      view.rootNodes.forEach((node) =>
        this.renderer.appendChild(tooltip, node)
      );
    } else {
      const p = this.renderer.createElement("p") as HTMLElement;
      this.renderer.appendChild(tooltip, p);

      this.renderer.setProperty(p, "textContent", this.tooltipContent());

      this.renderer.addClass(p, "tooltip-text");
    }

    if (this.configTooltip()?.classes)
      this.renderer.addClass(tooltip, this.configTooltip()?.classes);

    this.renderer.addClass(tooltip, "tooltip");
    this.renderer.addClass(
      tooltip,
      `tooltip-${this.configTooltip()?.size || "s"}`
    );

    requestAnimationFrame(() => {
      if (tooltip) {
        this.adjustPosition();
        this.renderer.setStyle(this.tooltipElement(), "visibility", "visible");

        if (!this.resizeObserver)
          this.resizeObserver = new ResizeObserver(() => this.adjustPosition());
        this.resizeObserver?.disconnect();
        this.resizeObserver?.observe(tooltip);
      }
    });

    window.addEventListener("click", this.onDocumentClick, true);
    window.addEventListener("scroll", this.onWindowEvent, true);
    window.addEventListener("resize", this.onWindowEvent, true);
  };

  /**
   * Adjusts the position of the tooltip and arrow based on available space and the configured position.
   */
  private readonly adjustPosition = (): void => {
    const tooltip = this.tooltipElement();
    const host = this.elementRef.nativeElement as HTMLElement;
    if (!tooltip || !host) return;

    const keyboardHeight = this.getKeyboardHeight();
    const isKeyboardVisible = keyboardHeight > 100;

    const hostPos = this.elementRef.nativeElement.getBoundingClientRect();
    const tooltipPos = this.tooltipElement().getBoundingClientRect();

    const defaultMargin = this.configTooltip()?.hideArrow ? 5 : 10;

    let top = hostPos.top,
      left = hostPos.left;

    // Clear existing arrow position classes
    this.clearArrowClasses();
    switch (this.configTooltip()?.position) {
      case "top":
        top = hostPos.top - tooltipPos.height - defaultMargin - keyboardHeight;
        left = hostPos.left + hostPos.width / 2 - tooltipPos.width / 2;
        this.addArrowClass("bottom");
        break;
      case "top-left":
        top = hostPos.top - tooltipPos.height - defaultMargin - keyboardHeight;
        left = hostPos.left - tooltipPos.width + defaultMargin * 2;
        this.addArrowClass("bottom-right");
        break;
      case "top-right":
        top = hostPos.top - tooltipPos.height - defaultMargin;
        left = hostPos.right - defaultMargin * 2;
        this.addArrowClass("bottom-left");
        break;
      case "left":
        top = hostPos.top + hostPos.height / 2 - tooltipPos.height / 2;
        left = hostPos.left - tooltipPos.width - defaultMargin;
        this.addArrowClass("right");
        break;
      case "right":
        top = hostPos.top + hostPos.height / 2 - tooltipPos.height / 2;
        left = hostPos.right + defaultMargin;
        this.addArrowClass("left");
        break;
      case "bottom-left":
        top = hostPos.bottom + defaultMargin;
        left = hostPos.left - tooltipPos.width + defaultMargin * 2;
        this.addArrowClass("top-right");
        break;
      case "bottom-right":
        top = hostPos.bottom + defaultMargin;
        left = hostPos.right - defaultMargin * 2;
        this.addArrowClass("top-left");
        break;
      default:
        top = hostPos.bottom + defaultMargin;
        left = hostPos.left + hostPos.width / 2 - tooltipPos.width / 2;
        this.addArrowClass("top");
        break;
    }

    if (isKeyboardVisible) {
      if (this.configTooltip()?.position.includes("top")) {
      } else {
        const screenBottom = window.scrollY + window.innerHeight;
        const tooltipBottom = top + tooltip.offsetHeight;

        if (tooltipBottom > screenBottom - keyboardHeight) {
          const overlap = tooltipBottom - (screenBottom - keyboardHeight);
          top -= overlap + 10; // Agrega un pequeño margen
        }
      }
    }

    // Adjust position based on optional offset configuration
    const adjustOffestPositionOverlay = () => {
      if (this.offsetPositionTooltip) {
        Object.keys(this.offsetPositionTooltip).forEach((key) => {
          if (["bottom", "top"].includes(key)) {
            top =
              top +
              this.offsetPositionTooltip[key as keyof OffsetPositionTooltip];
          }
          if (["left", "right"].includes(key)) {
            left =
              left +
              this.offsetPositionTooltip[key as keyof OffsetPositionTooltip];
          }
        });
      }
    };

    adjustOffestPositionOverlay();

    // Adjust position if tooltip is out of bounds and update arrow class
    if (top < window.scrollY) {
      top = hostPos.bottom + defaultMargin;
      left = hostPos.left + hostPos.width / 2 - tooltipPos.width / 2;
      this.addArrowClass("top");
    }
    if (top + tooltipPos.height > window.scrollY + window.innerHeight) {
      top = hostPos.top - tooltipPos?.height - defaultMargin;
      left = hostPos.left + hostPos.width / 2 - tooltipPos.width / 2;
      this.addArrowClass("bottom");
    }
    if (left < 0) {
      left = hostPos.right + defaultMargin;
      top = hostPos.top + hostPos.height / 2 - tooltipPos.height / 2;
      this.addArrowClass("left");
    }
    if (left + tooltipPos.width > window.innerWidth) {
      left = hostPos.left - tooltipPos.width - defaultMargin;
      top = hostPos.top + hostPos.height / 2 - tooltipPos.height / 2;
      this.addArrowClass("right");
    }

    adjustOffestPositionOverlay();

    // Ensure tooltip stays within visible bounds
    top = Math.max(top, window.scrollY);
    left = Math.max(left, defaultMargin);

    // Apply position styles to tooltip
    this.renderer.setStyle(this.tooltipElement(), "position", "fixed");
    this.renderer.setStyle(this.tooltipElement(), "left", `${left}px`);
    this.renderer.setStyle(this.tooltipElement(), "top", `${top}px`);
    this.renderer.setStyle(this.tooltipElement(), "z-index", "101");
  };

  private addArrowClass(position: string): void {
    if (this.configTooltip()?.hideArrow) return;
    this.clearArrowClasses();
    this.renderer.addClass(
      this.arrowTooltipElement(),
      `tooltip-arrow-${position}`
    );
  }

  /**
   * Clears all position classes from the arrow element to avoid conflicts.
   */
  private clearArrowClasses(): void {
    if (this.configTooltip()?.hideArrow) return;

    const listArrowClasses = [
      "top",
      "bottom",
      "left",
      "right",
      "top-left",
      "top-right",
      "bottom-left",
      "bottom-right",
    ];

    listArrowClasses.forEach((position) =>
      this.renderer.removeClass(
        this.arrowTooltipElement(),
        `tooltip-arrow-${position}`
      )
    );
  }

  ngOnDestroy(): void {
    this.clearSubscriptions();
    this.removeTooltip();
  }
}
