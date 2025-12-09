import { computed, inject, Injectable, signal } from "@angular/core";
import { Router } from "@angular/router";
import { IProvider } from "@shared/Core/settings/provider/domain/interface";
import { Assets } from "@assets";
import { IRoleType } from "@shared/Core/settings/role-type/domain/interfaces";
import { ISuperAdmin } from "@shared/Core/settings/super-admin/domain/interfaces";
import { IUser } from "@shared/Core/settings/user/domain/interfaces";
import { DomoNowRoute } from "@shared/globals/routes";
import { cleanLocalStorage } from "@shared/utils/local-storage";
import { CacheService } from "@cache.service";

@Injectable({
  providedIn: "root",
})
export class UserLocalService {
  private cache = inject(CacheService);
  private router = inject(Router);

  public superAdmin = signal<ISuperAdmin.Profile>(null);
  public user = signal<IUser.Profile>(null);
  public provider = signal<IProvider.Token>(null);

  public isResident = computed(() =>
    [IRoleType.Types.OWNER_RESIDENT, IRoleType.Types.RESIDENT].includes(
      this.user()?.RoleTypeId
    )
  );
  public isDoorman = computed(
    () => this.user()?.RoleTypeId === IRoleType.Types.DOORMAN
  );
  public isAdmin = computed(
    () => this.user()?.RoleTypeId === IRoleType.Types.ADMIN
  );
  public isOwner = computed(
    () => this.user()?.RoleTypeId === IRoleType.Types.OWNER
  );

  public idsEmergencyAlertsAttendingOrNew = signal<string[]>([]);

  logout(userType: "normal" | "provider" = "normal") {
    cleanLocalStorage();
    this.cleanCache();

    window.localStorage.setItem(
      Assets.credentials.REDIRECT_TO,
      window.location.pathname
    );

    if (!window.localStorage.getItem(Assets.credentials.ONBOARDING))
      DomoNowRoute.AUTH().AUTH.ONBOARDING.goTo(this.router);
    else if (userType === "provider")
      DomoNowRoute.AUTH().AUTH.LOGIN_PROVIDER.goTo(this.router);
    else DomoNowRoute.AUTH().AUTH.LOGIN.goTo(this.router);

    setTimeout(() => {
      this.idsEmergencyAlertsAttendingOrNew.set([]);
      this.superAdmin.set(null);
      this.provider.set(null);
      this.user.set(null);
    }, 1000);
  }

  private cleanCache() {
    this.cache
      .keys()
      .forEach((key) => !key.includes("FIXED") && this.cache.delete(key));
  }
}
