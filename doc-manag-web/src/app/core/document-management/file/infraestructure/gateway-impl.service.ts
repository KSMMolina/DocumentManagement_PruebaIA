import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { UrlService } from "./url.service";

import { HttpService } from "../../../architecture/http/http.service";
import { DocumentManagementFileGateway } from "../domain/gateway";
import { IDocumentManagement } from "../domain/interface";
import { IGeneric } from "../../../architecture/interface/generic.interface";

@Injectable()
export class ImplDocumentManagementFileGateway implements DocumentManagementFileGateway {
  private readonly httpService = inject(HttpService);
  private readonly url = inject(UrlService);

  upload(file: IDocumentManagement.UploadFileRequest): Observable<IGeneric.Response<string>> {
    return this.httpService.post(`${this.url.upload}`, file);
  }

  download(id: string): Observable<Blob> {
    return this.httpService.get(`${this.url.download(id)}`, { 
      responseType: 'blob' as 'json',
      observe: 'body'
    });
  }

  update(file: IDocumentManagement.UpdateFileRequest): Observable<IGeneric.Response<string>> {
    return this.httpService.put(`${this.url.update}`, file);
  }

  delete(id: string): Observable<IGeneric.Response<string>> {
    return this.httpService.delete(`${this.url.delete}${id}`);
  }

  getById(id: string): Observable<IGeneric.Response<IDocumentManagement.FileResponse>> {
    return this.httpService.get(`${this.url.getById}${id}`);
  }

  getSummaryByProperty(params?: IGeneric.QueryParamsFilter): Observable<IGeneric.Response<IDocumentManagement.FileResponse[]>> {
    return this.httpService.get(`${this.url.getSummaryByProperty}`, { params });
  }

  getFileTreeByProperty(params?: IGeneric.QueryParamsFilter): Observable<IGeneric.Response<IDocumentManagement.PropertyFilesSummaryRepsonse>> {
    return this.httpService.get(`${this.url.getFileTreeByProperty}`, { params });
  }
}