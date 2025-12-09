import { inject, Injectable, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { Folder } from '../../domain/models/folder.model';
import { DocumentFile } from '../../domain/models/document-file.model';
import { LoadRootFoldersUseCase } from '../use-cases/load-root-folders.use-case';
import { LoadDocumentsByFolderUseCase } from '../use-cases/load-documents-by-folder.use-case';

@Injectable({
  providedIn: 'root',
})
export class DocumentManagementFacade {
  private readonly loadRootFoldersUseCase = inject(LoadRootFoldersUseCase);
  private readonly loadDocumentsByFolderUseCase = inject(
    LoadDocumentsByFolderUseCase,
  );

  // Estado expuesto a la capa de presentación (signals)
  readonly folders = signal<Folder[]>([]);
  readonly documents = signal<DocumentFile[]>([]);
  readonly loadingFolders = signal(false);
  readonly loadingDocuments = signal(false);
  readonly error = signal<string | null>(null);

  loadRootFolders(): void {
    this.loadingFolders.set(true);
    this.error.set(null);

    this.loadRootFoldersUseCase
      .execute()
      .pipe(finalize(() => this.loadingFolders.set(false)))
      .subscribe({
        next: folders => this.folders.set(folders),
        error: () => this.error.set('Error al cargar carpetas'),
      });
  }

  loadDocumentsByFolder(folderId: string): void {
    this.loadingDocuments.set(true);
    this.error.set(null);

    this.loadDocumentsByFolderUseCase
      .execute(folderId)
      .pipe(finalize(() => this.loadingDocuments.set(false)))
      .subscribe({
        next: docs => this.documents.set(docs),
        error: () => this.error.set('Error al cargar documentos'),
      });
  }

  // Método de conveniencia para limpiar documentos cuando cambias de carpeta
  clearDocuments(): void {
    this.documents.set([]);
  }
}
