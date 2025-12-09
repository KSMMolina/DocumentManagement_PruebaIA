import {
  ChangeDetectionStrategy,
  TemplateRef,
  Component,
  viewChild,
  input,
} from "@angular/core";
import { transformBooleanInput } from "@shared/utils/transform-input";

@Component({
  selector: "app-step-item",
  templateUrl: "./step-item.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepItemComponent {
  public templateRef = viewChild<TemplateRef<any>>("templateRef");

  /** Indica el label del item */
  public label = input.required<string>();

  /** Indica si el item esta deshabilitado */
  public disabledElement = input(false, { transform: transformBooleanInput });
}
