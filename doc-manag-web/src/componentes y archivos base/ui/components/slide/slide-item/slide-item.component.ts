import {
  ChangeDetectionStrategy,
  TemplateRef,
  Component,
  viewChild,
} from "@angular/core";

@Component({
  selector: "app-slide-item",
  templateUrl: "./slide-item.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class SlideItemComponent {
  public templateRef = viewChild<TemplateRef<any>>("templateRef");
}
