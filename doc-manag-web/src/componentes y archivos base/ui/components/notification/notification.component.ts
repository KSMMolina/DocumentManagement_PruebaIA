import { animate, style, transition, trigger } from "@angular/animations";
import {
  Component,
  output,
  input,
  ChangeDetectionStrategy,
  computed,
} from "@angular/core";
import { IconComponent } from "../icon/icon.component";
import { isClickFromOmittedElement } from "@shared/services/local/helper.service";
import { OmitClickDirective } from "@shared/directives/omit-click.directive";
import { TranslatePipe } from "@shared/pipes/translate.pipe";

@Component({
  selector: "app-notification",
  templateUrl: "./notification.component.html",
  styleUrls: ["./notification.component.scss"],
  imports: [IconComponent, OmitClickDirective, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger("notificationSlide", [
      transition(":enter", [
        style({
          transform: "{{translateFrom}}",
          opacity: 0,
        }),
        animate(
          "300ms ease-out",
          style({
            transform: "{{translateTo}}",
            opacity: 1,
          })
        ),
      ]),
      transition(":leave", [
        animate(
          "300ms ease-out",
          style({
            transform: "{{translateFrom}}",
            opacity: 0,
          })
        ),
      ]),
    ]),
  ],
})
export class NotificationComponent {
  public eventAction = output<boolean>();

  public hideNotification = input<boolean>();
  public position = input<string>();
  public message = input<string>();
  public action = input<string>();
  public theme = input<string>();

  public iconTheme = {
    success: "",
    danger: "",
  };

  public translateEnterAndLeave = computed(() => {
    const params = {
      translateFrom: "",
      translateTo: "",
    };
    switch (this.position()) {
      case "top-center":
        params.translateFrom = "translate(-50%, -100%)";
        params.translateTo = "translateY(-50%, 0)";
    }

    return params;
  });

  public executeAction(event: Event, status: boolean) {
    if (isClickFromOmittedElement(event)) return;

    this.eventAction.emit(status);
  }
}
