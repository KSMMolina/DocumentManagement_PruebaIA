import { Route } from "@angular/router";

import { documentsProviders } from "@features/documents/providers";

export const documentsRoutes: Route[] = [
  {
    path: "",
    providers: documentsProviders,
    loadComponent: () =>
      import("./pages/documents/documents.page").then(
        (m) => m.DocumentsPageComponent
      ),
  },
];
