import { inject, Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { UserLocalService } from "@user.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private userLocalService = inject(UserLocalService);

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) this.userLocalService.logout();

        return throwError(() => new Error(error.message));
      })
    );
  }
}
