import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { IconComponent, IconSize } from "../icon/icon.component";

@Component({
  selector: "app-loading",
  imports: [IconComponent],
  templateUrl: "./loading.component.html",
  styleUrl: "./loading.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingComponent {
  /**
   * Tamaño del icono
   * @default "l"
   */
  public size = input<IconSize>("l");

  /**
   * Color del icono
   * @default ""
   */
  public color = input<string>();
}
