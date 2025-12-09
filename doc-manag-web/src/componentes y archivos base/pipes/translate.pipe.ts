import { Pipe, PipeTransform, inject } from "@angular/core";
import { capitalizeText } from "@shared/services/local/helper.service";
import { TranslateService } from "@translate.service";

@Pipe({ name: "translate", standalone: true, pure: false })
export class TranslatePipe implements PipeTransform {
  private translateService = inject(TranslateService);

  transform(
    key: string,
    params?: { [key: string]: string | number },
    transform?: "lower" | "upper" | "capitalize"
  ): string {
    if (!key) return "";

    let value = this.translateService.getTranslate(key);

    if (!value || typeof value !== 'string') return "";

    if (!!value && !!params)
      Object.entries(params).forEach(([k, v]) => {
        let val =
          typeof v === "number"
            ? v.toString()
            : (this.translateService.getTranslate(v) || v)?.toLowerCase();

        value = value.replaceAll(
          `{${k}}`,
          [undefined, null].includes(v) ? "" : val
        );
      });
    else if (!params) value = value?.replace(/\{[^}]+\}/g, "");

    if (transform === "capitalize") return capitalizeText(value);
    if (transform === "lower") return value?.toLowerCase();
    if (transform === "upper") return value?.toUpperCase();
    return value;
  }
}
