import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from "@angular/core";
import { CheckboxComponent } from "../../checkbox/checkbox.component";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { isClickFromOmittedElement } from "@shared/services/local/helper.service";
import { NgClass } from "@angular/common";
import { DisabledElementDirective } from "@shared/directives/disabled-element.directive";
import { safeEffect } from "@shared/signals/signal";
import { transformBooleanInput } from "@shared/utils/transform-input";
import { OmitClickDirective } from "@shared/directives/omit-click.directive";

type SelectOptionStatus = "error" | "success";

@Component({
  selector: "app-select-option",
  templateUrl: "./select-option.component.html",
  styleUrls: ["./select-option.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DisabledElementDirective,
    ReactiveFormsModule,
    OmitClickDirective,
    CheckboxComponent,
    NgClass,
  ],
})
export class SelectOptionComponent {
  public eventClick = output<void>();

  /**
   * Clases adicionales
   */
  public classes = input<string>();

  /**
   * Control del checkbox
   */
  public checkboxControl = input<FormControl>();

  /**
   * Control del select option
   */
  public control = input<FormControl>();

  /**
   * Indice del item
   */
  public index = input.required<number>();

  /**
   * Indica si el item esta seleccionado
   */
  public isSelected = input(false, {
    transform: transformBooleanInput,
  });

  /**
   * Indica si el item es deshabilitado
   */
  public disabledElement = input(false, {
    transform: transformBooleanInput,
  });

  /**
   * Indica el estado del item
   */
  public status = input<SelectOptionStatus>();

  /**
   * Indica si el item no tiene selectores como hover, active, focus, etc...
   */
  public noSelectors = input(false, {
    transform: transformBooleanInput,
  });
  
  /**
   * Control a usar
   */
  private controlToUse = computed(
    () => this.checkboxControl() || this.control()
  );

  constructor() {
    safeEffect(() => this.disableControl(), [this.disabledElement]);
  }

  public onClick(event: Event) {
    if (
      isClickFromOmittedElement(event) ||
      this.disabledElement() ||
      this.noSelectors()
    )
      return;

    this.controlToUse()?.setValue(!this.controlToUse()?.value);
    this.eventClick.emit();
  }

  /** Deshabilita el control */
  private disableControl() {
    this.disabledElement()
      ? this.controlToUse()?.disable({ emitEvent: false })
      : this.controlToUse()?.enable({ emitEvent: false });
  }
}
