import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class DateFormatService {
  constructor() {}

  formatDate(date: string, lang: "es" | "en" = "es"): string {
    const dateWithoutZ = date.replace("Z", "");
    const dates = new Date(dateWithoutZ);

    const dayNames = {
      es: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
      en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    };
    const monthNames = {
      es: [
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic",
      ],
      en: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    };

    const weekDay = dayNames[lang][dates.getDay()];
    const day = dates.getDate().toString().padStart(2, "0");
    const month = monthNames[lang][dates.getMonth()];
    const year = dates.getFullYear();
    let hours = dates.getHours();
    const minutes = dates.getMinutes().toString().padStart(2, "0");
    const isPM = hours >= 12;
    const period =
      lang === "es" ? (isPM ? "p.m." : "a.m.") : isPM ? "PM" : "AM";

    hours = hours % 12;
    if (hours === 0) hours = 12;

    return `${weekDay}-${day}-${month}-${year} ${hours}:${minutes} ${period}`;
  }
}
