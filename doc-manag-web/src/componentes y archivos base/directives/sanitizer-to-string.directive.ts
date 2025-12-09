import {
  Directive,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  Renderer2,
} from "@angular/core";

const event = "input";
const ableTo = ["textarea", "text"];
const replace = ["onclick", "onerror", "onload", "style", "src", "href"];
const split = "<";
const invalid = "invalid";

const replaceAttributes = (value: string) =>
  replace
    .reduce(
      (acum, v) =>
        acum.replace(
          new RegExp(
            `(<\\s*\\w[^>]*?)\\s+${v}\\s*=\\s*(['"]?)(.*?)\\2(?=[^>]*>)`,
            "gi"
          ),
          `$1 ${invalid}=$2$3$2`
        ),
      split + value
    )
    ?.replace("</script>", `</${invalid}>`)
    ?.replace(split, "");

/**
 * Remplaza los atributos de ejecución de scripts
 *
 * @param value
 * @returns
 */
export const validateText = (value: string): string => {
  const temp = value?.split(split);
  const newValue = temp.map((v) => replaceAttributes(v)).join(split);
  return newValue;
};

@Directive({
  selector: "[appSanitizerToString]",
  standalone: true,
})
export class SanitizerToStringDirective implements OnInit, OnDestroy {
  private listener!: () => void;
  private el: ElementRef<HTMLInputElement> = inject(
    ElementRef<HTMLInputElement>
  );
  private renderer: Renderer2 = inject(Renderer2);

  async ngOnInit(): Promise<void> {
    if (!ableTo.includes(this.el.nativeElement?.type)) return;
    await this.validateInitialValue();
    this.addListener();
  }

  /**
   * Sanitiza el contenido inicial en caso de que el campo se renderice ya con un valor
   * @returns
   */
  private async validateInitialValue(): Promise<void> {
    return new Promise<void>(async (resolve) => {
      const oldValue = this.el.nativeElement.value;
      if (oldValue) {
        const newValue = await validateText(oldValue);
        if (oldValue !== newValue) await this.updateValue(newValue, true);
      }
      resolve();
    });
  }

  /**
   * Escucha eventos de tipo 'input' para Sanitizar el contenido.
   */
  private addListener(): void {
    this.listener = this.renderer.listen(
      this.el.nativeElement,
      event,
      (e: InputEvent) => {
        if (!(e.target as any)?.value || e?.cancelable) return;
        this.updateValue((e.target as any)?.value);
      }
    );
  }

  /**
   * Actualiza el valor del elemento y emite actualización de formulaio
   * @param value
   */
  private async updateValue(value: string, set?: boolean): Promise<void> {
    const v = set ? value : validateText(value);
    // Si no se sanitiza nada no se emite evento
    if(v === value) return;
    this.el.nativeElement.value = v;
    this.el?.nativeElement?.dispatchEvent(
      new InputEvent(event, { cancelable: true })
    );
  }

  ngOnDestroy(): void {
    this.listener = () => {};
  }
}
