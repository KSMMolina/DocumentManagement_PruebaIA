import {
  ChangeDetectionStrategy,
  forwardRef,
  Component,
  signal,
  input,
  computed,
} from "@angular/core";
import { FormsModule, NG_VALUE_ACCESSOR } from "@angular/forms";
import { fadeInCustomAnimation } from "@shared/animations/animations.global";

import { InputComponent } from "../input.component";
import { SanitizerToStringDirective } from "@shared/directives/sanitizer-to-string.directive";
import { DisabledElementDirective } from "@shared/directives/disabled-element.directive";
import { IconComponent } from "@shared/ui/components/icon/icon.component";
import { NgClass } from "@angular/common";
import { transformBooleanInput } from "@shared/utils/transform-input";
import { TranslatePipe } from "@shared/pipes/translate.pipe";

@Component({
  selector: "app-input-number",
  templateUrl: "./input-number.component.html",
  imports: [
    SanitizerToStringDirective,
    DisabledElementDirective,
    TranslatePipe,
    IconComponent,
    FormsModule,
    NgClass,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputNumberComponent),
      multi: true,
    },
  ],
  animations: [
    fadeInCustomAnimation("fadeInOut", { enter: "150ms", leave: "150ms" }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputNumberComponent extends InputComponent {
  /**
   * Valor mínimo
   */
  public minValue = input<number>();

  /**
   * Valor máximo
   */
  public maxValue = input<number>();

  /**
   * Permite números negativos
   */
  public allowNegative = input(false, {
    transform: transformBooleanInput,
  });

  /**
   * Habilita formato de miles (separador de miles)
   */
  public thousandsFormat = input(false, {
    transform: transformBooleanInput,
  });

  /**
   * Permite decimales (puntos y comas)
   */
  public allowDecimals = input(true, {
    transform: transformBooleanInput,
  });

  public maxLengthTotal = computed(
    () => this.maxLength() + this.displayValue().split(".").length - 1
  );
  public displayValue = signal("");

  /**
   * Valida y restringe la entrada a solo números, decimales y negativos según configuración
   */
  public onKeyPress(event: KeyboardEvent): boolean {
    const key = event.key;
    const input = event.target as HTMLInputElement;
    const currentValue = input.value;
    const cursorPosition = input.selectionStart || 0;

    // Permitir teclas de control
    if (
      [
        "Backspace",
        "Delete",
        "Tab",
        "Escape",
        "Enter",
        "Home",
        "End",
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
      ].includes(key)
    )
      return true;

    // Permitir Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+Z
    if (event.ctrlKey && ["a", "c", "v", "x", "z"].includes(key.toLowerCase()))
      return true;

    // Permitir números
    if (/[0-9]/.test(key)) return true;

    // Permitir signo negativo solo al inicio y si está habilitado
    if (key === "-" && this.allowNegative() && cursorPosition === 0)
      return true;

    // Permitir decimales si están habilitados
    if (this.allowDecimals() && key === "," && currentValue.length > 0) {
      const cleanValue = this.getCleanNumericValue(currentValue);
      if (!cleanValue.includes(",")) return true;
    }

    // Bloquear cualquier otro carácter
    event.preventDefault();
    return false;
  }

  /**
   * Formatea el valor para mostrar separadores de miles si está habilitado
   */
  private formatForDisplay(value: string): string {
    if (!value || !this.thousandsFormat()) return value;

    const cleanValue = this.getCleanNumericValue(value);
    if (!cleanValue) return value;

    const number = parseFloat(cleanValue);
    if (isNaN(number)) return value;

    // Solo formatear si >= 1000
    if (Math.abs(number) >= 1000)
      return new Intl.NumberFormat("es-CO").format(number);

    return cleanValue;
  }

  /**
   * Obtiene el valor numérico limpio sin formato
   */
  private getCleanNumericValue(value: string): string {
    if (!value) return "";

    // Remover separadores de miles y mantener solo números, punto/coma decimal y signo negativo
    let cleanValue = value.replaceAll(".", "");

    return cleanValue;
  }

  /**
   * Actualizar el valor del control
   */
  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let inputValue = input.value;

    // Si empieza con coma, agregar 0 al inicio automáticamente
    if (inputValue.startsWith(",")) {
      inputValue = "0" + inputValue;
      input.value = inputValue;
    }

    if (!!this.maxValue() && +inputValue > this.maxValue()) {
      inputValue = `${this.maxValue()}`;
      input.value = inputValue;
    }

    if (!!this.minValue() && (+inputValue < this.minValue() || !+inputValue)) {
      inputValue = `${this.minValue()}`;
      input.value = inputValue;
    }

    // Obtener valor limpio para el modelo
    const cleanValue = this.getCleanNumericValue(inputValue);

    // Formatear solo si está habilitado y el número >= 1000
    if (this.thousandsFormat() && cleanValue) {
      const numericValue = parseFloat(cleanValue);
      if (!isNaN(numericValue) && Math.abs(numericValue) >= 1000) {
        const formattedValue = new Intl.NumberFormat("es-CO").format(
          numericValue
        );
        this.displayValue.set(formattedValue);

        if (formattedValue !== inputValue) {
          input.value = formattedValue;
          // Poner cursor al final para simplicidad
          setTimeout(() => {
            input.setSelectionRange(
              formattedValue.length,
              formattedValue.length
            );
          }, 0);
        }
      } else {
        // Número < 1000, no formatear
        this.displayValue.set(cleanValue);
        if (cleanValue !== input.value) input.value = cleanValue;
      }
    } else this.value.set(inputValue);

    // Notificar cambio al formulario con valor limpio
    this.ngControl && this.onChange(cleanValue);
  }

  /**
   * Manejar blur para normalizar valores como ",12" a "0,12"
   */
  override onBlur(): void {
    const input = this.input()?.nativeElement;
    if (input) {
      let currentValue = input.value;

      // Si empieza con coma, agregar 0 al inicio
      if (currentValue.startsWith(",")) {
        currentValue = "0" + currentValue;
        input.value = currentValue;

        // Actualizar los valores
        const cleanValue = this.getCleanNumericValue(currentValue);
        this.value.set(cleanValue);
        this.displayValue.set(currentValue);

        // Notificar cambio al formulario
        this.ngControl && this.onChange(cleanValue);
      }
    }

    super.onBlur();
  }

  /**
   * Sobrescribir writeValue para manejar el formato inicial
   */
  override writeValue(value: string): void {
    super.writeValue(value);
    value && this.displayValue.set(this.formatForDisplay(value));
  }
}
