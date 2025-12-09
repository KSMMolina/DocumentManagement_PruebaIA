import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  model,
  output,
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
import { ButtonComponent } from "@shared/ui/components/button/button.component";
import { TagComponent } from "@shared/ui/components/tag/tag.component";
import { EmptyStateComponent } from "@shared/ui/components/empty-state/empty-state.component";
import { SelectComponent } from "../select.component";
import { ErrorStateComponent } from "@shared/ui/components/error-state/error-state.component";
import { transformBooleanInput } from "@shared/utils/transform-input";
import { TranslatePipe } from "@shared/pipes/translate.pipe";

@Component({
  selector: "app-select-multiple",
  templateUrl: "./select-multiple.component.html",
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
    ButtonComponent,
    TranslatePipe,
    IconComponent,
    TagComponent,
    NgClass,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectMultipleComponent),
      multi: true,
    },
  ],
})
export class SelectMultipleComponent extends SelectComponent {
  public eventAddSelectedOptions = output();

  public loadingSelectingOptions = input(false);
  public selectedOptionsSuccess = model(false);

  public showAddSelectedOptions = input(false, {
    transform: transformBooleanInput,
  });

  public selectedOptions = signal<any[]>([]);

  private isFirstTime = true;

  public selectedOptionsIds = computed(() =>
    this.selectedOptions()?.map((option) => this.getOptionId(option)) || []
  );

  constructor() {
    super();

    safeEffect(() => this.initializeFilteredOptions(), [this.options]);
    safeEffect(
      (selectedOptionsSuccess) => {
        if (selectedOptionsSuccess) {
          this.selectedOptions.set([]);
          this.selectedOptionsSuccess.set(false);
        }
      },
      [this.selectedOptionsSuccess]
    );
  }

  /**
   * Inicializa las opciones filtradas
   */
  private initializeFilteredOptions() {
    if (this.isFirstTime && !this.options().length) return;
    this.isFirstTime = false;

    const newOptions = this.filteredOptions().filter((option) => option.new);

    this.optionsWithSelected = this.options().map((option) => ({
      ...option,
      selected: new FormControl(
        this.selectedOptionsIds().includes(this.getOptionId(option))
      ),
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
      const subscription = option.selected.valueChanges.subscribe(() =>
        this.selectOption(option)
      );
      this.selectedControlSubscriptions.push(() => subscription.unsubscribe());
    });
  }

  override writeValue(options: any[]): void {
    this.selectedOptions.set(options || []);
    this.checkSelection();
  }

  /**
   * Verifica la selección del select
   */
  private checkSelection(): void {
    /** Si no hay valor seleccionado o no hay opciones, se finaliza el evento */
    if (!this.selectedOptions()?.length || !this.filteredOptions().length)
      return;

    const optionsId = this.selectedOptions()?.map((option) =>
      this.getOptionId(option)
    );

    this.filteredOptions().forEach((option) =>
      option.selected.setValue(optionsId?.includes(this.getOptionId(option)), {
        emitEvent: false,
      })
    );

    this.selectedOptions.set(
      this.filteredOptions().filter((option) => option.selected.value)
    );
  }

  public executeAddOption() {
    this.addOption();
    this.selectOption(this.filteredOptions()[0]);
  }

  /**
   * Selecciona una opción
   */
  public selectOption(option: any): void {
    if (option.selected.value === true) {
      this.selectedOptions.update((options) => [...options, option]);
    } else {
      this.selectedOptions.update((options) =>
        options.filter(
          (opt) => this.getOptionId(opt) !== this.getOptionId(option)
        )
      );
    }

    this.returnSelectedOptions();
  }

  /**
   * Retorna las opciones seleccionadas
   */
  private returnSelectedOptions(): void {
    const valueToReturn = this.returnId()
      ? this.selectedOptionsIds()
      : this.selectedOptions();

    /** Se actualiza el valor del select */
    this.onChange(valueToReturn);
    this.selectionChange.emit(this.selectedOptions());
    this.onTouched();
  }
}
