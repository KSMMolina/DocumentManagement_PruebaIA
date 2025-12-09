import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  input,
  model,
  output,
  DestroyRef,
  inject,
  computed,
  contentChild,
  TemplateRef,
} from "@angular/core";

import { ItemSkeletonComponent } from "@shared/ui/components/item-skeleton/item-skeleton.component";
import { fadeInCustomAnimation } from "@shared/animations/animations.global";

import { transformBooleanInput } from "@shared/utils/transform-input";
import { IGeneric } from "@core/architecture/interface/generic.interface";
import { EmptyStateComponent } from "../empty-state/empty-state.component";
import { ErrorStateComponent } from "../error-state/error-state.component";
import { createArrayByNumber } from "@shared/services/local/helper.service";
import { IconComponent } from "../icon/icon.component";
import { NgClass, NgTemplateOutlet } from "@angular/common";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { debounceTime } from "rxjs";
import { MathPipe } from "@shared/pipes/math.pipe";
import { InputNumberComponent } from "@shared/ui/forms/input/input-number/input-number.component";
import { DisabledElementDirective } from "@shared/directives/disabled-element.directive";

export interface TableHeader {
  isAscending?: boolean;
  isSortable?: boolean;
  columnName?: string;
  width?: string;
  text: string;
}

@Component({
  selector: "app-table",
  templateUrl: "./table.component.html",
  imports: [
    DisabledElementDirective,
    ItemSkeletonComponent,
    InputNumberComponent,
    ErrorStateComponent,
    EmptyStateComponent,
    ReactiveFormsModule,
    NgTemplateOutlet,
    IconComponent,
    NgClass,
  ],
  animations: [fadeInCustomAnimation("fadeIn", { enter: "300ms" })],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  public createArrayByNumber = createArrayByNumber;

  /**
   * Template de las opciones
   * @type {contentChild<TemplateRef<any>>}
   */
  public templateRef = contentChild<TemplateRef<any>>(TemplateRef);

  public executeEndpoint = output();
  public searchChange = output();
  public orderChange = output();
  public pageChange = output();

  public classes = input<string>();

  public header = model.required<TableHeader[]>();
  public totalItems = input<number>();
  public loading = model<boolean>();
  public error = input<boolean>();
  public items = model<any[]>();

  /** Control del input de busqueda */
  public searchControl = input<FormControl>();

  public queryParams = model<IGeneric.QueryParamsFilter>();

  public withPagination = input(false, {
    transform: transformBooleanInput,
  });

  public totalPages = computed(() =>
    Math.ceil(this.totalItems() / this.queryParams()?.PageSize)
  );

  public pageControl = new FormControl();

  ngOnInit() {
    if (!!this.searchControl()) {
      this.searchControl()
        .valueChanges.pipe(
          debounceTime(300),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe(() => {
          this.queryParams.update((queryParams) => ({
            ...queryParams,
            PageNumber: 1,
          }));
          this.executeEndpoint.emit();
          this.searchChange.emit();
        });
    }

    if (!!this.withPagination()) {
      this.pageControl.valueChanges
        .pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef))
        .subscribe((value) => {
          let page = value;

          if (value > this.totalPages()) {
            this.pageControl.setValue(this.totalPages());
            page = this.totalPages();
          }

          if (page === this.queryParams()?.PageNumber) return;

          this.queryParams.update((queryParams) => ({
            ...queryParams,
            PageNumber: page,
          }));
          this.executeEndpoint.emit();
          this.pageChange.emit();
        });
    }
  }

  changeOrderBy(header: TableHeader) {
    this.header.update((prev) => {
      return prev.map((item) => {
        if (item.columnName === header.columnName)
          return {
            ...item,
            isAscending: !item.isAscending,
          };

        return { ...item, isAscending: false };
      });
    });

    this.queryParams.update((queryParams) => ({
      ...queryParams,
      OrderBy: header.columnName,
      IsAscending: header.isAscending,
    }));

    this.executeEndpoint.emit();
    this.orderChange.emit();
  }

  changePage(action: string) {
    let pageNumber = this.queryParams()?.PageNumber;

    switch (action) {
      case "first":
        pageNumber = 1;
        break;
      case "previous":
        pageNumber -= 1;
        break;
      case "next":
        pageNumber += 1;
        break;
      case "last":
        pageNumber = this.totalPages();
        break;
    }

    this.queryParams.update((queryParams) => ({
      ...queryParams,
      PageNumber: pageNumber,
    }));

    this.executeEndpoint.emit();
    this.pageChange.emit();
  }
}
