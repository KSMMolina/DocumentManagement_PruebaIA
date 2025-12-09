import { FormControl, FormGroup } from "@angular/forms";
import { HttpHeaders, HttpParams } from "@angular/common/http";
import { JwtPayload } from "jwt-decode";

/**
 * Valida si un token ha expirado
 * @param token - Token a validar
 * @returns {boolean} - Retorna true si el token ha expirado, false en caso contrario
 */
export function isTokenExpired(token: JwtPayload): boolean {
  try {
    const expirationDate = token.exp * 1000; // `exp` is in seconds, so convert to milliseconds
    const currentTime = new Date().getTime();

    return expirationDate < currentTime;
  } catch (error) {
    // En caso de error al decodificar el token (token malformado, etc.)
    console.error("Error decoding token:", error);
    return true; // Consideramos el token inválido si no puede ser decodificado
  }
}

/**
 * Crea un header de autorización
 * @param params - Parámetros adicionales
 * @returns {Object} - Retorna el header de autorización
 */
export const headerAuthorization = (params?: HttpParams) => ({
  headers: new HttpHeaders({
    Authorization: "Bearer " + localStorage.getItem("access_token"),
  }),
  params,
});

/**
 * Valida un campo de un formulario
 * @param form - Formulario a validar
 * @param field - Campo a validar
 * @param type - Tipo de validación ("valid" o "invalid")
 * @returns {boolean} - Retorna true si el campo es válido, false en caso contrario
 */
export const validateFormField = (
  form: FormGroup,
  field: string,
  type: "valid" | "invalid" = "invalid"
): boolean => !!(form.get(field)?.[type] && form.get(field)?.touched);

/**
 * Crea un array de números
 * @param length - Longitud del array
 * @returns {number[]} - Retorna el array de números
 */
export const createArrayByNumber = (length: number): number[] =>
  Array.from({ length }, (_, i) => i);

/**
 * Valida si el texto excede el límite de caracteres
 * @param event - Evento del elemento
 * @returns {boolean} - Retorna true si el texto excede el límite de caracteres, false en caso contrario
 */
export const validateLimitText = (event: HTMLElement): boolean =>
  event?.scrollWidth > event?.clientWidth;

/**
 * Filtra un array de objetos por un valor de búsqueda
 * @param list - Array de objetos a filtrar
 * @param value - Valor de búsqueda
 * @param fields - Campos por los cuales se realizará la búsqueda
 * @returns {Array<T>} - Retorna el array filtrado
 */
export const arrayFilter = <T>(
  list: Array<T>,
  value: string,
  fields: string[]
): Array<T> => {
  if (!value) return list;

  const lowerCaseValue = value.trim().toLowerCase();

  return list.filter((item: any) =>
    fields.some((field) =>
      item[field]?.toString().toLowerCase().includes(lowerCaseValue)
    )
  );
};

/**
 * Convierte un archivo a base64
 * @param file - Archivo a convertir
 * @returns {Promise<string | ArrayBuffer | null>} - Retorna la promesa con el archivo convertido a base64
 */
export const fileToBase64 = (
  file: File
): Promise<string | ArrayBuffer | null> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

/**
 * Scrolla el elemento con el id proporcionado
 * @param elementId - Id del elemento a scrollar
 * @param animation - Indica si se debe usar animación
 */
export const scrollToElement = (elementId: string, animation = true) => {
  const element = document.getElementById(elementId) as HTMLDivElement;
  if (element)
    element.scrollIntoView({
      behavior: animation ? "smooth" : "instant",
      block: "start",
    });
};

/**
 * Suma días o meses a una fecha
 * @param from - Fecha inicial
 * @param amount - Cantidad de días o meses a sumar
 * @param type - Tipo de suma ("D" para días, "M" para meses)
 * @returns {Date} - Retorna la fecha resultante
 */
export const addDaysOrMonths = (
  from: string,
  amount: number,
  type: "D" | "M"
) => {
  const newDate = new Date(from);

  if (type === "D") {
    newDate.setDate(newDate.getDate() + amount);
  } else {
    newDate.setMonth(newDate.getMonth() + amount);
  }

  return newDate;
};

/**
 * Calcula la diferencia entre dos fechas en días, horas, minutos o segundos.
 * @param from - Fecha inicial
 * @param until - Fecha final
 * @param unit - Unidad de tiempo: "days" | "hours" | "minutes" | "seconds"
 * @returns {number} - Diferencia absoluta en la unidad seleccionada
 */
