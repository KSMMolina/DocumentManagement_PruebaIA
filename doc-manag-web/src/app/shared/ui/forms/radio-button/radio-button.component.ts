import {
  ChangeDetectionStrategy,
  forwardRef,
  Component,
  Injector,
  OnInit,
  inject,
  signal,
  input,
} from "@angular/core";
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NgControl,
} from "@angular/forms";
import { DisabledElementDirective } from "@shared/directives/disabled-element.directive";
import { transformBooleanInput } from "@shared/utils/transform-input";

@Component({
  imports: [DisabledElementDirective],
  selector: "app-radio-button",
  templateUrl: "./radio-button.component.html",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioButtonComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioButtonComponent implements OnInit, ControlValueAccessor {
  private injector = inject(Injector);

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
   * Id del radio button
   * @type {input<string>}
   */
  public id = input.required<string>();

  /**
   * Etiqueta del checkbox
   * @type {input<string>}
   */
  public label = input<string>();

  /**
   * Valor del radio button
   * @type {input<any>}
   */
  public valueToValidate = input<any>();

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
    this.value.set(this.valueToValidate() === this.value());
    this.onChange(this.value());
  }
}
