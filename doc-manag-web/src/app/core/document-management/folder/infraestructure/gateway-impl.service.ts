import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { UrlService } from "./url.service";

import { HttpService } from "../../../architecture/http/http.service";
import { FolderManagementGateway } from "../domain/gateway";
import { IFolderManagement } from "../domain/interface";

import { IGeneric } from "../../../architecture/interface/generic.interface";

@Injectable()
export class ImplFolderManagementGateway implements FolderManagementGateway {
  private readonly httpService = inject(HttpService);
  private readonly url = inject(UrlService);

  create(
    folder: IFolderManagement.CreateFolderRequest
  ): Observable<IGeneric.Response<string>> {
    return this.httpService.post(`${this.url.create}`, folder);
  }
  
  update(
    folder: IFolderManagement.UpdateFolderRequest
  ): Observable<IGeneric.Response<string>> {
    return this.httpService.put(`${this.url.update}`, folder);
  }

  delete(id: string): Observable<IGeneric.Response<string>> {
    return this.httpService.delete(this.url.delete(id));
  }

  getById(
    id: string
  ): Observable<IGeneric.Response<IFolderManagement.FolderUpdateResponse>> {
    return this.httpService.get(this.url.getById(id));
  }

  getSummary(
    id: string,
    params?: IGeneric.QueryParamsFilter
  ): Observable<IGeneric.Response<IFolderManagement.FolderSummaryResponse>> {
    return this.httpService.get(this.url.getSummary(id), { params: { ...params } });
  }

  getAllByProperty(
    propertyId?: string,
    params?: IGeneric.QueryParamsFilter
  ): Observable<IGeneric.Response<IFolderManagement.ParentFolderCardResponse[]>> {
    return this.httpService.get(`${this.url.getAllByProperty}`, { params: { propertyId, ...params }, });
  }

  getAll(): Observable<IGeneric.Response<IFolderManagement.FolderResponse[]>> {
    return this.httpService.get(this.url.getAll);
  }
}
