import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Assets } from "@assets";
import { IGeneric } from "../interface/generic.interface";

export interface RequestOptions {
  sendToken?: boolean; // Por defecto true
  params?: IGeneric.QueryParamsFilter; // Parámetros de query
  customHeaders?: { [header: string]: string }; // Headers extra
  responseType?: "arraybuffer" | "blob" | "json" | "text"; // Nuevo campo
  reportProgress?: boolean;
  observe?: string;
}

@Injectable({
  providedIn: "root",
})
export class HttpService {
  constructor(private http: HttpClient) {}

  private createHeaders(options?: RequestOptions, body?: any): HttpHeaders {
    let headers =
      body instanceof FormData
        ? new HttpHeaders()
        : new HttpHeaders({
            "Content-Type": "application/json",
          });

    if (options?.sendToken !== false) {
      const token = localStorage.getItem(Assets.credentials.ACCESS_TOKEN);
      token && (headers = headers.set("Authorization", `Bearer ${token}`));
    }

    if (options?.customHeaders)
      Object.entries(options.customHeaders).forEach(([key, value]) => {
        headers = headers.set(key, value);
      });

    return headers;
  }

  private createParams(options?: RequestOptions): HttpParams {
    let params = new HttpParams();
    if (options?.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        if (![null, undefined].includes(value)) params = params.set(key, value);
      });
    }
    return params;
  }

  private createBody(body: any): any {
    if (typeof body === "string") return body;
    if (body instanceof FormData) return body;
    return JSON.stringify(body);
  }

  get<T>(url: string, options?: RequestOptions): Observable<T> {
    return this.http.get<T>(url, {
      headers: this.createHeaders(options, undefined),
      params: this.createParams(options),
      responseType: options?.responseType as "json",
    });
  }

  post<T>(url: string, body: any, options?: RequestOptions): Observable<T> {
    return this.http.post<T>(url, this.createBody(body), {
      headers: this.createHeaders(options, body),
      params: this.createParams(options),
      responseType: options?.responseType as "json",
    });
  }

  put<T>(url: string, body?: any, options?: RequestOptions): Observable<T> {
    return this.http.put<T>(url, this.createBody(body), {
      headers: this.createHeaders(options, body),
      params: this.createParams(options),
    });
  }

  patch<T>(url: string, body?: any, options?: RequestOptions): Observable<T> {
    return this.http.patch<T>(url, this.createBody(body), {
      headers: this.createHeaders(options, body),
      params: this.createParams(options),
    });
  }

  delete<T>(url: string, options?: RequestOptions): Observable<T> {
    return this.http.delete<T>(url, {
      headers: this.createHeaders(options),
      params: this.createParams(options),
    });
  }
}
