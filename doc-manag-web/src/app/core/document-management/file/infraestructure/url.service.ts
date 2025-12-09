import { Injectable } from "@angular/core";
import { environment } from "Core/Config/Enviroment";

@Injectable({
    providedIn: "root",
})
export class UrlService {
  // private get baseUrl(): string {
  //   return `${environment.urlApi}/document-management/api/DocumentManagementFile/`;
  // }
  
  private get baseUrl(): string {
    return `https://localhost:7180/api/DocumentManagementFile/`;
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