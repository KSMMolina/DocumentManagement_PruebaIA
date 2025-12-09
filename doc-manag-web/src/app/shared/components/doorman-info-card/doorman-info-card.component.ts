import { Component, inject, OnInit, signal } from "@angular/core";
import { LayoutService } from "@layout.service";
import { IResident } from "@shared/Core/residents/domain/interfaces";
import { ResidentUseCase } from "@shared/Core/residents/domain/use-case";
import { IconComponent } from "@shared/ui/components/icon/icon.component";
import { NgClass } from "@angular/common";

@Component({
  selector: "app-doorman-info-card",
  imports: [IconComponent, NgClass],
  templateUrl: "./doorman-info-card.component.html",
  styleUrl: "./doorman-info-card.component.scss",
})
export class DoormanInfoCardComponent implements OnInit {
  public doorman = signal<IResident.GetResponse>(undefined);
  public loading = signal<boolean>(true);

  private readonly residentUseCase: ResidentUseCase = inject(ResidentUseCase);
  public layoutService: LayoutService = inject(LayoutService);

  ngOnInit(): void {
    this.getUsersPropertiesDoorman();
  }

  public getUsersPropertiesDoorman(): void {
    this.loading.set(true);
    this.residentUseCase.getUsersPropertiesDoorman().subscribe({
      next: (response) => {
        if (response.success && !!response.data.length)
          this.doorman.set(response.data[0]);

        this.loading.set(false);
      },
    });
  }
}
