import {
  ChangeDetectionStrategy,
  Component,
  computed,
  output,
  input,
} from "@angular/core";

import { DisabledElementDirective } from "@shared/directives/disabled-element.directive";

import { LoadingComponent } from "../loading/loading.component";
import { NgClass, NgStyle } from "@angular/common";
import { transformBooleanInput } from "@shared/utils/transform-input";

@Component({
  selector: "app-button",
  templateUrl: "./button.component.html",
  imports: [NgClass, NgStyle, DisabledElementDirective, LoadingComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  /**
   * Evento que se dispara cuando se hace clic en el botón
   * @type {output}
   */
  public eventClick = output();

  /**
   * Estilos personalizados para el botón
   * @type {input<any>}
   */
  public styles = input<any>(undefined);

  /**
   * Clases CSS adicionales para el botón
   * @type {input<string>}
   */
  public classes = input("");

  /**
   * Estado de carga del botón
   * @type {input<boolean>}
   */
  public loading = input(false, { transform: transformBooleanInput });

  /**
   * Estado de deshabilitación del botón
   * @type {input<boolean>}
   * @transform transformBooleanInput
   */
  public disabledElement = input(false, { transform: transformBooleanInput });

  /**
   * Tema de deshabilitación del botón
   * @type {input<string>}
   */
  public disabledTheme = input<"ghost" | "outline" | null>();

  public disabledThemeClass = computed(() => {
    let disabledTheme = this.disabledTheme();

    if (!disabledTheme) {
      disabledTheme = this.classes().includes("ghost")
        ? "ghost"
        : this.classes().includes("outline")
        ? "outline"
        : null;
    }

    return disabledTheme ? `button-style-disabled-${disabledTheme}` : "";
  });

  public emitEvent(): void {
    if (this.loading()) return;
    this.eventClick.emit();
  }
}
