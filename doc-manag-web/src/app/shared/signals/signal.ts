import { HttpParams } from "@angular/common/http";
import { effect, signal, Signal, untracked } from "@angular/core";

/**
 * Crea un efecto reactivo que observa únicamente los signals especificados.
 *
 * Esta función permite ejecutar una lógica cuando cambian ciertos signals, evitando
 * que Angular rastree automáticamente otros signals usados dentro del callback.
 * Esto es útil para evitar ejecuciones colaterales y tener control total sobre las dependencias.
 *
 * @param fn - Función a ejecutar cuando alguno de los signals especificados cambia.
 *             Recibe como argumentos los valores actuales de cada signal.
 * @param signals - Array de signals a observar como dependencias reactivas.
 * @param isUntracked - Indica si se debe envolver el callback en `untracked()`
 *                      para evitar que Angular registre señales no especificadas como dependencias.
 *                      Por defecto es `true`.
 * @author Jesus David Muñoz Gallego
 */
export function safeEffect<T extends readonly Signal<unknown>[]>(
  fn: (
    ...values: { [K in keyof T]: T[K] extends Signal<infer V> ? V : never }
  ) => void,
  signals: T,
  isUntracked = true
) {
  effect(() => {
    const values = signals.map(s => s()) as unknown as {
      [K in keyof T]: T[K] extends Signal<infer V> ? V : never
    };
    if (isUntracked) untracked(() => fn(...values));
    else fn(...values);
  });
}