import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { computed, inject, Injectable, signal } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class LayoutService {
  /** Titulo de la navbar */
  public navbarTitle = signal("");
  /** Indica si se encuentra en el dashboard */
  public isInDashboard = signal(true);

  /** Indica si se encuentra en un dispositivo movil */
  public isMobile = signal(false);

  /** Indica que la página está recargando */
  public pageIsRefreshing = signal(false);

  /** Estado para ocultar el sidebar bottom */
  public hideSidebarBottom = signal(false);

  /** Width de la ventana */
  public windowWidth = signal(window.innerWidth);

  // Acciones para redireccionar desde el navbar

  /** Página a direccionar cuando se da en volver en el navbar  */
  public pageToGoBack = signal("");
  /** Observable para ejecutar redirección */
  public redirectionAction$ = new Subject<void>();
  /** Indica si se debe redirigir manualmente */
  public manualRedirection = signal(false);

  public readonly GENERAL_HEIGHT = computed(
    () =>
      `calc(100dvh - ${
        !this.isMobile() ? "3.75rem" : this.hideSidebarBottom() ? "3.125rem" : "7.22rem"
      })`
  );

  private breakpointObserver: BreakpointObserver = inject(BreakpointObserver);

  public validateIsMobile(): void {
    this.breakpointObserver
      .observe([
        Breakpoints.Handset,
        Breakpoints.TabletPortrait,
        Breakpoints.Small,
      ])
      .subscribe((result) => {
        this.isMobile.set(result.matches);
        const body = document.querySelector("body");
        if (!body) return;
        result.matches
          ? body.classList.add("mobile")
          : body.classList.remove("mobile");
      });
  }

  public destroyRedirectionAction(): void {
    this.redirectionAction$.complete();
  }
}
