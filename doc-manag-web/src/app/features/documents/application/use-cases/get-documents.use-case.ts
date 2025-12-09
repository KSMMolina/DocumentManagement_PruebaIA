import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

import {
  DOCUMENT_REPOSITORY,
  DocumentRepository,
} from "../../domain/document.repository";
import { DocumentModel } from "../../domain/document.model";

@Injectable()
export class GetDocumentsUseCase {
  constructor(
    @Inject(DOCUMENT_REPOSITORY) private repository: DocumentRepository
  ) {}

  execute(): Observable<DocumentModel[]> {
    return this.repository.list();
  }
}
