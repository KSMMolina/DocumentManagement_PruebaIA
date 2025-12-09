import { NgClass } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import { LayoutService } from "@layout.service";
import { safeEffect } from "@shared/signals/signal";
import { IconComponent } from "@shared/ui/components/icon/icon.component";

@Component({
  selector: "app-admon-info-card",
  imports: [IconComponent, NgClass],
  templateUrl: "./admon-info-card.component.html",
  styleUrl: "./admon-info-card.component.scss",
})
export class AdmonInfoCardComponent implements OnInit {
  // public admin = signal<IResident.GetResponse>(undefined);
  // public loading = signal<boolean>(true);

  // private residentUseCase: ResidentUseCase = inject(ResidentUseCase);
  // public layoutService: LayoutService = inject(LayoutService);

  // constructor() {
  //   safeEffect(
  //     (pageIsRefreshing) => pageIsRefreshing && this.getUsersPropertiesAdmin(),
  //     [this.layoutService.pageIsRefreshing]
  //   );
  // }

  ngOnInit(): void {
  //   this.getUsersPropertiesAdmin();
  }

  // public getUsersPropertiesAdmin(): void {
  //   this.loading.set(true);
  //   this.residentUseCase.getUsersPropertiesAdmin().subscribe({
  //     next: (response) => {
  //       if (response.success && !!response.data.length)
  //         this.admin.set(response.data[0]);

  //       this.loading.set(false);
  //     },
  //   });
  // }
}
