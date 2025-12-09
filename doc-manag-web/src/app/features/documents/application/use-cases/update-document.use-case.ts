import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { DocumentDraft, DocumentModel } from "../../domain/document.model";
import {
  DOCUMENT_REPOSITORY,
  DocumentRepository,
} from "../../domain/document.repository";

@Injectable()
export class UpdateDocumentUseCase {
  constructor(
    @Inject(DOCUMENT_REPOSITORY) private repository: DocumentRepository
  ) {}

  execute(id: string, payload: Partial<DocumentDraft>): Observable<DocumentModel> {
    return this.repository.update(id, payload);
  }
}
