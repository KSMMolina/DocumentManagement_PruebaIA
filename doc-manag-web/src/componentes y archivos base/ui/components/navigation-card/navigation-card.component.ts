import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";

type NavigationCardOrientation = "horizontal" | "vertical";

type NavigationCardSize = "xs" | "s" | "m" | "l";

@Component({
  selector: "app-navigation-card",
  templateUrl: "./navigation-card.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationCardComponent {
  public classes = input<string>("");

  /**
   * Define la orientación del navigation card
   * horizontal: se muestra horizontalmente
   * vertical: se muestra verticalmente
   */
  public orientation = input<NavigationCardOrientation>("horizontal");

  /** Size */
  public size = input<NavigationCardSize>("m");

  public navigationCardClasses = computed(() => {
    return `navigation-card ${this.classes()} navigation-card-${this.orientation()} navigation-card-${this.size()}`;
  });
}
