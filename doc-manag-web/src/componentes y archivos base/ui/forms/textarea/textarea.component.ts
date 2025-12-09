import {
  ChangeDetectionStrategy,
  ElementRef,
  forwardRef,
  Component,
  viewChild,
  computed,
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
import { fadeInCustomAnimation } from "@shared/animations/animations.global";
import { DisabledElementDirective } from "@shared/directives/disabled-element.directive";
import { TextAreaAdjustDirective } from "@shared/directives/text-area-adjust.directive";
import { NgClass } from "@angular/common";
import { IconComponent } from "@shared/ui/components/icon/icon.component";
import { transformBooleanInput } from "@shared/utils/transform-input";
import { SanitizerToStringDirective } from "@shared/directives/sanitizer-to-string.directive";

type TextareaStatus = "default" | "error" | "warning" | "info" | "success";

type TextareaSize = "lg" | "md" | "sm";

@Component({
  imports: [
    SanitizerToStringDirective,
    DisabledElementDirective,
    TextAreaAdjustDirective,
    IconComponent,
    NgClass,
  ],
  selector: "app-textarea",
  templateUrl: "./textarea.component.html",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true,
    },
  ],
  animations: [
    fadeInCustomAnimation("fadeInOut", { enter: "150ms", leave: "150ms" }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextareaComponent implements OnInit, ControlValueAccessor {
  private injector = inject(Injector);

  /**
   * Referencia al elemento textarea
   */
  public textarea = viewChild<ElementRef<HTMLInputElement>>("textarea");

  /**
   * Indica si muestra el mensaje de error por defecto
   */
  public defaultLabelError = input(false, {
    transform: transformBooleanInput,
  });

  /**
   * Clases del textarea
   */
  public classes = input("");

  /**
   * Placeholder del textarea
   */
  public placeholder = input("");

  /**
   * ID del textarea
   */
  public id = input.required<string>();

  /**
   * Tamaño del textarea
   */
  public size = input<TextareaSize>("lg");

  /**
   * Longitud máxima del textarea
   */
  public maxLength = input(200);

  /**
   * Indica si el campo es obligatorio
   */
  public required = input(false, {
    transform: transformBooleanInput,
  });

  /**
   * Estado del textarea
   */
  public status = input<TextareaStatus>("default");

  /**
   * Indica si el campo es deshabilitado
   */
  public disabledElement = input(false, {
    transform: transformBooleanInput,
  });

  /**
   * Indica si el campo es solo lectura
   */
  public readonly = input(false, {
    transform: transformBooleanInput,
  });

  /**
   * Indica si oculta el contador
   */
  public hideCounter = input(false, {
    transform: transformBooleanInput,
  });

  /**
   * Indica e tamaño minimo del textarea
   */
  public minHeight = input(false, {
    transform: transformBooleanInput,
  });

  private onChange: Function = (value: any) => {};
  private onTouched: Function = () => {};

  public ngControl!: NgControl;

  public value = signal<string>("");

  public iconStatus = computed(() => {
    switch (this.status()) {
      case "error":
        return "ERROR_OUTLINE_OUTLINED";
      case "warning":
        return "WARNING_AMBER_OUTLINED";
      case "info":
        return "INFO_OUTLINED";
      case "success":
        return "TASK_ALT_OUTLINED";
      default:
        return "";
    }
  });

  public get invalid() {
    return this.ngControl?.invalid;
  }

  public get touched() {
    return this.ngControl?.touched;
  }

  public get valid() {
    return this.ngControl?.valid;
  }

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

  // writeValue(value: string): void {
  //   this.value.set(value);
  // }

  writeValue(value: string): void {
    this.value.set(value);
    if (this.textarea() && this.textarea().nativeElement)
      this.textarea().nativeElement.value = value || "";
  }

  /**
   * tocar control
   *
   */
  public onBlur(): void {
    if (this.ngControl) this.onTouched();
  }

  /**
   * actualizar el valor del control
   *
   */
  public onInput(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    const value = textarea.value;

    this.value.set(value);
    this.ngControl && this.onChange(this.value());
  }

  public clearTextarea(): void {
    this.textarea().nativeElement.value = "";
    this.value.set("");
    this.onChange("");
  }
}
