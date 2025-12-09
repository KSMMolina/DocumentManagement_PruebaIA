import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { StepOrientation, StepType } from "../step.component";
import { transformBooleanInput } from "@shared/utils/transform-input";
import { NgClass } from "@angular/common";
import { DisabledElementDirective } from "@shared/directives/disabled-element.directive";
import { IconComponent } from "@shared/ui/components/icon/icon.component";
import { fadeInCustomAnimation } from "@shared/animations/animations.global";

@Component({
  selector: "app-step-element",
  templateUrl: "./step-element.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent, NgClass, DisabledElementDirective],
  animations: [
    fadeInCustomAnimation("fadeIn", {
      enter: "300ms",
    }),
  ],
})
export class StepElementComponent {
  public stepClick = output();

  /** Indica el tipo de step
   * @default 'basic'
   */
  public type = input<StepType>("basic");

  /** Indica si el step está seleccionado
   * @default false
   */
  public isSelected = input(false, {
    transform: transformBooleanInput,
  });

  /** Indica si el step está finalizado
   * @default false
   */
  public isFinished = input(false, {
    transform: transformBooleanInput,
  });

  /** Indica el icono del step
   * @default ''
   */
  public icon = input<string>();

  /** Indica si el step está deshabilitado
   * @default false
   */
  public disabledElement = input(false, {
    transform: transformBooleanInput,
  });

  /** Indica la orientación del step
   * @default 'horizontal'
   */
  public orientation = input<StepOrientation>("horizontal");

  /** Indica el index del step
   * @default '0'
   */
  public index = input(0);

  /** Indica el index del step
   * @default ''
   */
  public label = input<string>();

  /** Indica el index del step
   * @default ''
   */
  public description = input<string>();

  /** Indica el tamaño del step
   * @default 'default'
   */
  public size = input<"default" | "sm">("default");
}
