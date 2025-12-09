import { ElementRef, Renderer2, Directive, input, inject } from "@angular/core";
import { safeEffect } from "@shared/signals/signal";

@Directive({
  selector: "[appTextAreaAdjust]",
})
export class TextAreaAdjustDirective {
  public value = input<string>("");

  /** Valor en rem */
  public maxHeight = input(16);

  private element: ElementRef = inject(ElementRef);
  private renderer: Renderer2 = inject(Renderer2);

  constructor() {
    safeEffect(() => this.adjustHeight(), [this.value]);
  }

  private adjustHeight(): void {
    const textarea = this.element.nativeElement as HTMLElement;
    // Obtener los valores de padding asegurándose de que sean válidos
    const computedStyle = window.getComputedStyle(textarea);
    const paddingTop = parseInt(computedStyle.paddingTop, 10) || 0;
    const paddingBottom = parseInt(computedStyle.paddingBottom, 10) || 0;
    const padding = paddingTop + paddingBottom;

    // Asegurarse de que el textarea no tenga un valor "auto" antes de calcular el scrollHeight
    this.renderer.setStyle(textarea, "height", "auto");

    const scrollHeight = textarea.scrollHeight || 0;
    const maxHeightPixels = this.maxHeight() * 16;

    // Calcular la nueva altura y asegurarse de que sea válida
    const newHeight = Math.min(scrollHeight, maxHeightPixels - padding);

    // Ajustar la altura del textarea
    this.renderer.setStyle(textarea, "height", `${newHeight}px`);
  }
}
