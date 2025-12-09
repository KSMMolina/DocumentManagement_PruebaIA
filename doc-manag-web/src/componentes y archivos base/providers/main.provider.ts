import { enableProdMode } from "@angular/core";
import { environment } from "@core/config/environment";

if (environment.production)
  enableProdMode();


function getUrl() {
  // return environment.url;
}

// function getApiVersion(): string {
  // return environment.apiVersion;
// }

export const mainProviders = [
  // { provide: "URL", useFactory: getUrl, deps: [] },
  // { provide: "API_VERSION", useFactory: getApiVersion, deps: [] },
];
