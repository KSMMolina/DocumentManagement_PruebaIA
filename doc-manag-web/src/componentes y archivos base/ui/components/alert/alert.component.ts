import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from "@angular/core";
import { IconComponent } from "../icon/icon.component";
import { ButtonComponent } from "../button/button.component";
import { ImageComponent } from "../image/image.component";
import { transformBooleanInput } from "@shared/utils/transform-input";
import { NgClass } from "@angular/common";

export type AlertStatus =
  | "success"
  | "warning"
  | "error"
  | "info"
  | "alert"
  | "panic";

@Component({
  selector: "app-alert",
  imports: [IconComponent, ButtonComponent, ImageComponent, NgClass],
  templateUrl: "./alert.component.html",
  styleUrl: "./alert.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertComponent {
  /**
   * Evento que se dispara al hacer click en el botón.
   */
  public eventAlert = output<string>();

  /**
   * Clases adicionales.
   */
  public classes = input<string>();

  /**
   * Estado del alert.
   */
  public status = input<AlertStatus>("alert");

  public inModal = input(false, {
    transform: transformBooleanInput,
  });

  /**
   * Indica si se debe ocultar el botón circle de cerrar.
   */
  public hideCloseButton = input(false, {
    transform: transformBooleanInput,
  });

  /**
   * Indica si se debe deshabilitar el botón circle de cerrar.
   */
  public disableCloseButton = input(false, {
    transform: transformBooleanInput,
  });

  /**
   * Indica si se debe mostrar la imagen.
   */
  public hideImage = input(false, {
    transform: transformBooleanInput,
  });

  /**
   * Indica la imagen que se va a mostrar
   */
  public image = input<string>();

  /**
   * Indica si se debe ocultar el botón primary.
   */
  public hidePrimaryButton = input(false, {
    transform: transformBooleanInput,
  });

  /**
   * Indica si se debe deshabilitar el botón primary.
   */
  public disablePrimaryButton = input(false, {
    transform: transformBooleanInput,
  });

  /**
   * Indica si se debe mostrar el botón primary.
   */
  public loadingPrimaryButton = input(false, {
    transform: transformBooleanInput,
  });

  /**
   * Indica si se debe ocultar el botón secondary.
   */
  public hideSecondaryButton = input(false, {
    transform: transformBooleanInput,
  });

  /**
   * Indica si se debe deshabilitar el botón secondary.
   */
  public disableSecondaryButton = input(false, {
    transform: transformBooleanInput,
  });

  /**
   * Indica si se debe mostrar el botón secondary.
   */
  public loadingSecondaryButton = input(false, {
    transform: transformBooleanInput,
  });

  /**
   * Indica si se debe ocultar el botón tertiary.
   */
  public hideTertiaryButton = input(false, {
    transform: transformBooleanInput,
  });

  /**
   * Indica si se debe deshabilitar el botón tertiary.
   */
  public disableTertiaryButton = input(false, {
    transform: transformBooleanInput,
  });

  /**
   * Indica si se debe mostrar el botón tertiary.
   */
  public loadingTertiaryButton = input(false, {
    transform: transformBooleanInput,
  });

  /**
   * Indica si se ocultar el alert.
   */
  public hideAlert = input(false, {
    transform: transformBooleanInput,
  });

  /**
   * Indica si se debe mostrar el título.
   */
  public statusFormatted = computed(() =>
    this.status() === "panic"
      ? "error"
      : this.status() === "alert"
      ? "secondary"
      : this.status()
  );

  /**
   * Clase del alert.
   */
  public statusClass = computed(() =>
    this.status()
      ? `alert-${this.status() === "panic" ? "error" : this.status()}`
      : ""
  );

  /**
   * Imagen del alert.
   */
  public imageAlert = computed(() =>
    this.status() ? `ALERTS.${this.status().toUpperCase()}` : ""
  );
}
