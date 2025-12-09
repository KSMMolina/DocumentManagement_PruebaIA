import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
} from "@angular/core";
import { FormsModule, NG_VALUE_ACCESSOR } from "@angular/forms";
import { fadeInCustomAnimation } from "@shared/animations/animations.global";
import { InputComponent } from "../input.component";
import { SanitizerToStringDirective } from "@shared/directives/sanitizer-to-string.directive";
import { DisabledElementDirective } from "@shared/directives/disabled-element.directive";
import { IconComponent } from "@shared/ui/components/icon/icon.component";
import { NgClass } from "@angular/common";
import { TranslatePipe } from "@shared/pipes/translate.pipe";

@Component({
  selector: "app-input-date",
  templateUrl: "./input-date.component.html",
  imports: [
    SanitizerToStringDirective,
    DisabledElementDirective,
    IconComponent,
    TranslatePipe,
    FormsModule,
    NgClass,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputDateComponent),
      multi: true,
    },
  ],
  animations: [
    fadeInCustomAnimation("fadeInOut", { enter: "150ms", leave: "150ms" }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputDateComponent extends InputComponent {
  /**
   * Indica la fecha minima
   * @type {string}
   * @format yyyy-MM-dd
   */
  public minDate = input<string>();

  /**
   * Indica la fecha máxima
   * @type {string}
   * @format yyyy-MM-dd
   */
  public maxDate = input<string>();

  /**
   * actualizar el valor del control
   *
   */
  public onInput(event: Event) {
    const input = event.target as HTMLInputElement;

    this.value.set(input.value);
    this.ngControl && this.onChange(this.value());
  }
}
