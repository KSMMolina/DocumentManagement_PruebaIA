import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import {
  DocumentFileDto,
  DocumentManagementApi,
  FolderDto,
} from './document-management-api';

@Injectable({
  providedIn: 'root',
})
export class FakeDocumentManagementApi implements DocumentManagementApi {
  getRootFolders(): Observable<FolderDto[]> {
    const now = new Date().toISOString();

    const folders: FolderDto[] = [
      {
        id: 'root-1',
        propertyId: 'property-1',
        order: 1,
        name: 'Documentos legales',
        description: 'Reglamento, actas, manual de convivencia',
        color: '#3366FF',
        parentFolderId: null,
        path: 'Documentos legales',
        createdAt: now,
        updatedAt: now,
        createdBy: 'admin',
        updatedBy: 'admin',
        filesCount: 3,
        roleId: 'ROLE_ADMIN',
      },
      {
        id: 'root-2',
        propertyId: 'property-1',
        order: 2,
        name: 'Estados de cuenta',
        description: 'Extractos y certificados de cartera',
        color: '#22AA88',
        parentFolderId: null,
        path: 'Estados de cuenta',
        createdAt: now,
        updatedAt: now,
        createdBy: 'admin',
        updatedBy: 'admin',
        filesCount: 2,
        roleId: 'ROLE_ADMIN',
      },
    ];

    // Simulamos latencia de red
    return of(folders).pipe(delay(400));
  }

  getDocumentsByFolder(folderId: string): Observable<DocumentFileDto[]> {
    const now = new Date().toISOString();

    const docsForRoot1: DocumentFileDto[] = [
      {
        id: 'file-1',
        folderId: 'root-1',
        folderName: 'Documentos legales',
        name: 'Reglamento_de_propiedad_horizontal.pdf',
        sizeBytes: 1_024_000,
        mimeType: 'application/pdf',
        url: '#',
        description: 'Reglamento vigente 2024',
        createdAt: now,
        updatedAt: now,
        createdBy: 'admin',
        updatedBy: 'admin',
      },
      {
        id: 'file-2',
        folderId: 'root-1',
        folderName: 'Documentos legales',
        name: 'Acta_asamblea_ordinaria_2024.pdf',
        sizeBytes: 850_000,
        mimeType: 'application/pdf',
        url: '#',
        description: 'Acta de la última asamblea ordinaria',
        createdAt: now,
        updatedAt: now,
        createdBy: 'admin',
        updatedBy: 'admin',
      },
    ];

    const docsForRoot2: DocumentFileDto[] = [
      {
        id: 'file-3',
        folderId: 'root-2',
        folderName: 'Estados de cuenta',
        name: 'Estado_cuenta_enero_2024.pdf',
        sizeBytes: 600_000,
        mimeType: 'application/pdf',
        url: '#',
        description: 'Estado de cuenta enero',
        createdAt: now,
        updatedAt: now,
        createdBy: 'admin',
        updatedBy: 'admin',
      },
    ];

    const result =
      folderId === 'root-1' ? docsForRoot1 :
      folderId === 'root-2' ? docsForRoot2 :
      [];

    return of(result).pipe(delay(400));
  }
}
