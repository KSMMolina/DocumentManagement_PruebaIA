import { InjectionToken } from "@angular/core";
import { Observable } from "rxjs";

import { DocumentDraft, DocumentModel } from "./document.model";

export interface DocumentRepository {
  list(): Observable<DocumentModel[]>;
  create(payload: DocumentDraft): Observable<DocumentModel>;
  update(id: string, payload: Partial<DocumentDraft>): Observable<DocumentModel>;
  delete(id: string): Observable<void>;
}

export const DOCUMENT_REPOSITORY = new InjectionToken<DocumentRepository>(
  "DOCUMENT_REPOSITORY"
);
