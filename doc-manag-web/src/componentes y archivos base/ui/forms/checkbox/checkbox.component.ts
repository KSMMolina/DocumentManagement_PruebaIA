import { NgClass } from "@angular/common";
import {
  ChangeDetectionStrategy,
  forwardRef,
  Component,
  Injector,
  OnInit,
  inject,
  signal,
  input,
  output,
} from "@angular/core";
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NgControl,
} from "@angular/forms";
import { DisabledElementDirective } from "@shared/directives/disabled-element.directive";
import { TranslatePipe } from "@shared/pipes/translate.pipe";
import { transformBooleanInput } from "@shared/utils/transform-input";

@Component({
  imports: [DisabledElementDirective, NgClass, TranslatePipe],
  selector: "app-checkbox",
  templateUrl: "./checkbox.component.html",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxComponent implements OnInit, ControlValueAccessor {
  private injector = inject(Injector);

  /**
   * Clases adicionales
   */
  public classes = input<string>();

  /**
   * Evento de cambio de selección
   * @type {output<boolean>}
   */
  public checkChange = output<boolean>();

  /**
   * Estado de deshabilitación del checkbox
   * @type {input<boolean>}
   * @transform transformBooleanInput
   */
  public disabledElement = input(false, { transform: transformBooleanInput });

  /**
   * Estado de solo lectura del checkbox
   * @type {input<boolean>}
   * @transform transformBooleanInput
   */
  public readonly = input(false, { transform: transformBooleanInput });

  /**
   * Id del checkbox
   * @type {input<string>}
   */
  public id = input.required<string>();

  /**
   * Etiqueta del checkbox
   * @type {input<string>}
   */
  public label = input<string>();

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
    if (this.readonly() || this.disabledElement()) return;

    this.value.set(!this.value());
    this.onChange(this.value());
    this.checkChange.emit(this.value());
  }
}
