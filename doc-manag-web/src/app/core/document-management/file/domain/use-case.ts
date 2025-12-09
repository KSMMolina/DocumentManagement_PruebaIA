import { inject } from "@angular/core";
import { DocumentManagementFileGateway } from "./gateway";
import { IDocumentManagement } from "./interface";
import { IGeneric } from "@shared/Core/architecture/interface/generic.interface";

export class DocumentManagementFileUseCase {
  private gateway: DocumentManagementFileGateway = inject(DocumentManagementFileGateway);

  public uploadFile(file: IDocumentManagement.UploadFileRequest) {
    return this.gateway.upload(file);
  }

  public downloadFile(id: string) {
    return this.gateway.download(id);
  }

  public updateFile(file: IDocumentManagement.UpdateFileRequest) {
    return this.gateway.update(file);
  }

  public delete(id: string) {
    return this.gateway.delete(id);
  }

  public getById(id: string) {
    return this.gateway.getById(id);
  }

  public getSummaryByProperty(params?: IGeneric.QueryParamsFilter) {
    return this.gateway.getSummaryByProperty(params);
  }

  public getFileTreeByProperty(params?: IGeneric.QueryParamsFilter) {
    return this.gateway.getFileTreeByProperty(params);
  }
}