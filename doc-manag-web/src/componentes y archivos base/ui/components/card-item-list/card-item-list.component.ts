import { NgClass } from "@angular/common";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { slideCustomAnimation } from "@shared/animations/animations.global";
import { transformBooleanInput } from "@shared/utils/transform-input";

@Component({
  selector: "app-card-item-list",
  templateUrl: "./card-item-list.component.html",
  styleUrl: "./card-item-list.component.scss",
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    slideCustomAnimation("slideEnterRight", "X", "1rem", "0", {
      enter: "300ms",
    }),
  ],
})
export class CardItemListComponent {
  /** Clases adicionales */
  public classes = input<string>();

  /** Habilitar animación */
  public enableAnimation = input(false, { transform: transformBooleanInput });
}
