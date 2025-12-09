import { NgClass, NgTemplateOutlet } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { InputTextComponent } from "@shared/ui/forms/input/input-text/input-text.component";
import { CheckboxComponent } from "@shared/ui/forms/checkbox/checkbox.component";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { IconComponent } from "../icon/icon.component";
import { transformBooleanInput } from "@shared/utils/transform-input";
import { debounceTime, Subscription } from "rxjs";
import { safeEffect } from "@shared/signals/signal";
import { TranslatePipe } from "@shared/pipes/translate.pipe";

@Component({
  selector: "app-filters-bar",
  templateUrl: "./filters-bar.component.html",
  styleUrl: "./filters-bar.component.scss",
  imports: [
    ReactiveFormsModule,
    InputTextComponent,
    CheckboxComponent,
    NgTemplateOutlet,
    TranslatePipe,
    IconComponent,
    NgClass,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiltersBarComponent {
  public eventClick = output();

  public searchChange = output<string>(); // Output para emitir el término de búsqueda

  public selectAllChange = output<boolean>(); // Output para emitir seleccionar todos

  public type = input<"mini" | "default">("default");

  /** Clases adicionales */
  public classes = input<string>();

  /** Control del input de busqueda */
  public searchControl = input(new FormControl<string>(""));

  /** Placeholder del input de busqueda */
  public placeholder = input<string>("SEARCH");

  /** Control del checkbox de seleccionar todo */
  public selectAllControl = input(new FormControl<boolean>(false));

  /** Indica si se debe mostrar el checkbox de seleccionar todo */
  public showSelectAll = input(false, { transform: transformBooleanInput });

  /** Indica si se debe mostrar el filtro de orden */
  public showFilterOrder = input(false, { transform: transformBooleanInput });

  /** Indica si se debe mostrar el filtro de opciones */
  public showFilterOptions = input(false, { transform: transformBooleanInput });

  private subscriptionSearch: Subscription;

  constructor() {
    safeEffect(() => this.initSearchSubscription(), [this.searchControl]);
  }

  private initSearchSubscription() {
    this.subscriptionSearch?.unsubscribe();

    this.subscriptionSearch = this.searchControl()
      .valueChanges.pipe(debounceTime(300))
      .subscribe((value) => this.searchChange.emit(value));
  }

  ngOnDestroy(): void {
    this.subscriptionSearch?.unsubscribe();
  }
}
