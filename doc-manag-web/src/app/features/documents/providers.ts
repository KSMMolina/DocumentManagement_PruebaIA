import { Provider } from "@angular/core";

import { GetDocumentsUseCase } from "./application/use-cases/get-documents.use-case";
import { CreateDocumentUseCase } from "./application/use-cases/create-document.use-case";
import { UpdateDocumentUseCase } from "./application/use-cases/update-document.use-case";
import { DeleteDocumentUseCase } from "./application/use-cases/delete-document.use-case";
import { DOCUMENT_REPOSITORY } from "./domain/document.repository";
import { HttpDocumentRepository } from "./infrastructure/repositories/http-document.repository";

export const documentsProviders: Provider[] = [
  {
    provide: DOCUMENT_REPOSITORY,
    useClass: HttpDocumentRepository,
  },
  CreateDocumentUseCase,
  UpdateDocumentUseCase,
  DeleteDocumentUseCase,
  GetDocumentsUseCase,
];
