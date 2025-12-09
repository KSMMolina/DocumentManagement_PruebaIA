Feature: Documents
==================

Capas
-----
- domain: contratos y entidades (modelos, interfaces de repositorio).
- application: casos de uso orquestan repositorios/servicios.
- infrastructure: implementaciones concretas (http, storage, mocks).
- presentation: componentes/páginas y rutas de Angular.

Proveedores
-----------
- `documentsProviders` se declaran en la ruta lazy de la feature.
- Casos de uso (`Get/Create/Update/DeleteDocumentsUseCase`) y `DOCUMENT_REPOSITORY` viven en el inyector de la feature.

Cómo usar
---------
1. Navega a `/documents` (ruta lazy) para consumir el `DocumentsPageComponent`.
2. `HttpDocumentRepository` apunta a `/api/documents`; ajusta la URL/base según tu backend o proxy.
3. Agrega más casos de uso en `application/use-cases` y mantenlos registrados en `documentsProviders`.
