import { NgClass } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";

@Component({
  selector: "app-card",
  templateUrl: "./card.component.html",
  styleUrl: "./card.component.scss",
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
  public eventClick = output();

  /** Clases adicionales */
  public classes = input<string>();
}
