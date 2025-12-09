import { NgClass, NgStyle } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";

@Component({
  selector: "app-item-skeleton",
  templateUrl: "./item-skeleton.component.html",
  imports: [NgClass, NgStyle],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemSkeletonComponent {
  /** Altura del elemento, valor en px o %
   * @default 16
   */
  public height = input<string>("16");
  
  /** Ancho del elemento, valor en px o %
   * @default 100%
   */
  public width = input<string>("100%");

  /** Margen del elemento, valor en px
   * @default 0
   */
  public margin = input<{ bottom?: string; top?: string }>();

  /** Clases adicionales
   * @default ''
   */
  public classes = input<string>("");

  public styles = computed(() => ({
    height: this.classes() && this.classes().includes("height")
      ? null
      : this.formatValue(this.height()),
    width: this.classes() && this.classes().includes("width")
      ? null
      : this.formatValue(this.width()),
    "margin-bottom": this.formatValue(this.margin()?.bottom),
    "margin-top": this.formatValue(this.margin()?.top),
  }));

  private formatValue(value: string): string {
    if (!value) return "";
    return value.includes("%") ? value : `${+value / 16}rem`;
  }
}
