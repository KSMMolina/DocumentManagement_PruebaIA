import { HttpErrorResponse } from "@angular/common/http";
import { FormControl, FormGroup } from "@angular/forms";

export enum HttpErrorCode {
  ALREADY_EXISTS = "ALREADY_EXISTS",
  NOT_FOUND = "NOT_FOUND",
  FORBIDDEN = "FORBIDDEN",
}

export const getHttpErrorMessage = (error: HttpErrorResponse): string => {
  if (!!error.error?.messageErrors) {
    const errorCodes = Object.values(HttpErrorCode);

    for (let index = 0; index < errorCodes.length; index++) {
      if (error.error?.messageErrors?.[errorCodes[index]])
        return error.error?.messageErrors?.[errorCodes[index]];
    }
  }

  return "SERVER_ERROR";
};

export const hasHttpError = (
  error: HttpErrorResponse,
  errorCode: HttpErrorCode
): boolean => {
  return !!error.error?.messageErrors?.[errorCode];
};

export const setHttpErrorResponseInForm = (
  form: FormGroup | FormControl,
  error: HttpErrorResponse
) => {
  if (!error.error?.messageErrors) return;

  Object.entries(error.error?.messageErrors).forEach(([key, value]) => {
    if(form instanceof FormGroup) form.get(key)?.setErrors({
      error: value,
    });
    else form.setErrors({
      error: value,
    });
  });
};
