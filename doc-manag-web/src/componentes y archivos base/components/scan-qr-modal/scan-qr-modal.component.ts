import {
  AfterViewInit,
  viewChild,
  Component,
  inject,
  output,
  signal,
  DestroyRef,
} from "@angular/core";
import { Dialog } from "@shared/services/local/dialog.service";
import { IconComponent } from "@shared/ui/components/icon/icon.component";
import { NotificationService } from "@shared/ui/components/notification/notification.service";
import { ButtonComponent } from "@shared/ui/components/button/button.component";

import { ZXingScannerComponent, ZXingScannerModule } from "@zxing/ngx-scanner";
import { BarcodeFormat } from "@zxing/library";
import { LoadingComponent } from "@shared/ui/components/loading/loading.component";
import { ImageComponent } from "@shared/ui/components/image/image.component";

@Component({
  selector: "app-scan-qr-modal",
  imports: [
    ZXingScannerModule,
    LoadingComponent,
    ButtonComponent,
    ImageComponent,
    IconComponent,
  ],
  templateUrl: "./scan-qr-modal.component.html",
  styleUrl: "./scan-qr-modal.component.scss",
})
export class ScanQrModalComponent implements Dialog, AfterViewInit {
  public scanner = viewChild<ZXingScannerComponent>("scanner");

  public dialogClose = output<string>();

  // Estados para el UI
  public isLoading = signal(true);
  public hasPermission = signal(false);
  public hasDevices = signal(false);
  public currentDevice = signal<MediaDeviceInfo>(null);
  public errorMessage = signal<string>("");
  public scannerEnabled = signal(false);

  // Configuración del scanner
  public allowedFormats = signal([BarcodeFormat.QR_CODE]);
  public availableDevices = signal<MediaDeviceInfo[]>([]);

  // Control de estado interno
  private isProcessingQR = signal(false);
  private isDestroyed = signal(false);

