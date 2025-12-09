import {
  ChangeDetectorRef,
  AfterViewInit,
  ElementRef,
  DestroyRef,
  Component,
  viewChild,
  Injector,
  computed,
  OnInit,
  inject,
  signal,
  input,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ControlValueAccessor, NgControl } from "@angular/forms";
import { safeEffect } from "@shared/signals/signal";

import { transformBooleanInput } from "@shared/utils/transform-input";
import { timer } from "rxjs";

type InputStatus = "error" | "warning" | "info" | "success" | "";

type InputSize = "lg" | "md" | "sm";

type InputFormat = "uppercase" | "lowercase";

@Component({
  template: "",
})
export class InputComponent
  implements OnInit, AfterViewInit, ControlValueAccessor
{
  protected elementRef = inject(ElementRef);
  protected destroyRef = inject(DestroyRef);
  protected cdr = inject(ChangeDetectorRef);
  protected injector = inject(Injector);

  /**
   * Referencia al elemento input
   */
  public input = viewChild<ElementRef<HTMLInputElement>>("input");

  /**
   * Formato del input
   */
  public format = input<InputFormat>();

  /**
   * Indica si muestra el mensaje de error por defecto
   */
  public defaultLabelError = input(false, {
    transform: transformBooleanInput,
  });

  /**
   * Placeholder del input
   */
  public placeholder = input<string>("");

  /**
   * ID del input
   */
  public id = input.required<string>();

  /**
   * Tamaño del input
   */
  public size = input<InputSize>("lg");

  /**
   * Longitud máxima del input
   */
  public maxLength = input(200);

  /**
   * Indica si el campo es obligatorio
   */
  public required = input(false, {
    transform: transformBooleanInput,
  });

  /**
   * Estado del input
   */
  public status = input<InputStatus>("");

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
   * Indica si el input se encuentra en un combo
   */
  public inCombo = input(false, {
    transform: transformBooleanInput,
  });

  /**
   * Indica si el input debe tener focus al aparecer
   */
  public autofocus = input(false, {
    transform: transformBooleanInput,
  });

    /**
   * Indica si el input debe ocultar el hide clear action
   */
  public hideClearAction = input(false, {
    transform: transformBooleanInput,
  });

  protected onChange: Function = (value: any) => {};
  private onTouched: Function = () => {};

  public ngControl!: NgControl;

  public formattedValue = signal("");
  public value = signal("");

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
        return null;
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

  constructor() {
    safeEffect(
      (autofocus) => autofocus && timer(0).subscribe(() => this.focus()),
      [this.autofocus]
    );
  }

  ngOnInit(): void {
    try {
      this.ngControl = this.injector.get(NgControl);
    } catch (error) {
      console.warn("form control no implemented");
    }
  }

  ngAfterViewInit(): void {
    // Suscribirse a los cambios de estado del control para actualizar la vista
    if (this.ngControl?.statusChanges) {
      this.ngControl.statusChanges
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.cdr.markForCheck();
        });
    }
  }

  registerOnChange(fn: Function): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.onTouched = fn;
  }

  writeValue(value: string): void {
    this.value.set(value);
    // Marcar para verificación cuando se escribe un valor
    this.cdr.markForCheck();
  }

  /**
   * tocar control
   *
   */
  public onBlur(): void {
    if (this.ngControl) {
      this.onTouched();
      this.cdr.markForCheck();
    }
  }

  public clearInput(): void {
    this.input().nativeElement.value = "";
    this.value.set("");
    this.onChange("");
  }

  public focus(): void {
    this.input().nativeElement.focus();
  }
}
