import { Injectable } from "@angular/core";
import { environment } from "@core/config/environment";

@Injectable({
    providedIn: "root",
})
export class UrlService {
  private get baseUrl(): string {
    return `${environment.urlApi}/api/DocumentManagementFile/`;
  }

  public get upload(): string {
    return `${this.baseUrl}Upload/`;
  }

  public download(id: string): string {
    return `${this.baseUrl}Download/${id}`;
  }

  public get update(): string {
    return `${this.baseUrl}Update/`;
  }

  public delete(id: string): string {
    return `${this.baseUrl}Delete/${id}`;
  }

  public getById(id: string): string {
    return `${this.baseUrl}GetById/${id}`;
  }

  public get getSummaryByProperty(): string {
    return `${this.baseUrl}GetSummaryByProperty/`;
  }

  public get getFileTreeByProperty(): string {
    return `${this.baseUrl}GetFileTreeByProperty/`;
  }
}