  private readonly notificationService: NotificationService =
    inject(NotificationService);
  private destroyRef: DestroyRef = inject(DestroyRef);

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.isDestroyed.set(true);
      this.cleanupScanner();
    });
  }

  async ngAfterViewInit(): Promise<void> {
    if (this.isDestroyed()) return;

    const isSupported = await this.checkBrowserSupport();
    if (isSupported && !this.isDestroyed()) {
      await this.requestCameraPermission();
    }
  }

  /**
   * Verificar si el navegador soporta getUserMedia
   */
  private async checkBrowserSupport(): Promise<boolean> {
    if (this.isDestroyed()) return false;

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      this.errorMessage.set(
        "Tu navegador no soporta acceso a la cámara. Por favor actualiza tu navegador."
      );
      this.isLoading.set(false);
      return false;
    }

    // Verificar si está en HTTPS (requerido para cámara)
    if (location.protocol !== "https:" && location.hostname !== "localhost") {
      this.errorMessage.set(
        "Se requiere HTTPS para acceder a la cámara. Por favor usa una conexión segura."
      );
      this.isLoading.set(false);
      return false;
    }

    return true;
  }

  /**
   * Solicitar permisos de cámara
   */
  private async requestCameraPermission(): Promise<void> {
    if (this.isDestroyed()) return;

    try {
      // Solicitar permisos explícitamente
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
        },
      });

      if (this.isDestroyed()) {
        // Si el componente se destruyó mientras esperábamos, limpiar
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      // Detener el stream solo si obtuvimos acceso
      stream.getTracks().forEach((track) => track.stop());

      this.hasPermission.set(true);
      this.errorMessage.set("");

      // Enumerar dispositivos disponibles
      await this.enumerateDevices();

      // Habilitar scanner solo si todo está OK
      if (!this.isDestroyed() && this.hasPermission() && this.hasDevices()) {
        setTimeout(() => {
          if (!this.isDestroyed()) {
            this.scannerEnabled.set(true);
            this.isLoading.set(false);
          }
        }, 500);
      }
    } catch (error: any) {
      if (this.isDestroyed()) return;

      console.error("Error al solicitar permisos de cámara:", error);

      let errorMsg = "Error desconocido";

      switch (error.name) {
        case "NotAllowedError":
          errorMsg =
            "Permisos de cámara denegados. Por favor permite el acceso a la cámara.";
          break;
        case "NotFoundError":
          errorMsg = "No se encontró ninguna cámara en este dispositivo.";
          break;
        case "NotSupportedError":
          errorMsg = "Tu navegador no soporta acceso a la cámara.";
          break;
        case "NotReadableError":
          errorMsg = "La cámara está siendo usada por otra aplicación.";
          break;
        case "OverconstrainedError":
          errorMsg =
            "No se pudo configurar la cámara con los parámetros solicitados.";
          break;
        default:
          errorMsg = `Error al acceder a la cámara: ${error.message}`;
      }

      this.errorMessage.set(errorMsg);
      this.hasPermission.set(false);
      this.isLoading.set(false);
    }
  }

  /**
   * Enumerar dispositivos de video disponibles
   */
  private async enumerateDevices(): Promise<void> {
    if (this.isDestroyed()) return;

    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );

      if (this.isDestroyed()) return;

      this.availableDevices.set(videoDevices);
      this.hasDevices.set(videoDevices.length > 0);

      // Seleccionar cámara trasera por defecto si está disponible
      const backCamera = videoDevices.find(
        (device) =>
          device.label.toLowerCase().includes("back") ||
          device.label.toLowerCase().includes("trasera") ||
          device.label.toLowerCase().includes("environment")
      );

      this.currentDevice.set(backCamera || videoDevices[0]);
    } catch (error) {
      if (!this.isDestroyed()) {
        console.error("Error al enumerar dispositivos:", error);
      }
    }
  }

  /**
   * Evento cuando se encuentran cámaras
   */
  public onCamerasFound(devices: MediaDeviceInfo[]): void {
    if (this.isDestroyed()) return;

    this.availableDevices.set(devices);
    this.hasDevices.set(devices.length > 0);

    if (devices.length > 0 && !this.currentDevice()) {
      // Buscar cámara trasera
      const backCamera = devices.find(
        (device) =>
          device.label.toLowerCase().includes("back") ||
          device.label.toLowerCase().includes("trasera")
      );

      this.currentDevice.set(backCamera || devices[0]);
    }

    this.isLoading.set(false);
  }

  /**
   * Evento cuando no se encuentran cámaras
   */
  public onCamerasNotFound(): void {
    if (this.isDestroyed()) return;

    console.warn("No se encontraron cámaras");
    this.errorMessage.set("No se encontraron cámaras disponibles.");
    this.hasDevices.set(false);
    this.isLoading.set(false);
  }

  /**
   * Evento de respuesta de permisos
   */
  public onPermissionResponse(permission: boolean): void {
    if (this.isDestroyed()) return;

    this.hasPermission.set(permission);

    if (!permission) {
      this.errorMessage.set(
        "Permisos de cámara denegados. Por favor permite el acceso a la cámara."
      );
      this.scannerEnabled.set(false);
    }
  }

  /**
   * Evento cuando se escanea un QR exitosamente
   */
  public onQRScanned(result: string): void {
    if (this.isDestroyed() || this.isProcessingQR()) return;

    // Marcar como procesando para evitar múltiples procesados
    this.isProcessingQR.set(true);

    // Deshabilitar scanner INMEDIATAMENTE
    this.scannerEnabled.set(false);
    const scannerComponent = this.scanner();
    if (scannerComponent) {
      scannerComponent.enable = false;
    }

    // Procesar el resultado
    this.processQRResult(result);
  }

  /**
   * Evento de error de escaneo
   */
  public onScanError(error: any): void {
    if (this.isDestroyed()) return;
    console.error("Error de escaneo:", error);
  }

  /**
   * Procesar el resultado del QR
   */
  private async processQRResult(qrData: string): Promise<void> {
    if (this.isDestroyed()) return;

    try {
      // Lógica específica de tu aplicación
      // const data = JSON.parse(qrData);
      // await this.visitantUseCase.processVisitantCode(data);

      if (!this.isDestroyed()) {
        this.notificationService.showNotification({
          message: "QR procesado exitosamente",
        });

        // Pequeño delay antes de cerrar para mostrar la notificación
        // setTimeout(() => {
          if (!this.isDestroyed())
            this.closeScanner(qrData);
          // }
        // }, 500);
      }
    } catch (error) {
      if (this.isDestroyed()) return;

      console.error("Error al procesar QR:", error);
      this.notificationService.showNotification({
        message: "Error al procesar el código QR",
        theme: "error",
      });

      // Reactivar scanner para intentar de nuevo
      this.isProcessingQR.set(false);
      setTimeout(() => {
        if (!this.isDestroyed() && this.hasPermission()) {
          this.scannerEnabled.set(true);
          const scannerComponent = this.scanner();
          if (scannerComponent) {
            scannerComponent.enable = true;
          }
        }
      }, 2000);
    }
  }

  /**
   * Cambiar dispositivo de cámara
   */
  public switchCamera(device: MediaDeviceInfo): void {
    if (this.isDestroyed()) return;

    this.currentDevice.set(device);
    const scannerComponent = this.scanner();
    if (scannerComponent) {
      scannerComponent.device = device;
    }
  }

  /**
   * Reintentar acceso a la cámara
   */
  public async retryCamera(): Promise<void> {
    if (this.isDestroyed()) return;

    this.isLoading.set(true);
    this.errorMessage.set("");
    this.isProcessingQR.set(false);
    await this.requestCameraPermission();
  }

  /**
   * Cerrar el modal
   */
  public closeScanner(qrData?: string): void {
    // Marcar como destruido para prevenir operaciones adicionales
    this.isDestroyed.set(true);

    // Limpiar scanner
    this.cleanupScanner();

    // Emitir cierre del diálogo
    try {
      this.dialogClose.emit(qrData);
    } catch (error) {
      console.warn("Error al cerrar diálogo:", error);
    }
  }

  /**
   * Limpiar completamente el scanner
   */
  private cleanupScanner(): void {
    const scannerComponent = this.scanner();
    if (scannerComponent) {
      try {
        scannerComponent.enable = false;
        // Forzar parada del scanner
        scannerComponent.scanStop();
      } catch (error) {
        console.warn("Error al limpiar scanner:", error);
      }
    }

    this.scannerEnabled.set(false);
    this.isDestroyed.set(true);
  }

  ngOnDestroy(): void {
    this.cleanupScanner();
  }
}
