/**
 * Transforma un string a booleano
 * @param value - Valor a transformar
 * @returns {boolean} - Retorna el valor transformado a booleano
 */
export const transformBooleanInput = (value: string | boolean): boolean =>
  !!(value === "" || value === true || value === "true");

/**
 * Transforma un string a mayúsculas
 * @param value - Valor a transformar
 * @returns {string} - Retorna el valor transformado a mayúsculas
 */
export const transformUpperCaseInput = (value: string): string =>
  value && value.toUpperCase();

/**
 * Transforma un string a número
 * @param value - Valor a transformar
 * @returns {number} - Retorna el valor transformado a número
 */
export const transformNumberInput = (value: string): number => +value;

/**
 * Transforma un número a string
 * @param value - Valor a transformar
 * @returns {string} - Retorna el valor transformado a string
 */
export const transformStringInput = (value: number): string => `${value}`;
