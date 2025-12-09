import { Component, inject } from "@angular/core";
import { LayoutService } from "@layout.service";
import { TranslatePipe } from "@shared/pipes/translate.pipe";
import { CardItemListComponent } from "@shared/ui/components/card-item-list/card-item-list.component";
import { CardComponent } from "@shared/ui/components/card/card.component";
import { IconComponent } from "@shared/ui/components/icon/icon.component";

@Component({
  selector: "app-contact",
  imports: [CardComponent, CardItemListComponent, IconComponent, TranslatePipe],
  templateUrl: "./contact.component.html",
  styleUrl: "./contact.component.scss",
})
export class ContactComponent {
  public layoutService: LayoutService = inject(LayoutService);
}
