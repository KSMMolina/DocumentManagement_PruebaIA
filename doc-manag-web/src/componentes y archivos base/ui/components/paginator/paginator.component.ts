import { IGeneric } from "@core/architecture/interface/generic.interface";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  output,
} from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { TranslatePipe } from "@shared/pipes/translate.pipe";
import { IconComponent } from "../icon/icon.component";
import { ButtonComponent } from "../button/button.component";
import { transformBooleanInput } from "@shared/utils/transform-input";
import { NgClass } from "@angular/common";
import { ItemSkeletonComponent } from "../item-skeleton/item-skeleton.component";

@Component({
  selector: "app-paginator",
  imports: [
    ItemSkeletonComponent,
    ReactiveFormsModule,
    ButtonComponent,
    TranslatePipe,
    IconComponent,
    NgClass,
  ],
  templateUrl: "./paginator.component.html",
  styleUrl: "./paginator.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginatorComponent {
  public eventLoadMore = output();

  public queryParams = model.required<IGeneric.QueryParamsFilter>();

  public hideShowMore = input(false, { transform: transformBooleanInput });
  public totalItems = input.required<number>();
  public totalItemsConsulted = input<number>();
  public loading = input<boolean>();
  public classes = input<string>();
  public error = input<boolean>();

  public totalPages = computed(() =>
    Math.ceil(this.totalItems() / this.queryParams()?.PageSize)
  );

  loadMore() {
    if (
      this.loading() ||
      this.error() ||
      this.totalItemsConsulted() === this.totalItems()
    )
      return;

    this.queryParams.update((queryParams) => ({
      ...queryParams,
      PageNumber: queryParams.PageNumber + 1,
    }));

    this.eventLoadMore.emit();
  }
}
