import { Injectable, signal } from "@angular/core";
import { ITranslation } from "@shared/Core/settings/translations/domain/interfaces";

@Injectable({
  providedIn: "root",
})
export class TranslateService {
  public translations = signal<ITranslation.All>({});

  getTranslate(key: string) {
    return this.translations()?.[key] || key;
  }
}
