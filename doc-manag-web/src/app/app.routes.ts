import { AppComponent } from './app.component';
import { Routes } from '@angular/router';
import { DOCUMENT_MANAGEMENT_ROUTES } from './features/document-management/presentation/routes';
export const appRoutes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      // Panel raíz (dashboard de documento)
      ...DOCUMENT_MANAGEMENT_ROUTES,
    ],
  },
  // podrías agregar aquí otras features en el futuro
];