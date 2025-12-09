import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { regex } from "./regex";

/**
 * Validador personalizado para verificar si las contraseñas coinciden
 * @param password - Nombre del control de la contraseña
 * @param confirmPassword - Nombre del control de la confirmación de contraseña
 * @returns {ValidatorFn} - Retorna el validador personalizado
 */
export const passwordMatchValidator =
  (password: string, confirmPassword: string): ValidatorFn =>
  (formGroup: AbstractControl): ValidationErrors | null => {
    const passwordControl = formGroup.get(password);
    const confirmPasswordControl = formGroup.get(confirmPassword);
    const error = { passwordNotMatch: "PASSWORDS_NOT_MATCH" };

    if (!passwordControl || !confirmPasswordControl) return null; // Salir si los controles no existen

    // Validar que las contraseñas coincidan
    if (passwordControl.value !== confirmPasswordControl.value) {
      confirmPasswordControl?.setErrors(error);
      return error;
    } else {
      confirmPasswordControl?.setErrors(null);
      return null;
    }
  };

export const passwordRegexValidator = (
  control: AbstractControl
): ValidationErrors | null => {
  const value = control.value as string;
  if (!value) return null;

  return regex.password.test(value)
    ? null
    : {
        patternPassword: "PASSWORD_VALIDATION",
      };
};

export const emailRegexValidator = (
  control: AbstractControl
): ValidationErrors | null => {
  const value = control.value as string;
  if (!value) return null;

  return regex.email.test(value)
    ? null
    : {
        patternEmail: "EMAIL_INVALID_FORMAT",
      };
};

/**
 * Validador personalizado para verificar si el valor es un objeto
 * @param control - Control a validar
 * @returns {ValidationErrors | null} - Retorna el validador personalizado
 */
export const isObjectValidator = (
  control: AbstractControl
): ValidationErrors | null => {
  const value = control.value;

  // Verificar si el valor es de tipo objeto y no es null
  if (typeof value === "object" && value !== null) {
    return null; // El valor es un objeto, pasa la validación
  }

  return { notObject: true }; // Si no es un objeto, retorna un error
};
