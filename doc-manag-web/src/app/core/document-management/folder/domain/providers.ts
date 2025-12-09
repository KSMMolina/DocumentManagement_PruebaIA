import { ImplFolderManagementGateway } from "../infraestructure/gateway-impl.service";
import { FolderManagementUseCase } from "./use-case";
import { FolderManagementGateway } from "./gateway";

export const providersFolderManagement = [
  {
    provide: FolderManagementGateway,
    useClass: ImplFolderManagementGateway,
  },
  {
    provide: FolderManagementUseCase,
    useClass: FolderManagementUseCase,
  },
];
