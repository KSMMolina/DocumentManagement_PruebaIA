import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  signal,
} from "@angular/core";
import {
  ReactiveFormsModule,
  FormControl,
  NG_VALUE_ACCESSOR,
} from "@angular/forms";

import {
  collapseAnimation,
  fadeInCustomAnimation,
} from "@shared/animations/animations.global";
import { OverlayDirective } from "@shared/directives/overlay.directive";
import { DisabledElementDirective } from "@shared/directives/disabled-element.directive";
import { safeEffect } from "@shared/signals/signal";
import { IconComponent } from "@shared/ui/components/icon/icon.component";
import { NgClass, NgTemplateOutlet } from "@angular/common";
import { InputTextComponent } from "../../input/input-text/input-text.component";
import { SelectOptionComponent } from "./../select-option/select-option.component";
import { ItemSkeletonComponent } from "@shared/ui/components/item-skeleton/item-skeleton.component";
import { EmptyStateComponent } from "@shared/ui/components/empty-state/empty-state.component";
import { SelectComponent } from "../select.component";
import { ErrorStateComponent } from "@shared/ui/components/error-state/error-state.component";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { TranslatePipe } from "@shared/pipes/translate.pipe";

@Component({
  selector: "app-select-single",
  templateUrl: "./select-single.component.html",
  styleUrls: ["../select.component.scss"],
  animations: [
    fadeInCustomAnimation("fadeInOut", { enter: "200ms", leave: "200ms" }),
    fadeInCustomAnimation("fadeIn", { enter: "200ms" }),
    collapseAnimation(),
  ],
  imports: [
    DisabledElementDirective,
    SelectOptionComponent,
    ItemSkeletonComponent,
    ReactiveFormsModule,
    EmptyStateComponent,
    ErrorStateComponent,
    InputTextComponent,
    NgTemplateOutlet,
    OverlayDirective,
    TranslatePipe,
    IconComponent,
    NgClass,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectSingleComponent),
      multi: true,
    },
  ],
})
export class SelectSingleComponent extends SelectComponent {
  public selectedOption = signal<any>(undefined);

  private isFirstTime = true;

  constructor() {
    super();

    safeEffect(() => this.initializeFilteredOptions(), [this.options]);
  }

  /**
   * Inicializa las opciones filtradas
   */
  private initializeFilteredOptions() {
    if (this.isFirstTime && !this.options().length) return;
    this.isFirstTime = false;

    const newOptions = this.filteredOptions().filter((option) => option.new);

    const selectedOptionId = this.getOptionId(this.selectedOption());

    this.optionsWithSelected = this.options().map((option) => ({
      ...option,
      selected: new FormControl(selectedOptionId === this.getOptionId(option)),
    }));

    this.filteredOptions.set(this.optionsWithSelected);

    if (!!newOptions.length)
      this.filteredOptions.update((options) => [...newOptions, ...options]);

    this.checkSelection();
    this.subscribeToSelectionChanges();
  }

  /**
   * Se suscribe a los cambios de las opciones seleccionadas
   */
  private subscribeToSelectionChanges() {
    this.destroySubscribeToSelectionChanges();

    this.optionsWithSelected.forEach((option) => {
      const subscription = option.selected.valueChanges
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.selectOption(option));

      this.selectedControlSubscriptions.push(() => subscription.unsubscribe());
    });
  }

  override writeValue(option: any): void {
    this.selectedOption.set(option);
    this.checkSelection();
  }

  /**
   * Verifica la selección del select
   */
  private checkSelection(): void {
    /** Si no hay valor seleccionado o no hay opciones, se finaliza el evento */
    if (
      !this.selectedOption() ||
      !this.filteredOptions().length ||
      !!this.selectedOption()?.[this.optionId()]
    )
      return;

    const selectedOption = this.filteredOptions().find(
      (opt) => this.getOptionId(opt) === this.getOptionId(this.selectedOption())
    );
    if (!!selectedOption) {
      selectedOption.selected.setValue(true);

      /** Se actualiza el valor del select */
      this.selectedOption.set(selectedOption);
    }
  }

  public executeAddOption() {
    this.addOption();
    this.selectOption(this.filteredOptions()[0]);
  }

  /**
   * Selecciona una opción
   */
  public selectOption(option: any): void {
    this.actionOverlay.set("close");

    this.optionsWithSelected
      .filter(
        (opt) =>
          opt.selected.value &&
          this.getOptionId(opt) !== this.getOptionId(option)
      )
      .forEach((opt) => opt.selected.setValue(false, { emitEvent: false }));

    this.selectedOption.set(option);
    this.returnSelectedOption();
  }

  /**
   * Retorna las opciones seleccionadas
   */
  private returnSelectedOption(): void {
    const valueToReturn = this.returnId()
      ? this.getOptionId(this.selectedOption())
      : this.selectedOption();

    /** Se actualiza el valor del select */
    this.onChange(valueToReturn);
    this.selectionChange.emit(this.selectedOption());
    this.onTouched();
  }
}
