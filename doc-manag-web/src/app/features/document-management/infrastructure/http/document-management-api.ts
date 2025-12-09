import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

// DTOs tal como los devuelve/esperaría el backend (tipos primitivos)
export interface FolderDto {
  id: string;
  propertyId: string;
  order: number;
  name: string;
  description?: string;
  color?: string;
  parentFolderId?: string | null;
  path: string;

  createdAt: string; // ISO string
  updatedAt: string;
  createdBy: string;
  updatedBy: string;

  filesCount?: number;
  roleId?: string;
}

export interface DocumentFileDto {
  id: string;
  folderId: string;
  name: string;
  folderName?: string;

  sizeBytes: number;
  mimeType: string;
  url: string;
  description?: string;

  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

// Puerto de infraestructura: cómo el resto de capas ven al microservicio
export interface DocumentManagementApi {
  getRootFolders(): Observable<FolderDto[]>;
  getDocumentsByFolder(folderId: string): Observable<DocumentFileDto[]>;
}

// Token para inyectar el API sin acoplarse a una implementación concreta
export const DOCUMENT_MANAGEMENT_API =
  new InjectionToken<DocumentManagementApi>('DOCUMENT_MANAGEMENT_API');
