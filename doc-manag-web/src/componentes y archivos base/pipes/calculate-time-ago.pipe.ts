import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "calculateTimeAgo",
})
export class CalculateTimeAgoPipe implements PipeTransform {
  transform(value: string): string {
    const d1 = new Date(value);
    const d2 = new Date();
    const ms = d2.getTime() - d1.getTime();
    const seconds = Math.floor(ms / 1000);

    if (seconds < 60) return this.formatTime(seconds, "seg");

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return this.formatTime(minutes, "min");

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return this.formatTime(hours, "h");

    const days = Math.floor(hours / 24);
    if (days < 7) return this.formatTime(days, "d");

    const weeks = Math.floor(days / 7);
    if (weeks < 4) return this.formatTime(weeks, "s");

    const months = Math.floor(days / 30.4375);
    if (months < 12) return this.formatTime(months, "m");

    const years = Math.floor(days / 365.25);
    return this.formatTime(years, "a");
  }

  private formatTime(value: number, unit: string): string {
    return `${value}${unit}`;
  }
}
