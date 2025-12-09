import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from "@angular/core";
import { TagComponent } from "../tag/tag.component";
import { UpperCasePipe } from "@angular/common";
import { UserLocalService } from "@user.service";
import { transformBooleanInput } from "@shared/utils/transform-input";

type AvatarSize = "2xs" | "xs" | "s" | "m" | "l" | "xl" | "2xl" | "3xl" | "4xl";

@Component({
  selector: "app-avatar",
  imports: [TagComponent, UpperCasePipe],
  templateUrl: "./avatar.component.html",
  styleUrl: "./avatar.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarComponent {
  public userLocalService = inject(UserLocalService);

  /** Tamaño del avatar */
  public size = input<AvatarSize>("m");

  /** Texto del avatar */
  public text = input<string>();

  /** Rol del avatar */
  public rol = input();

  public isUserConnected = input(false, { transform: transformBooleanInput });

  public textSplit = computed(() => {
    const split = (
      this.isUserConnected()
        ? this.userLocalService.user()?.fullName ||
          this.userLocalService.superAdmin()?.name
        : this.text()
    )
      ?.split(" ")
      ?.slice(0, 2);

    if (split?.length > 1)
      return split
        .slice(0, 2)
        .map((word) => word.charAt(0).toUpperCase())
        .join("");

    return split?.[0]?.slice(0, 2);
  });
}
