import { Assets } from "@assets";

/**
 * Limpia el localStorage
 */
export function cleanLocalStorage() {
  const itemsToDelete = [
    Assets.credentials.ACCESS_TOKEN,
    Assets.credentials.REFRESH_TOKEN,
  ];

  itemsToDelete.forEach((key) => window.localStorage.removeItem(key));
}
