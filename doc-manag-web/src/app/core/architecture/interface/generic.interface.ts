export namespace IGeneric {
  /**
   * Respuesta base de la API sin paginación.
   */
  export interface Response<T = null> {
    messageErrors?: { [key: string]: string };
    isSuccess: boolean;
    errors?: string[];
    success: boolean;
    message: string;
    data: T;
  }

  /**
   * Información de paginación junto con los datos.
   */
  export interface Paginate<T = null> {
    previousPageNumber: boolean;
    hasPreviousPage: boolean;
    nextPageNumber: number;
    hasNextPage: boolean;
    currentPage: number;
    totalCount: number;
    totalPages: number;
    pageSize: number;
    items: T;
    data: T;
  }

  /**
   * Respuesta paginada estandarizada de la API.
   */
  export interface ResponsePaginate<T = any> extends Response<Paginate<T>> {}

  export interface QueryParamsFilter {
    IsAscending?: boolean;
    [param: string]: any;
    PageNumber?: number;
    StartDate?: string;
    CreatedAt?: string;
    PageSize?: number;
    EndDate?: string;
    Search?: string;
  }

  export interface QueryParams {
    [param: string]: string | number;
  }

  export interface Files {
    is?: "toUpload" | "uploaded";
    displayHeight?: number;
    displayWidth?: number;
    aspectRatio?: number;
    name: string;
    type: string;
    url: string;
    id: string;
  }
}
