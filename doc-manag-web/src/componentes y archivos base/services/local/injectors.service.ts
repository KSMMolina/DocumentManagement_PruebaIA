import {
  EnvironmentInjector,
  Injectable,
  Injector,
  signal,
} from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class InjectorsService {
  public environmentInjector = signal<EnvironmentInjector>(undefined);
  public injector = signal<Injector>(undefined);

  public setInjectors(
    environmentInjector: EnvironmentInjector,
    injector: Injector
  ): void {
    this.environmentInjector.set(environmentInjector);
    this.injector.set(injector);
  }
}
