import {
  ChangeDetectionStrategy,
  Component,
  output,
  input,
  forwardRef,
  signal,
  inject,
  Injector,
} from "@angular/core";
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NgControl,
} from "@angular/forms";

import { DisabledElementDirective } from "@shared/directives/disabled-element.directive";
import { transformBooleanInput } from "@shared/utils/transform-input";

@Component({
  selector: "app-switch",
  templateUrl: "./switch.component.html",
  imports: [DisabledElementDirective],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SwitchComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SwitchComponent implements ControlValueAccessor {
  private injector = inject(Injector);

  /**
   * Evento que se dispara cuando se hace clic en el switch
   * @type {output<boolean>}
   */
  public eventSwitchChange = output<boolean>();

  /**
   * Estilos personalizados para el switch
   * @type {input<any>}
   */
  public styles = input<any>();

  /**
   * Clases CSS adicionales para el switch
   * @type {input<string>}
   */
  public classes = input<string>();

  /**
   * Estado de carga del switch
   * @type {input<boolean>}
   */
  public loading = input(false, { transform: transformBooleanInput });

  /**
   * Estado de deshabilitación del switch
   * @type {input<boolean>}
   * @transform transformBooleanInput
   */
  public disabledElement = input(false, { transform: transformBooleanInput });

  /**
   * Estado de solo lectura del switch
   * @type {input<boolean>}
   * @transform transformBooleanInput
   */
  public readonly = input(false, { transform: transformBooleanInput });

  /**
   * Id del switch
   * @type {input<string>}
   */
  public id = input.required<string>();

  private onChange: Function = (value: any) => {};
  private onTouched: Function = () => {};

  public ngControl!: NgControl;

  public value = signal(false);

  ngOnInit(): void {
    try {
      this.ngControl = this.injector.get(NgControl);
    } catch (error) {
      console.warn("form control no implemented");
    }
  }

  registerOnChange(fn: Function): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.onTouched = fn;
  }

  writeValue(value: boolean): void {
    this.value.set(value);
  }

  public changeValue(): void {
    if (
      this.readonly() ||
      this.disabledElement() ||
      this.loading() ||
      this.ngControl?.disabled
    )
      return;
    this.value.set(!this.value());
    this.onChange(this.value());
    this.eventSwitchChange.emit(this.value());
  }
}
