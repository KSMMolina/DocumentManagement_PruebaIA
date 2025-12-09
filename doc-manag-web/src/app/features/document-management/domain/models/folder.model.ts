/**
 * Modelo de dominio para carpeta de gestión documental.
 * Basado en IFolderManagement.FolderResponse del proyecto productivo,
 * pero adaptado a tipos más ricos (Date, nombres más expresivos).
 */
export interface Folder {
  id: string;
  propertyId: string;
  order: number;
  name: string;
  description?: string;
  color?: string;
  parentFolderId?: string | null;
  path: string;

  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;

  filesCount?: number;
  roleId?: string;
}
