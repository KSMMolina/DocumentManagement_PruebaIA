export const environment = {
  production: false,
  /**
   * Base URL para las APIs REST.
   * Ajusta a tu backend (ej. https://localhost:7180).
   */
  urlApi: "https://localhost:7180",
  websockets: {
    emergencyAlerts: "wss://localhost:7180/hubs/emergencyAlerts",
    request: "wss://localhost:7180/hubs/request",
  },
};
