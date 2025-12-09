import { inject } from "@angular/core";
import { FolderManagementGateway } from "./gateway";
import { IFolderManagement } from "./interface";
import { IGeneric } from "@shared/Core/architecture/interface/generic.interface";

export class FolderManagementUseCase {
  private gateway: FolderManagementGateway = inject(FolderManagementGateway);

  public create(folder: IFolderManagement.CreateFolderRequest) {
    return this.gateway.create(folder);
  }

  public update(folder: IFolderManagement.UpdateFolderRequest) {
    return this.gateway.update(folder);
  }

  public delete(id: string) {
    return this.gateway.delete(id);
  }

  public getById(id: string) {
    return this.gateway.getById(id);
  }

  public getSummary(id: string, params?: IGeneric.QueryParamsFilter) {
    return this.gateway.getSummary(id, params);
  }

  public getAllByProperty(propertyId?: string, params?: IGeneric.QueryParamsFilter) {
    return this.gateway.getAllByProperty(propertyId, params);
  }

  public getAll() {
    return this.gateway.getAll();
  }
}