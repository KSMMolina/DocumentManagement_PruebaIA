import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { DocumentDraft, DocumentModel } from "../../domain/document.model";
import {
  DOCUMENT_REPOSITORY,
  DocumentRepository,
} from "../../domain/document.repository";

@Injectable()
export class CreateDocumentUseCase {
  constructor(
    @Inject(DOCUMENT_REPOSITORY) private repository: DocumentRepository
  ) {}

  execute(payload: DocumentDraft): Observable<DocumentModel> {
    return this.repository.create(payload);
  }
}
