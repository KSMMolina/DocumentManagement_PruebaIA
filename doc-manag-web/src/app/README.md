Clean Architecture (Front-End)
==============================

Capas base
----------
- core: cross-cutting (config, interceptors, providers, auth/session, http, guards, tokens).
- shared: diseño reutilizable (ui, styles, utils, data-access genérico).
- features: vertical slices. Cada feature contiene domain (models/interfaces), application (use-cases), infrastructure (adaptadores http/storage), presentation (componentes/pages, routing).
- app: shell/bootstrapping (app.config.ts, app.routes.ts, root layout components).

Reglas rápidas
--------------
- Presentation importa application y shared; nunca llama infrastructure directamente.
- Application orquesta domain e infrastructure; depende de interfaces, no de implementaciones concretas.
- Infrastructure implementa puertos definidos en domain/application (adapters, http, storage).
- Core no depende de features; shared no depende de features ni infrastructure.
- Alias (tsconfig): `@core/*`, `@shared/*`, `@features/*`, `@base/*` (componentes/estilos comunes).

Estilos
-------
- `src/styles.scss` usa los parciales de `src/componentes y archivos base/styles` vía `stylePreprocessorOptions.includePaths`.
- `shared/styles/_index.scss` reexporta core + components de la base para importarlos con `@use 'shared/styles';`.

Siguientes pasos sugeridos
--------------------------
- Crear una feature ejemplo (`features/documents`) con sus carpetas domain/application/infrastructure/presentation.
- Mover servicios/helpers legacy a `core` o `shared/utils` y tiparlos (signals, services locales).
- Si necesitas usar los componentes base, impórtalos vía `@base/components/...` y agrega un barrel en `shared/ui` según convenga.
