import { Observable } from "rxjs";
import { IGeneric } from "@shared/Core/architecture/interface/generic.interface";
import { IDocumentManagement } from "./interface";

export abstract class DocumentManagementFileGateway {

  abstract upload(file: IDocumentManagement.UploadFileRequest): Observable<IGeneric.Response<string>>;

  abstract download(id: string): Observable<Blob>;

  abstract update(file: IDocumentManagement.UpdateFileRequest): Observable<IGeneric.Response<string>>;

  abstract delete(id: string): Observable<IGeneric.Response<string>>;

  abstract getById(id: string): Observable<IGeneric.Response<IDocumentManagement.FileResponse>>;

  abstract getSummaryByProperty(params?: IGeneric.QueryParamsFilter): Observable<IGeneric.Response<IDocumentManagement.FileResponse[]>>;

  abstract getFileTreeByProperty(params?: IGeneric.QueryParamsFilter): Observable<IGeneric.Response<IDocumentManagement.PropertyFilesSummaryRepsonse>>;
}