export const calculateTimeBetweenDates = (
  from: Date,
  until: Date,
  unit: "days" | "hours" | "minutes" | "seconds" = "days"
): number => {
  const diffMs = until.getTime() - from.getTime();
  const diffAbs = Math.abs(diffMs);

  const units = {
    days: 1000 * 60 * 60 * 24,
    hours: 1000 * 60 * 60,
    minutes: 1000 * 60,
    seconds: 1000,
  };

  return Math.floor(diffAbs / units[unit]);
};

/**
 * Genera un identificador aleatorio
 * @param length - Longitud del identificador
 * @param useHex - Indica si se debe usar caracteres hexadecimales
 * @returns {string} - Retorna el identificador generado
 */
export const randomIdLength = (
  length: number,
  useHex: boolean = false
): string => {
  let identificador = "";
  const caracteres = useHex
    ? "0123456789ABCDEF"
    : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    identificador += caracteres.charAt(
      Math.floor(Math.random() * caracteres.length)
    );
  }
  return identificador;
};

/**
 * Obtiene la URL base de la aplicación
 * @returns {string} - Retorna la URL base de la aplicación
 */
export const getBaseUrl = (): string => {
  const protocol: string = window.location.protocol;
  const hostname: string = window.location.hostname;
  return `${protocol}//${hostname}`;
};

/**
 * Valida si el click proviene de un elemento omitido
 * @param event - Evento del click
 * @returns {boolean} - Retorna true si el click proviene de un elemento omitido, false en caso contrario
 */
export const isClickFromOmittedElement = (
  event: Event,
  attr = "omit-click"
): boolean => {
  const target = event.target as HTMLElement;
  // Busca el ancestro más cercano con el atributo omit-click
  return !!target.closest(`[${attr}]`);
};

/**
 * Obtiene el último path de la URL
 * @returns {string} - Retorna el último path de la URL
 */
export const getLastPath = (): string => {
  const path = window.location.pathname.split("/");
  path.pop();

  return path.join("/");
};

/**
 * Scrolla el elemento con la clase principal-page-content
 * @param value - Valor a scrollar
 */
export const scrollTo = (value: number, idContainer?: string) => {
  const element = document.querySelector(
    idContainer || ".principal-page-content"
  ) as HTMLDivElement;
  element.scrollTo({
    top: value,
    behavior: "smooth",
  });
};

export const callContact = (phone: string) => {
  window.location.href = `tel:${phone}`;
};

export const isAllowedLoadMore = (
  event: Event,
  distanceTo: number,
  direction: "bottom" | "top" = "bottom"
) => {
  const target = event.target as HTMLDivElement;

  if (direction === "top") {
    // Con column-reverse, el "top" visual está en el bottom del scroll
    return (
      target.scrollHeight - Math.abs(target.scrollTop) - target.clientHeight <=
      distanceTo
    );
  } else
    return (
      target.scrollHeight - distanceTo <= target.scrollTop + target.clientHeight
    );
};

export const hasChangesInForm = (initialValue: string, form: FormGroup) => {
  return initialValue !== JSON.stringify(form.getRawValue());
};

export const getErrorMessageForm = (
  form: FormGroup | FormControl,
  error: string,
  field?: string
): string => {
  let errorMessage = "";
  if (!field) errorMessage = form?.errors?.[error];
  else errorMessage = form?.get(field)?.errors?.[error];

  if (error === "required") errorMessage = "REQUIRED_FIELD";

  return errorMessage;
};

export const camelCaseText = (text: string): string => {
  if (!text) return text;

  return (
    text
      // Insertar espacio antes de mayúsculas
      .replace(/([A-Z])/g, " $1")
      // Insertar espacio antes de números
      .replace(/([0-9]+)/g, " $1")
      // Capitalizar primera letra de cada palabra
      .split(" ")
      .filter((word) => word.length > 0)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
  );
};

export const downloadFile = (
  blob: Blob,
  fileName: string,
  extension: string
) => {
  const url = window.URL.createObjectURL(blob);
  const download = document.createElement("a");
  download.href = url;
  download.download = `${fileName}.${extension}`;
  document.body.appendChild(download);
  download.click();
  document.body.removeChild(download);
  window.URL.revokeObjectURL(url);
};

export const parseCsv = (text: string, delimiter = ";"): string[][] => {
  return text
    .split(/\r?\n/) // dividir líneas
    .filter((line) => line.trim() !== "") // quitar líneas vacías
    .map(
      (line) => line.split(delimiter).map((c) => c.trim()) // limpiar espacios
    );
};

export const capitalizeText = (text: string) =>
  text.trimStart().replace(/^./, (c) => c.toUpperCase());
