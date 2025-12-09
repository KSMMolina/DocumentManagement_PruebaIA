import { WEmergencyAlert } from "@shared/Core/emergency-alerts/emergency-alert/domain/websockets.events";
import { inject, Injectable, signal } from "@angular/core";
import { Assets } from "@assets";
import * as signalR from "@microsoft/signalr";
import { UserLocalService } from "@user.service";
import { environment } from "Core/Config/Enviroment";

export enum WebsocketsConnection {
  EmergencyAlerts = "emergencyAlerts",
  Request = "request",
}

@Injectable({
  providedIn: "root",
})
export class WebsocketsService {
  private hubConnection: Partial<
    Record<WebsocketsConnection, signalR.HubConnection>
  > = {};

  private readonly PROPERTIES_TOKEN = [
    "GroupsPlaceRolesUsersId",
    "PropertyId",
    "Document",
    "RoleId",
    "RoleTypeId",
    "GroupPlaceId",
  ];

  readonly connectionState = {
    [WebsocketsConnection.EmergencyAlerts]: signal(
      signalR.HubConnectionState.Disconnected
    ),
    [WebsocketsConnection.Request]: signal(
      signalR.HubConnectionState.Disconnected
    ),
  };
  readonly lastError = {
    [WebsocketsConnection.EmergencyAlerts]: signal<Error | null>(null),
    [WebsocketsConnection.Request]: signal<Error | null>(null),
  };

  readonly isConnected = {
    [WebsocketsConnection.EmergencyAlerts]: signal(false),
    [WebsocketsConnection.Request]: signal(false),
  };

  private usersConnected = signal<{
    emergencyAlerts: string[];
    request: string[];
  }>({
    emergencyAlerts: [],
    request: [],
  });

  private userLocalService: UserLocalService = inject(UserLocalService);

  startConnection(
    connection: WebsocketsConnection,
    extraParams: Record<string, string> = {}
  ): void {
    const currentConnection = this.hubConnection[connection];

    if (
      currentConnection &&
      (currentConnection.state === signalR.HubConnectionState.Connected ||
        currentConnection.state === signalR.HubConnectionState.Connecting)
    ) {
      return;
    }

    const token = window.localStorage.getItem(Assets.credentials.ACCESS_TOKEN);
    let path = `${environment.websockets[connection]}?${Assets.credentials.ACCESS_TOKEN}=${token}`;

    if (!environment.production) {
      this.PROPERTIES_TOKEN.forEach(
        (property) =>
          (path += `${property}=${
            this.userLocalService.user()?.[property]
          }`)
      );
    }

    Object.entries(extraParams).forEach(
      ([key, value]) => (path += `&${key}=${value}`)
    );

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(path, {
        // accessTokenFactory: () => (environment.production ? token : ""),
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect([1000, 3000, 5000, 10000])
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.hubConnection[connection] = newConnection;

    this.registerConnectionHandlers(connection);

    newConnection
      .start()
      .then(() => {
        this.connectionState[connection].set(newConnection.state);
        this.isConnected[connection].set(true);

        // this.on("UserConnected", (user: string) =>
        //   this.usersConnected.update((users) => ({
        //     ...users,
        //     [connection]: [...users[connection], user],
        //   }))
        // );

        // this.on("UserDisconnected", (user: string) =>
        //   this.usersConnected.update((users) => ({
        //     ...users,
        //     [connection]: users[connection].filter((u) => u !== user),
        //   }))
        // );

        if (connection === WebsocketsConnection.EmergencyAlerts) {
          /** Si es portero se agrega al grupo de todas las alertas */
          if (this.userLocalService.isDoorman())
            this.send(
              connection,
              WEmergencyAlert.Events.OnRegisterDoormanToAlertsGroup
            );

          /** Se escucha si tiene alertas activas o en atención y no es un portero */
          if (!this.userLocalService.isDoorman()) {
            this.on(
              connection,
              "UserConnectedInAlert",
              (emergencyAlertId: string) =>
                this.userLocalService.idsEmergencyAlertsAttendingOrNew.update(
                  (ids) => [...ids, emergencyAlertId]
                )
            );
          }
        }

        if (
          this.userLocalService.isAdmin() &&
          connection === WebsocketsConnection.Request
        ) {
          // this.send(
          //   connection,
          //   WRequest.Events.OnRegisterAdminsToRequestGroup
          // );
        }
      })
      .catch((err) => {
        this.lastError[connection].set(err);
        this.printLog(() =>
          console.error(`Error de conexión SignalR (${connection}):`, err)
        );
      });
  }

  /**
   * Escucha mensajes desde el backend
   */
  on<T>(
    connection: WebsocketsConnection,
    method: string,
    callback: (data: T) => void
  ): void {
    this.hubConnection[connection]?.on(method, callback);
  }

  /**
   * Envía datos al backend
   */
  send(connection: WebsocketsConnection, method: string, ...args: any[]): void {
    const conn = this.hubConnection[connection];
    if (!conn || conn.state !== signalR.HubConnectionState.Connected) {
      this.printLog(() =>
        console.warn(`[${connection}] SignalR no está conectado`)
      );
      return;
    }

    const task =
      args.length > 0 ? conn.invoke(method, ...args) : conn.invoke(method);

    task
      .then(() => {
        this.printLog(() =>
          console.log(`Evento [${method}] enviado en [${connection}]`)
        );
      })
      .catch((err) => {
        this.printLog(() =>
          console.error(`Error al enviar [${method}] en [${connection}]`, err)
        );
      });
  }

  off(connection: WebsocketsConnection, method: string): void {
    this.hubConnection[connection].off(method);
  }

  private registerConnectionHandlers(connection: WebsocketsConnection): void {
    const conn = this.hubConnection[connection];
    if (!conn) return;

    conn.onreconnecting((error) => {
      this.connectionState[connection].set(
        signalR.HubConnectionState.Reconnecting
      );
      this.printLog(() =>
        console.warn(`[${connection}] Reconectando...`, error)
      );
    });

    conn.onreconnected((connectionId) => {
      this.connectionState[connection].set(
        signalR.HubConnectionState.Connected
      );
      this.isConnected[connection].set(true);
      this.printLog(() =>
        console.log(`[${connection}] Reconectado con ID:`, connectionId)
      );
    });

    conn.onclose((error) => {
      this.connectionState[connection].set(
        signalR.HubConnectionState.Disconnected
      );
      this.isConnected[connection].set(false);
      this.lastError[connection].set(error ?? null);
      this.printLog(() => console.warn(`[${connection}] Desconectado`, error));
    });
  }

  reconnect(connection: WebsocketsConnection): void {
    this.disconnect(connection);
    setTimeout(() => this.startConnection(connection), 1000);
  }

  /**
   * Cierra la conexión
   */
  disconnect(connection: WebsocketsConnection): void {
    const conn = this.hubConnection[connection];
    if (conn) {
      conn.stop().then(() => {
        this.connectionState[connection].set(
          signalR.HubConnectionState.Disconnected
        );
        this.isConnected[connection].set(false);
        this.hubConnection[connection] = undefined;
      });
    }
  }

  private printLog(callback: () => void): void {
    !environment.production && callback();
  }
}
