import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
} from "@angular/core";
import { Dialog } from "@shared/services/local/dialog.service";
import { AlertComponent } from "@shared/ui/components/alert/alert.component";
import { UserLocalService } from "@user.service";

@Component({
  selector: "app-confirm-logout-modal",
  imports: [AlertComponent],
  templateUrl: "./confirm-logout-modal.component.html",
  styleUrl: "./confirm-logout-modal.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmLogoutModalComponent implements Dialog {
  private userLocalService = inject(UserLocalService);

  public dialogClose = output();

  public executeEventAlert(action: string) {
    action === "primary" && this.userLocalService.logout();

    this.dialogClose.emit();
  }
}
