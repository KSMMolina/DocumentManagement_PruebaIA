/**
 * Modelo de dominio para archivo/documento de gestión documental.
 * Basado en IDocumentManagement.FileResponse del proyecto productivo.
 */
export interface DocumentFile {
  id: string;
  folderId: string;
  name: string;
  folderName?: string;

  sizeBytes: number;
  mimeType: string;
  url: string;

  description?: string;

  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}
