import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

import {
  DocumentDraft,
  DocumentModel,
} from "../../domain/document.model";
import { DocumentRepository } from "../../domain/document.repository";

@Injectable()
export class HttpDocumentRepository implements DocumentRepository {
  private readonly http = inject(HttpClient);
  // Ajusta la URL base según tu backend; se deja relativa para convivir con proxy local.
  private readonly baseUrl = "/api/documents";

  list(): Observable<DocumentModel[]> {
    return this.http.get<DocumentModel[]>(this.baseUrl);
  }

  create(payload: DocumentDraft): Observable<DocumentModel> {
    return this.http.post<DocumentModel>(this.baseUrl, payload);
  }

  update(id: string, payload: Partial<DocumentDraft>): Observable<DocumentModel> {
    return this.http.patch<DocumentModel>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
