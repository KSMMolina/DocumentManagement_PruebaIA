import { NgClass } from "@angular/common";
import { Component, input, output } from "@angular/core";

@Component({
  selector: "app-card-dashed",
  imports: [NgClass],
  templateUrl: "./card-dashed.component.html",
  styleUrl: "./card-dashed.component.scss",
  
})
export class CardDashedComponent {
  public eventClick = output();

  public classes = input<string>();
}
