import { ImplDocumentManagementFileGateway } from "../infraestructure/gateway-impl.service";
import { DocumentManagementFileUseCase } from "./use-case";
import { DocumentManagementFileGateway } from "./gateway";

export const providersDocumentManagementFile = [
  {
    provide: DocumentManagementFileGateway,
    useClass: ImplDocumentManagementFileGateway,
  },
  {
    provide: DocumentManagementFileUseCase,
    useClass: DocumentManagementFileUseCase,
  },
];
