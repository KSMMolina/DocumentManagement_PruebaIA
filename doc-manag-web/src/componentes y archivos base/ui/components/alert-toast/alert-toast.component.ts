import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  output,
} from "@angular/core";
import { IconComponent } from "../icon/icon.component";
import { slideCustomAnimation } from "@shared/animations/animations.global";
import { transformBooleanInput } from "@shared/utils/transform-input";
import { NgClass } from "@angular/common";

export type AlertToastStatus =
  | "success"
  | "warning"
  | "error"
  | "info"
  | "default";

@Component({
  selector: "app-alert-toast",
  imports: [IconComponent, NgClass],
  templateUrl: "./alert-toast.component.html",
  styleUrl: "./alert-toast.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    slideCustomAnimation("slideEnterAndLeaveRight", "X", "1rem", "0", {
      enter: "300ms",
      leave: "300ms",
    }),
  ],
})
export class AlertToastComponent {
  /** Evento que se dispara al hacer click en el botón ver más */
  public eventAction = output<'primary'|'secondary' | 'close' >();

  /** Clases adicionales
   * @default ""
   */
  public classes = input("");

  /** Estado del alert toast
   * @default default
   */
  public status = input<AlertToastStatus>("default");

  /** Estado de la acción primaria del alert toast
   * @default false
   */
  public hidePrimaryAction = input(false, { transform: transformBooleanInput });

  /** Estado de la acción secundaria del alert toast
   * @default false
   */
  public hideSecondaryAction = input(false, {
    transform: transformBooleanInput,
  });

  /**
   * Estado del alert toast
   * @default false
   */
  public hide = model(false);

  /**
   * Icono y color del alert toast
   */
  public iconAndColor = computed(() => {
    let result: { icon: string; color?: string } = {
      color: `content-${this.status()}`,
      icon: "",
    };
    switch (this.status()) {
      case "default":
        result.icon = "notifications_active";
        break;
      case "success":
        result.icon = "check_circle";
        break;
      case "info":
        result.icon = "info";
        break;
      case "error":
        result.icon = "error_outline";
        break;
      case "warning":
        result.icon = "error_outline";
        break;
    }
    return result;
  });
}
