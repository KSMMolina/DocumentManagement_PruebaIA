import {
  createComponent,
  ApplicationRef,
  ComponentRef,
  Injectable,
  inject,
} from "@angular/core";

import { NotificationComponent } from "./notification.component";
import { InjectorsService } from "@injectors.service";

export type NotificationThemes = "success" | "warning" | "error" | "info";

export type NotificationPositions =
  | "top-center"
  | "top-right"
  | "top-left"
  | "bottom-center"
  | "bottom-right"
  | "bottom-left";
interface NotificationConfig {
  callback?: (status: boolean) => void;
  position?: NotificationPositions;
  theme?: NotificationThemes;
  message: string;
  duration?: number;
  action?: string;
}

@Injectable({ providedIn: "root" })
export class NotificationService {
  private notificationComponentRef?: ComponentRef<NotificationComponent>;
  private instanceSetTimeout?: ReturnType<typeof setTimeout>;

  private appRef: ApplicationRef = inject(ApplicationRef);

  private injectorsService: InjectorsService = inject(InjectorsService);

  showNotification(config: NotificationConfig): void {
    this.destroy();

    const componentRef = createComponent(NotificationComponent, {
      environmentInjector: this.injectorsService.environmentInjector(),
      elementInjector: this.injectorsService.injector(),
    });

    this.notificationComponentRef = componentRef;

    // Configurar los parámetros del componente
    componentRef.setInput("position", config.position || "top-center");
    componentRef.setInput("theme", config.theme || "success");
    componentRef.setInput("hideNotification", false);
    componentRef.setInput("message", config.message);
    componentRef.setInput("action", config.action);

    // Agregar el componente al DOM
    this.appRef.attachView(componentRef.hostView);
    const element = (componentRef.hostView as any).rootNodes[0] as HTMLElement;
    document.body.appendChild(element);

    componentRef.instance.eventAction.subscribe((status) => {
      this.hideNotification(componentRef, false);
      config.callback && config.callback(status);
    });

    this.hideNotification(componentRef, true, config.duration || 4000);
  }

  public hideNotification(
    componentRef: ComponentRef<NotificationComponent>,
    executeUndo: boolean,
    duration = 0
  ): void {
    if (this.instanceSetTimeout) {
      clearTimeout(this.instanceSetTimeout);
      this.instanceSetTimeout = undefined;
    }

    // Ocultar luego de cierto tiempo
    this.instanceSetTimeout = setTimeout(() => {
      componentRef.setInput("hideNotification", true);
      executeUndo && componentRef.instance.eventAction.emit(false);
      // Esperar animación antes de destruir
      setTimeout(() => this.destroy(), 300);
    }, duration);
  }

  private destroy(): void {
    if (this.notificationComponentRef) {
      this.appRef.detachView(this.notificationComponentRef.hostView);
      this.notificationComponentRef.destroy();
      this.notificationComponentRef = undefined;
    }
  }
}
