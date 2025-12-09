import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { DOCUMENT_MANAGEMENT_API, } from './features/document-management/infrastructure/http/document-management-api';
import { FakeDocumentManagementApi } from './features/document-management/infrastructure/http/document-management-api.fake';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),

    // <<< API de gestión documental (por ahora fake) >>>
    { provide: DOCUMENT_MANAGEMENT_API, useClass: FakeDocumentManagementApi },
  ],
};
