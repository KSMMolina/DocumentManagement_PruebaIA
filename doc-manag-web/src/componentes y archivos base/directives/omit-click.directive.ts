import { ElementRef, Directive, Renderer2, inject } from "@angular/core";

@Directive({
  selector: "[appOmitClick]",
})
export class OmitClickDirective {
  private elementRef: ElementRef<HTMLElement> = inject(ElementRef);
  private renderer2: Renderer2 = inject(Renderer2);

  constructor() {
    this.renderer2.setAttribute(
      this.elementRef.nativeElement,
      "omit-click",
      "true"
    );
  }
}
