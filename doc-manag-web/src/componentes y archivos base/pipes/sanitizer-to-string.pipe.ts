import { Pipe, PipeTransform } from "@angular/core";
import { validateText } from "@shared/directives/sanitizer-to-string.directive";

@Pipe({
  name: "sanitizerToString",
  standalone: true,
})
export class SanitizerToStringPipe implements PipeTransform {
  transform(value: string | number, convertToText?: boolean): Promise<string> {
    return new Promise<string>((resolve) => {
      if (convertToText) resolve(SanitizerToStringPipe.replaceSymbols(value));
      else resolve(validateText(`${value}`));
    });
  }

  syncTransform(value: string | number): string {
    return SanitizerToStringPipe.replaceSymbols(value);
  }

  public removeHTMLfromString(value: string): Promise<string> {
    return new Promise<string>((resolve) => {
      const dom = new DOMParser().parseFromString(value, "text/html");
      resolve(dom?.body?.textContent || "");
    });
  }

  private static replaceSymbols = (value: string | number): string =>
    typeof value === "string"
      ? value?.replace(/</g, "&lt;")?.replace(/>/g, "&gt;") || ""
      : `${value}`;
}
