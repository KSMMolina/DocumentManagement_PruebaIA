import {
  AfterViewInit,
  Component,
  contentChild,
  ElementRef,
  inject,
  Injector,
  input,
  model,
  OnInit,
  output,
  TemplateRef,
  viewChild,
  signal,
  computed,
  DestroyRef,
  ChangeDetectorRef,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ControlValueAccessor, FormControl, NgControl } from "@angular/forms";
import { LayoutService } from "@layout.service";
import { IGeneric } from "@shared/Core/architecture/interface/generic.interface";
import { ActionOverlay } from "@shared/directives/overlay.directive";
import {
  createArrayByNumber,
  isAllowedLoadMore,
} from "@shared/services/local/helper.service";
import { transformBooleanInput } from "@shared/utils/transform-input";
import { debounceTime } from "rxjs";

type SelecttStatus = "error" | "warning" | "info" | "success" | "";

type SelecttSize = "lg" | "md" | "sm";

@Component({
  template: "",
})
export abstract class SelectComponent
  implements ControlValueAccessor, OnInit, AfterViewInit
{
  public layoutService = inject(LayoutService);
  protected destroyRef = inject(DestroyRef);
  protected cdr = inject(ChangeDetectorRef);
  protected injector = inject(Injector);

  public createArrayByNumber = createArrayByNumber;

  /**
   * Template de las opciones
   * @type {contentChild<TemplateRef<any>>}
   */
  public templateRef = contentChild<TemplateRef<any>>(TemplateRef);

  /**
   * Panel de opciones
   * @type {viewChild<ElementRef<HTMLElement>>}
   */
  public optionsPanel = viewChild<ElementRef<HTMLElement>>("optionsPanel");

  /**
   * Evento cambio de selección
   * @type {output<any>}
   */
  public selectionChange = output<any>();

  /**
   * Evento para cargar más
   * @type {output<IGeneric.QueryParamsFilter>}
   */
  public eventLoadMore = output<IGeneric.QueryParamsFilter>();

  /**
   * Opciones del select
   * @type {input<any[]>}
   */
  public options = model.required<any[]>();

  public optionsWithSelected: any[] = [];

  /**
   * ID de la opción
   */
  public optionId = input<string>();

  /**
   * Texto de la opción
   */
  public optionText = input<string>();

  /**
   * Indica si muestra el mensaje de error por defecto
   */
  public defaultLabelError = input(false, {
    transform: transformBooleanInput,
  });

  /**
   * Placeholder del input
   */
  public placeholder = input<string>("");

  /**
   * ID del input
   */
  public id = input.required<string>();

  /**
   * Tamaño del select
   */
  public size = input<SelecttSize>("lg");

  /**
   * Indica si el campo es obligatorio
   */
  public required = input(false, {
    transform: transformBooleanInput,
  });

  /**
   * Estado del select
   */
  public status = input<SelecttStatus>("");

  /**
   * Indica si el campo es deshabilitado
   */
  public disabledElement = input(false, {
    transform: transformBooleanInput,
  });

  /**
   * Indica si el campo es solo lectura
   */
  public readonly = input(false, {
    transform: transformBooleanInput,
  });

  /**
   * Indica si el select se encuentra en un combo
   */
  public inCombo = input(false, {
    transform: transformBooleanInput,
  });

  /**
   * Indica si muestra el buscador
   */
  public showSearch = input(false, {
    transform: transformBooleanInput,
  });

  /**
   * Indica si la lista esta cargando
   */
  public isLoading = model(false);

  /**
   * Indica si hubo un  error consultando la lista
   */
  public withErrorInList = input(false);

  /**
   * Indica si retorna el o los ids de la opciones seleccionadas
   */
  public returnId = input(false, {
    transform: transformBooleanInput,
  });

  /**
   * Indica si el overlay del select se encuentra en pantalla completa
   */
  public overlayFullScreen = input(true);

  /**
   * Indica el ancho del overlay
   */
  public overlayWidth = input("");

  /**
   * Indica si se puede agregar otra opción a la lista
   */
  public canAddOption = input(false, {
    transform: transformBooleanInput,
  });

  /**
   * Indica el total de opciones
   */
  public total = input(0);

  /**
   * Indica si la acción que hace el overlay
   */
  public actionOverlay = model<ActionOverlay>("close");

  /**
   * Se usa para buscar desde el select con los campos indicados, si tiene al menos 1 valor no ejecutara el evento search para buscar en el back
   */
  public propertiesToSearch = input<string[]>([]);

  public searchControl = new FormControl("");

  public filteredOptions = signal<any[]>([]);

  public isOverlayOpened = signal(false);

  protected queryParamsFilter: IGeneric.QueryParamsFilter = {
    PageNumber: 1,
    PageSize: 25,
  };

  protected onChange: Function = (value: any) => {};
  public onTouched: Function = () => {};

  public ngControl!: NgControl;

  public iconStatus = computed(() => {
    switch (this.status()) {
      case "error":
        return "ERROR_OUTLINE_OUTLINED";
      case "warning":
        return "WARNING_AMBER_OUTLINED";
      case "info":
        return "INFO_OUTLINED";
      case "success":
        return "TASK_ALT_OUTLINED";
      default:
        return null;
    }
  });

  protected selectedControlSubscriptions: Array<() => void> = [];

  public get invalid() {
    return this.ngControl?.invalid;
  }

  public get touched() {
    return this.ngControl?.touched;
  }

  public get valid() {
    return this.ngControl?.valid;
  }

  ngOnInit(): void {
    this.initializeNgControl();

    if (this.showSearch()) {
      this.searchControl.valueChanges
        .pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef))
        .subscribe((value) => {
          if (!!this.propertiesToSearch()?.length) {
            this.filteredOptions.set(
              value
                ? this.optionsWithSelected
                    .filter((option) =>
                      this.propertiesToSearch().some((property) =>
                        option?.[property]
                          ?.toLowerCase()
                          .includes(value.toLowerCase())
                      )
                    )
                    .map((option) => option)
                : this.optionsWithSelected
            );
          } else {
            this.isLoading.set(true);
            this.queryParamsFilter.PageNumber = 1;
            this.queryParamsFilter.Search = value;
            this.options.set([]);
            this.eventLoadMore.emit(this.queryParamsFilter);
          }
        });
    }
  }

  protected initializeNgControl() {
    try {
      this.ngControl = this.injector.get(NgControl);
    } catch (error) {
      console.warn("form control no implemented");
    }
  }

  ngAfterViewInit(): void {
    if (this.ngControl?.statusChanges)
      this.ngControl.statusChanges
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.cdr.markForCheck());
  }

  protected loadMore(event: Event): void {
    if (
      this.isLoading() ||
      this.total() === this.options().length ||
      !isAllowedLoadMore(event, 100) ||
      !!this.propertiesToSearch().length
    )
      return;

    this.queryParamsFilter.PageNumber++;
    this.eventLoadMore.emit(this.queryParamsFilter);
  }

  /**
   * Destruye las suscripciones de los cambios de las opciones seleccionadas
   */
  protected destroySubscribeToSelectionChanges() {
    this.selectedControlSubscriptions.forEach((unsubscribe) => unsubscribe());
    this.selectedControlSubscriptions = [];
  }

  writeValue(value: any): void {}

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  protected addOption() {
    const option = {
      [this.optionId()]: this.filteredOptions().length + 1,
      [this.optionText()]: this.searchControl.value,
      selected: new FormControl(true),
      new: true,
    };

    this.filteredOptions.update((options) => [option, ...options]);
    this.optionsWithSelected.unshift(option);

    this.searchControl.reset();
  }

  /**
   * Obtiene el ID de la opción
   */
  protected getOptionId(option: any): any {
    const value = option?.[this.optionId()];
    return value !== undefined ? value : option;
  }

  /**
   * Obtiene el texto de la opción
   */
  protected getOptionText(option: any): string {
    const value = option?.[this.optionText()];
    return value !== undefined ? value : option;
  }
}
