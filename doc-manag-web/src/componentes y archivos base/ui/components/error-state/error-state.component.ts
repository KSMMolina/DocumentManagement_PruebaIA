import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { ButtonComponent } from "@shared/ui/components/button/button.component";
import { ImageComponent } from "../image/image.component";
import { transformBooleanInput } from "@shared/utils/transform-input";
import { fadeInCustomAnimation } from "@shared/animations/animations.global";
import { TranslatePipe } from "@shared/pipes/translate.pipe";
import { IconComponent } from "../icon/icon.component";

@Component({
  selector: "app-error-state",
  templateUrl: "./error-state.component.html",
  styleUrls: ["./error-state.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImageComponent,
    ButtonComponent,
    TranslatePipe,
    IconComponent,
  ],
  animations: [fadeInCustomAnimation("fadeIn", { enter: "200ms" })],
})
export class ErrorStateComponent {
  public eventClick = output<"primary" | "secondary">();

  /**
   * Imagen que se muestra en el estado error
   * @default ERROR_STATE.SERVER
   */
  public image = input("ERROR_STATE.SERVER");

  /**
   * Indica si se debe mostrar el botón primario
   * @default false
   */
  public hidePrimaryButton = input(false, {
    transform: transformBooleanInput,
  });

  public hideDescription = input(false, {
    transform: transformBooleanInput,
  });

  public hideTitle = input(false, {
    transform: transformBooleanInput,
  });

  public entity = input<string>();
}
