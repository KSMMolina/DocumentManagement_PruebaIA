import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "documents",
    loadChildren: () =>
      import("@features/documents/presentation/documents.routes").then(
        (m) => m.documentsRoutes
      ),
  },
  {
    path: "",
    pathMatch: "full",
    redirectTo: "documents",
  },
];
