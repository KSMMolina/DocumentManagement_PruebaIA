import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { DOCUMENT_MANAGEMENT_API } from '../../infrastructure/http/document-management-api';
import { mapDocumentFileDtoToDomain } from '../../infrastructure/mappers/document-file.mapper';
import { DocumentFile } from '../../domain/models/document-file.model';

@Injectable({
  providedIn: 'root',
})
export class LoadDocumentsByFolderUseCase {
  private readonly api = inject(DOCUMENT_MANAGEMENT_API);

  execute(folderId: string): Observable<DocumentFile[]> {
    return this.api.getDocumentsByFolder(folderId).pipe(
      map(dtos => dtos.map(mapDocumentFileDtoToDomain)),
    );
  }
}
