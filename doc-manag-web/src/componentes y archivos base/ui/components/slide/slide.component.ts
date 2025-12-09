import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  HostBinding,
  HostListener,
  input,
  model,
  OnDestroy,
  QueryList,
  signal,
} from "@angular/core";
import { SlideItemComponent } from "./slide-item/slide-item.component";
import { safeEffect } from "@shared/signals/signal";
import { NgClass, NgStyle, NgTemplateOutlet } from "@angular/common";
import { transformBooleanInput } from "@shared/utils/transform-input";

@Component({
  selector: "app-slide",
  standalone: true,
  templateUrl: "./slide.component.html",
  imports: [NgClass, NgStyle, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlideComponent implements OnDestroy {
  @HostBinding("style") defaultStyle = {
    "min-height": "0",
    height: "100%",
    width: "100%",
  };

  @ContentChildren(SlideItemComponent, {
    descendants: true,
    read: SlideItemComponent,
  })
  readonly slideItems!: QueryList<SlideItemComponent>;

  /**
   * Indica el tipo de slide
   */
  public type = input<"fullscreen" | "split">("split");

  /**
   * Indica el tiempo de cambio de slide
   */
  public timeChangeSlide = input(8000);

  /**
   * Indica el slide seleccionado
   */
  public selectedSlide = model(0);

  /**
   * Indica si el slide se auto reproduce
   */
  public autoPlay = input(true);

  /**
   * Indica si el slide es infinito
   */
  public infinite = input(true);

  /**
   * Indica si el slide no tiene overflow
   */
  public noOverflow = input(false, { transform: transformBooleanInput });

  /**
   * Indica si se ocultan los indicadores
   */
  public hideIndicators = input(false, { transform: transformBooleanInput });

  private touchStartX = signal(0);
  private touchEndX = signal(0);

  private intervalSlide!: any;

  constructor() {
    safeEffect(() => this.initSlide(), [this.selectedSlide]);
  }

  @HostListener("touchstart", ["$event"])
  onTouchStart(event: TouchEvent) {
    this.touchStartX.set(event.changedTouches[0].screenX);
  }

  @HostListener("touchend", ["$event"])
  onTouchEnd(event: TouchEvent) {
    this.touchEndX.set(event.changedTouches[0].screenX);
    this.handleSwipe();
  }

  private initSlide() {
    if (this.intervalSlide) clearInterval(this.intervalSlide);

    if (!this.autoPlay()) return;

    this.intervalSlide = setInterval(() => this.next(), this.timeChangeSlide());
  }

  public getTransformByIndex(index: number): string {
    let valueToTransform = "";

    if (this.type() === "split") {
      if (
        this.selectedSlide() === this.slideItems.length - 1 &&
        this.slideItems.length > 1
      ) {
        if (index === this.selectedSlide()) valueToTransform = "+ 4rem";
        else if (index === this.selectedSlide() - 1)
          valueToTransform = "+ 3rem";
      } else if (index !== this.selectedSlide())
        valueToTransform = `${this.selectedSlide() > index ? "-" : "+"} 1rem`;
    }

    return `translate3d(calc(${(index - this.selectedSlide()) * 100 + "%"} ${
      valueToTransform || "- 0rem"
    }),0,0)`;
  }

  public goToSpecificSlide(index: number) {
    index !== this.selectedSlide() && this.selectedSlide.set(index);
  }

  public next() {
    this.selectedSlide() < this.slideItems.length - 1
      ? this.selectedSlide.update((v) => v + 1)
      : this.infinite() && this.selectedSlide.set(0);
  }

  public prev() {
    this.selectedSlide() > 0 && this.selectedSlide.update((v) => v - 1);
  }

  private handleSwipe() {
    const swipeDistance = this.touchEndX() - this.touchStartX();
    if (swipeDistance > 50) this.prev();
    else if (swipeDistance < -50) this.next();
  }

  ngOnDestroy(): void {
    if (this.intervalSlide) clearInterval(this.intervalSlide);
  }
}
