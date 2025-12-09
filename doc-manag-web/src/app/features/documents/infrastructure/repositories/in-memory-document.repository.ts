import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";

import { DocumentModel } from "../../domain/document.model";
import { DocumentRepository } from "../../domain/document.repository";

@Injectable()
export class InMemoryDocumentRepository implements DocumentRepository {
  list(): Observable<DocumentModel[]> {
    return of([
      {
        id: "1",
        title: "Manual de usuario",
        status: "published",
        updatedAt: "2025-12-09T10:00:00Z",
      },
      {
        id: "2",
        title: "Política de privacidad",
        status: "draft",
        updatedAt: "2025-12-08T08:30:00Z",
      },
      {
        id: "3",
        title: "Acta de comité",
        status: "archived",
        updatedAt: "2025-11-30T15:10:00Z",
      },
    ]);
  }
}
