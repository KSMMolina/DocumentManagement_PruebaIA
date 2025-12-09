import { Pipe, PipeTransform, inject } from "@angular/core";

@Pipe({ name: "math", standalone: true })
export class MathPipe implements PipeTransform {
  transform(value: number, to: "ceil" | "floor" | "round" = "ceil"): number {
    return Math[to](value);
  }
}
