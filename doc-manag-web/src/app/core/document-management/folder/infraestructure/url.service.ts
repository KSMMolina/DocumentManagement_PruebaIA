import { Injectable } from "@angular/core";
import { environment } from "Core/Config/Enviroment";

@Injectable({
    providedIn: "root",
})
export class UrlService {
  // private get baseUrl(): string {
  //   return `${environment.urlApi}/document-management/api/Folder/`;
  // }

  private get baseUrl(): string {
    return `https://localhost:7180/api/Folder/`;
  }

  public get create(): string {
    return `${this.baseUrl}Create/`;
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

  public getSummary(id: string): string {
    return `${this.baseUrl}GetSummary/${id}`;
  }

  public get getAllByProperty(): string {
    return `${this.baseUrl}GetAllByProperty`;
  }

  public get getAll(): string {
    return `${this.baseUrl}GetAll`;
  }
}