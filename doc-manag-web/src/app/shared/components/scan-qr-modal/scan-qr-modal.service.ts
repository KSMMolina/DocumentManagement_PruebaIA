import { inject, Injectable, signal } from "@angular/core";
import { ScanQrModalComponent } from "./scan-qr-modal.component";
import { DialogService } from "@shared/services/local/dialog.service";
import { DomoNowRoute } from "@shared/globals/routes";
import { Router } from "@angular/router";

@Injectable({ providedIn: "root" })
export class ScanQrModalService {
  private readonly dialogService: DialogService = inject(DialogService);
  private readonly router: Router = inject(Router);

  public isScanForGoToDetailPass = signal(false);

  public openScanQrModal(
    fn?: (qrData: string) => void,
    action = "goAccessPassDetail"
  ): void {
    const dialogRef = this.dialogService.open(ScanQrModalComponent, {
      removePadding: true,
    });

    dialogRef.onClose.subscribe((qrData) => {
      action === "goAccessPassDetail" && this.goToAccessPassDetail(qrData);
      fn && fn(qrData);
    });
  }

  private goToAccessPassDetail(id: string): void {
    DomoNowRoute.SECURITY_ACCESS().SECURITY_ACCESS.ACCESS_PASS_DETAIL.goTo(
      this.router,
      null,
      false,
      `/${id}`
    );
  }
}
