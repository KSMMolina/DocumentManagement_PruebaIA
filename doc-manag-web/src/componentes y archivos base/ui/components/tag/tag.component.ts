import { NgClass, NgStyle } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  output,
  input,
} from "@angular/core";

import { DisabledElementDirective } from "@shared/directives/disabled-element.directive";

import { LoadingComponent } from "../loading/loading.component";
import { transformBooleanInput } from "@shared/utils/transform-input";

@Component({
  selector: "app-tag",
  standalone: true,
  templateUrl: "./tag.component.html",
  imports: [NgClass, NgStyle, DisabledElementDirective, LoadingComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagComponent {
  /**
   * Evento que se dispara cuando se hace clic en el tag
   * @type {output<void>}
   */
  public eventTagClick = output<void>();

  /**
   * Estilos personalizados para el tag
   * @type {input<any>}
   */
  public styles = input<any>(undefined);

  /**
   * Clases CSS adicionales para el tag
   * @type {input<string>}
   */
  public classes = input("");

  /**
   * Estado de carga del tag
   * @type {input<boolean>}
   */
  public loading = input(false, { transform: transformBooleanInput });

  /**
   * Estado de deshabilitación del tag
   * @type {input<boolean>}
   * @transform transformBooleanInput
   */
  public disabledElement = input(false, { transform: transformBooleanInput });

  public emitEvent(): void {
    if (this.loading()) return;
    this.eventTagClick.emit();
  }
}
