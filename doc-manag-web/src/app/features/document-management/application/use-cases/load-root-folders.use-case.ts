import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { DOCUMENT_MANAGEMENT_API } from '../../infrastructure/http/document-management-api';
import { mapFolderDtoToDomain } from '../../infrastructure/mappers/folder.mapper';
import { Folder } from '../../domain/models/folder.model';

@Injectable({
  providedIn: 'root',
})
export class LoadRootFoldersUseCase {
  private readonly api = inject(DOCUMENT_MANAGEMENT_API);

  execute(): Observable<Folder[]> {
    return this.api.getRootFolders().pipe(
      map(dtos => dtos.map(mapFolderDtoToDomain)),
    );
  }
}
