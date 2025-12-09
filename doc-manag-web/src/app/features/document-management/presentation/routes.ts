import { Routes } from '@angular/router';
import { PanelPageComponent } from './pages/panel-page/panel-page.component';
import { FoldersPageComponent } from './pages/folders-page/folders-page.component';
import { DocumentsPageComponent } from './pages/documents-page/documents-page.component';

export const DOCUMENT_MANAGEMENT_ROUTES: Routes = [
  // Panel principal
  {
    path: '',
    component: PanelPageComponent,
  },
  // Listado / gestión de carpetas
  {
    path: 'folders',
    component: FoldersPageComponent,
  },
  // Listado / gestión de documentos (archivos)
  {
    path: 'documents',
    component: DocumentsPageComponent,
  },
];
