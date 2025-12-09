import { LayoutService } from "@layout.service";
import { NgClass } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { NavigationCardComponent } from "@shared/ui/components/navigation-card/navigation-card.component";
import { IconComponent } from "@shared/ui/components/icon/icon.component";
import { Router } from "@angular/router";
import { DomoNowRoute } from "@shared/globals/routes";
import { TranslatePipe } from "@shared/pipes/translate.pipe";

@Component({
  selector: "app-my-services",
  imports: [NavigationCardComponent, IconComponent, NgClass, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./my-services.component.html",
  standalone: true,
  styleUrl: "./my-services.component.scss",
})
export class MyServicesComponent {
  public listShortCuts = signal([
    {
      icon: "ASSIGNMENT_IND_ROUND",
      label: "ACCESS",
      redirection: DomoNowRoute.SECURITY_ACCESS().SECURITY_ACCESS,
    },
    {
      icon: "FEED_OUTLINED",
      label: "WALL",
      redirection: DomoNowRoute.SOCIAL_NETWORK().SOCIAL_NETWORK,
    },
    {
      icon: "WARNING_AMBER_OUTLINED",
      label: "ALERTS",
      redirection: DomoNowRoute.EMERGENCY_ALERTS().EMERGENCY_ALERTS,
    },
    {
      icon: "HANDYMAN_OUTLINED",
      label: "REQUESTS",
      redirection: DomoNowRoute.REQUESTS().REQUESTS,
    },
    {
      icon: "GROUPS_2_OUTLINED",
      label: "COMMON_AREAS",
      redirection: DomoNowRoute.COMMON_AREAS().COMMON_AREAS,
    },
    {
      icon: "GROUPS_2_OUTLINED",
      label: "Gestión documental",
      redirection: DomoNowRoute.DOCUMENT_MANAGEMENT().DOCUMENT_MANAGEMENT,
    },
  ]);

  public layoutService: LayoutService = inject(LayoutService);
  public router: Router = inject(Router);

  public goToModule(redirection: any) {
    redirection.goTo(this.router);
  }
}
