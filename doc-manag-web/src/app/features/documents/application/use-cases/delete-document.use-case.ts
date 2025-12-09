import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

import {
  DOCUMENT_REPOSITORY,
  DocumentRepository,
} from "../../domain/document.repository";

@Injectable()
export class DeleteDocumentUseCase {
  constructor(
    @Inject(DOCUMENT_REPOSITORY) private repository: DocumentRepository
  ) {}

  execute(id: string): Observable<void> {
    return this.repository.delete(id);
  }
}
