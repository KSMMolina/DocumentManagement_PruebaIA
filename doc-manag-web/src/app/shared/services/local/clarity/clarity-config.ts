// libs/clarity/clarity-config.ts
import { InjectionToken } from "@angular/core";

export interface ClarityConfig {
  /** Tu Project ID de Clarity */
  projectId: string;
  /** Inicializar Clarity.init(): solo el host debe ponerlo a true */
  runInit?: boolean;
  /** Auto-track de vistas de página */
  autoTrackPages?: boolean;
  /** Auto-track de errores JS */
  autoTrackErrors?: boolean;
  /** Throttle (ms) mínimo entre envíos del mismo evento */
  throttleIntervalMs?: number;
}

export const CLARITY_CONFIG = new InjectionToken<ClarityConfig>(
  "CLARITY_CONFIG"
);
