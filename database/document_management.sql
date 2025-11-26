-- 1. Tablas + descripción
-- properties: catálogo de propiedades horizontales.
-- folders: árbol de carpetas por propiedad con profundidad y orden restringidos.
-- documents: archivos asociados a carpetas, limita 5 por carpeta.
-- folder_permissions: permisos por rol sobre cada carpeta.
-- audit_logs: bitácora de todas las operaciones de carpetas y archivos.
-- user_roles: catálogo de roles permitidos (administrador, residente, portero).

-- 2. Relaciones (diagrama relacional en texto)
-- properties (1) ───< folders (recursiva parent_folder_id)
-- folders (1) ───< documents
-- folders (1) ───< folder_permissions >─── user_roles (N:1)
-- folders (0..1) ───< audit_logs >─── documents (0..1)

-- 3. Reglas destacadas
-- - Profundidad máxima de carpetas: 3 niveles.
-- - Máximo 2 carpetas hermanas por nivel controlado con sibling_order (1..2) y únicos por padre y por propiedad para raíces.
-- - Máximo 5 archivos por carpeta con slot (1..5) único por carpeta.
-- - Tamaño máximo de archivo: 50 MB.
-- - Rol administrador siempre tiene acceso total y no puede retirarse.
-- - Auditoría de todas las acciones relevantes.

\connect "DocumentManagementIaTest";

CREATE SCHEMA IF NOT EXISTS document_management;
SET search_path TO document_management;

CREATE TABLE IF NOT EXISTS user_roles (
    id SMALLINT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO user_roles (id, name) VALUES
    (1, 'ADMINISTRATOR'),
    (2, 'RESIDENT'),
    (3, 'PORTER')
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS properties (
    id UUID PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL
);

CREATE TABLE IF NOT EXISTS folders (
    id UUID PRIMARY KEY,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    parent_folder_id UUID NULL REFERENCES folders(id) ON DELETE RESTRICT,
    name VARCHAR(150) NOT NULL,
    depth SMALLINT NOT NULL,
    sibling_order SMALLINT NOT NULL,
    CONSTRAINT ck_folders_depth CHECK (depth BETWEEN 1 AND 3),
    CONSTRAINT ck_folders_sibling_order CHECK (sibling_order BETWEEN 1 AND 2)
);

CREATE UNIQUE INDEX IF NOT EXISTS ux_folders_parent_order ON folders(parent_folder_id, sibling_order);
CREATE UNIQUE INDEX IF NOT EXISTS ux_folders_root_order ON folders(property_id, sibling_order) WHERE parent_folder_id IS NULL;

CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY,
    folder_id UUID NOT NULL REFERENCES folders(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    description VARCHAR(500) NULL,
    size_bytes BIGINT NOT NULL,
    slot SMALLINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT ck_documents_slot CHECK (slot BETWEEN 1 AND 5),
    CONSTRAINT ck_documents_size CHECK (size_bytes > 0 AND size_bytes <= 50 * 1024 * 1024)
);

CREATE UNIQUE INDEX IF NOT EXISTS ux_documents_slot ON documents(folder_id, slot);

CREATE TABLE IF NOT EXISTS folder_permissions (
    id UUID PRIMARY KEY,
    folder_id UUID NOT NULL REFERENCES folders(id) ON DELETE CASCADE,
    role SMALLINT NOT NULL REFERENCES user_roles(id),
    can_view BOOLEAN NOT NULL DEFAULT FALSE,
    can_download BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT ck_folder_permissions_admin_scope CHECK (role <> 1 OR (can_view AND can_download))
);

CREATE UNIQUE INDEX IF NOT EXISTS ux_folder_permissions_role ON folder_permissions(folder_id, role);

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY,
    action VARCHAR(100) NOT NULL,
    actor VARCHAR(200) NOT NULL,
    actor_role VARCHAR(100) NOT NULL,
    occurred_on TIMESTAMPTZ NOT NULL,
    details VARCHAR(500) NULL,
    folder_id UUID NULL REFERENCES folders(id) ON DELETE SET NULL,
    document_id UUID NULL REFERENCES documents(id) ON DELETE SET NULL
);

-- 5. Notas técnicas importantes
-- * El índice ux_folders_root_order aplica solo a raíces para restringir a dos carpetas por propiedad en el nivel superior.
-- * Los campos slot y sibling_order actúan como ranuras lógicas para imponer los límites máximos sin triggers.
-- * Se recomienda usar transacciones al crear/eliminar carpetas y documentos para mantener la consistencia.
-- * Para búsquedas por nombre se sugiere habilitar extensiones de ILIKE o índices trigram según el volumen.
