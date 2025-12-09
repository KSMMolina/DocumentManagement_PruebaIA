import {
  ChangeDetectionStrategy,
  forwardRef,
  Component,
  signal,
  input,
} from "@angular/core";
import { FormsModule, NG_VALUE_ACCESSOR } from "@angular/forms";
import { fadeInCustomAnimation } from "@shared/animations/animations.global";

import { InputComponent } from "../input.component";
import { SanitizerToStringDirective } from "@shared/directives/sanitizer-to-string.directive";
import { DisabledElementDirective } from "@shared/directives/disabled-element.directive";
import { IconComponent } from "@shared/ui/components/icon/icon.component";
import { NgClass } from "@angular/common";
import { TooltipDirective } from "@shared/directives/tooltip.directive";
import { TranslatePipe } from "@shared/pipes/translate.pipe";

type InputTypes = "text" | "email" | "password";

@Component({
  selector: "app-input-text",
  templateUrl: "./input-text.component.html",
  imports: [
    SanitizerToStringDirective,
    DisabledElementDirective,
    TooltipDirective,
    TranslatePipe,
    IconComponent,
    FormsModule,
    NgClass,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputTextComponent),
      multi: true,
    },
  ],
  animations: [
    fadeInCustomAnimation("fadeInOut", { enter: "150ms", leave: "150ms" }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputTextComponent extends InputComponent {
  /**
   * Tipo de entrada
   */
  public type = input<InputTypes>("text");

  public iconPassword = signal("INVISIBILITY_FILLED");
  public tempType = signal<InputTypes>("text");

  constructor() {
    super();
    setTimeout(() => this.tempType.set(this.type()), 0);
  }

  /**
   * actualizar el valor del control
   *
   */
  public onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value;
    if (this.format() === "uppercase") value = value.toUpperCase();
    if (this.format() === "lowercase") value = value.toLowerCase();

    this.value.set(value);

    this.ngControl && this.onChange(this.value());
  }

  public togglePassword(): void {
    this.tempType.set(this.tempType() === "password" ? "text" : "password");
    this.iconPassword.set(
      this.tempType() === "password"
        ? "INVISIBILITY_FILLED"
        : "VISIBILITY_FILLED"
    );
  }
}
