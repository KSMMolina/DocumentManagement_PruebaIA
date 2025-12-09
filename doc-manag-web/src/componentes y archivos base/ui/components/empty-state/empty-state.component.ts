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
import { IconComponent } from "../icon/icon.component";
import { TranslatePipe } from "@shared/pipes/translate.pipe";

@Component({
  selector: "app-empty-state",
  templateUrl: "./empty-state.component.html",
  styleUrls: ["./empty-state.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonComponent,
    ImageComponent,
    IconComponent,
    TranslatePipe,
  ],
  animations: [fadeInCustomAnimation("fadeIn", { enter: "200ms" })],
})
export class EmptyStateComponent {
  public eventClick = output<"primary" | "secondary">();

  /**
   * Imagen que se muestra en el estado vacío
   * @default EMPTY_STATE.SELECT.NO_RECORDS
   */
  public image = input("EMPTY_STATE.SELECT.NO_RECORDS");

  /**
   * Indica si se debe mostrar el botón primario
   * @default false
   */
  public hidePrimaryButton = input(false, {
    transform: transformBooleanInput,
  });

  /**
   * Indica si se debe mostrar el botón secundario
   * @default false
   */
  public hideSecondaryButton = input(false, {
    transform: transformBooleanInput,
  });

  public entity = input<string>();
}
