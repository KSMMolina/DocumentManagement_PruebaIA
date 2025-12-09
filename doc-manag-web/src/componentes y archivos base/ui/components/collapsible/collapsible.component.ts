import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { CardComponent } from "../card/card.component";
import { NgClass } from "@angular/common";
import { IconComponent } from "../icon/icon.component";
import { collapseAnimation } from "@shared/animations/animations.global";

@Component({
  selector: "app-collapsible",
  imports: [CardComponent, NgClass, IconComponent],
  templateUrl: "./collapsible.component.html",
  styleUrl: "./collapsible.component.scss",
  animations: [collapseAnimation()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollapsibleComponent {
  public eventClick = output();

  /** Clases adicionales */
  public classes = input<string>();

  public isOpened = input<boolean>();
}
