import { Observable } from "rxjs";
import { IGeneric } from "@shared/Core/architecture/interface/generic.interface";
import { IFolderManagement } from "./interface";

export abstract class FolderManagementGateway {

  abstract create(folder: IFolderManagement.CreateFolderRequest): Observable<IGeneric.Response<string>>;

  abstract update(folder: IFolderManagement.UpdateFolderRequest): Observable<IGeneric.Response<string>>;

  abstract delete(id: string): Observable<IGeneric.Response<string>>;

  abstract getById(id: string): Observable<IGeneric.Response<IFolderManagement.FolderUpdateResponse>>;

  abstract getSummary(id: string, params?: IGeneric.QueryParamsFilter): Observable<IGeneric.Response<IFolderManagement.FolderSummaryResponse>>;

  abstract getAllByProperty(propertyId?: string, params?: IGeneric.QueryParamsFilter): Observable<IGeneric.Response<IFolderManagement.ParentFolderCardResponse[]>>;

  abstract getAll(): Observable<IGeneric.Response<IFolderManagement.FolderResponse[]>>;
}