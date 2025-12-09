import { DomoNowRoute } from "@shared/globals/routes";
import { DisabledElementDirective } from "@shared/directives/disabled-element.directive";
import {
  ChangeDetectionStrategy,
  ContentChildren,
  Component,
  QueryList,
  model,
  HostBinding,
  input,
  output,
  OnInit,
  signal,
  computed,
  inject,
} from "@angular/core";
import { NavigationTabItemComponent } from "./navigation-tab-item/navigation-tab-item.component";
import { NgClass, NgStyle, NgTemplateOutlet } from "@angular/common";
import { transformBooleanInput } from "@shared/utils/transform-input";
import { TranslatePipe } from "@shared/pipes/translate.pipe";
import { Router } from "@angular/router";

export interface NavigationTab {
  disabledElement?: boolean;
  action?: () => void;
  redirect?: any;
  label: string;
  id?: string;
}

export type NavigationTabType = "segmented" | "topv1" | "topv2";
@Component({
  selector: "app-navigation-tab",
  templateUrl: "./navigation-tab.component.html",
  styleUrl: "./navigation-tab.component.scss",
  imports: [
    DisabledElementDirective,
    NgTemplateOutlet,
    TranslatePipe,
    NgStyle,
    NgClass,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationTabComponent implements OnInit {
  @HostBinding("style.min-height") minHeight = "0";

  private router = inject(Router);

  /**
   * Lista de items enviada como proyección
   */
  @ContentChildren(NavigationTabItemComponent, {
    descendants: true,
    read: NavigationTabItemComponent,
  })
  readonly navigationTabItems!: QueryList<NavigationTabItemComponent>;

  public selectionChange = output<number>();

  /**
   * Lista de items enviada como input
   */
  public navigationTabs = input<NavigationTab[]>();

  /**
   * Indica el slide seleccionado
   */
  public selectedIndex = model(0);

  /**
   * Indica el tipo de navigation tab
   */
  public type = input<NavigationTabType>("segmented");

  /**
   * Indica si se debe eliminar el padding del header
   * @default false
   */
  public removePadding = input(false, { transform: transformBooleanInput });

  /**
   * Indica la posición de las tabs
   * @default center
   */
  public position = input<"start" | "center" | "end">("center");

  /** Indica si se ha realizado la inicialización */
  public init = signal(true);

  public positionClass = computed(
    () =>
      `justify-content-${
        this.position() === "center" ? "center" : `flex-${this.position()}`
      }`
  );

  ngOnInit() {
    setTimeout(() => this.init.set(false), 1000);

    if (!!this.navigationTabs()?.length) {
      const lastPath = window.location.href.split("/").at(-1);
      const indexFound = this.navigationTabs().findIndex(
        (nt) =>
          !!nt?.redirect &&
          lastPath.includes(nt?.redirect?.currentPathNoSlash())
      );

      if (indexFound !== -1) this.selectedIndex.set(indexFound);
    }
  }

  getTransformByIndex(index: number): string {
    return `translate3d(${(index - this.selectedIndex()) * 100 + "%"},0,0)`;
  }

  selectTab(index: number) {
    this.selectedIndex.set(index);
    this.selectionChange.emit(index);

    !!this.navigationTabs()?.[index]?.action &&
      this.navigationTabs()?.[index]?.action();

    !!this.navigationTabs()?.[index]?.redirect &&
      this.navigationTabs()?.[index]?.redirect?.goTo(this.router);
  }
}
