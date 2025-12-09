// import { NgClass, NgStyle } from "@angular/common";
// import {
//   ChangeDetectionStrategy,
//   ElementRef,
//   Component,
//   viewChild,
//   computed,
//   input,
//   signal,
//   inject,
//   effect,
// } from "@angular/core";
// import { Assets } from "@assets";
// import { ItemSkeletonComponent } from "../item-skeleton/item-skeleton.component";
// import {
//   transformUpperCaseInput,
//   transformBooleanInput,
// } from "@shared/utils/transform-input";
// import { ImageCacheService } from "./image.service";

// @Component({
//   selector: "app-image",
//   templateUrl: "./image.component.html",
//   styleUrl: "./image.component.scss",
//   imports: [ItemSkeletonComponent, NgStyle, NgClass],
//   changeDetection: ChangeDetectionStrategy.OnPush,
// })
// export class ImageComponent {
//   public imgRef = viewChild<ElementRef<HTMLImageElement>>("imgRef");

//   /**
//    * Define la ruta de la imagen
//    * @type {string}
//    */
//   public image = input("", { transform: transformUpperCaseInput });

//   /**
//    * Define la url de la imagen si es externa
//    * @type {string}
//    */
//   public src = input("");

//   /**
//    * Define la altura de la imagen
//    * @type {string}
//    */
//   public height = input.required<string>();

//   /**
//    * Define el ancho de la imagen
//    * @type {string}
//    */
//   public width = input.required<string>();

//   /**
//    * Define el texto alternativo de la imagen
//    * @type {string}
//    */
//   public alt = input<string>("");

//   /**
//    * Define las clases de la imagen
//    * @type {string}
//    */
//   public classes = input<string>("");

//   /**
//    * Define el tipo de decodificación de la imagen
//    * @type {"async" | "sync" | "auto"}
//    */
//   public decoding = input<"async" | "sync" | "auto">("async");

//   /**
//    * Define si la imagen es prioridad
//    * @type {boolean}
//    */
//   public priority = input(false, { transform: transformBooleanInput });

//   /**
//    * Habilita el caché de imágenes con IndexedDB
//    * @type {boolean}
//    * @default true
//    */
//   public enableCache = input(true, { transform: transformBooleanInput });

//   /**
//    * Obtiene la URL de la imagen
//    * @type {string}
//    */
//   public imageUrl = computed(() => {
//     if (this.src()) return this.src();
//     if (!this.image()) return "";

//     const keys = this.image().split(".");
//     let image = Assets.images;

//     for (const key of keys) {
//       image = image?.[key];
//       if (!image) break;
//     }

//     return image || this.image();
//   });

//   public isLoad = signal(false);
//   public cachedImageUrl = signal<string>("");
//   public hasError = signal(false);

//   private imageCacheService = inject(ImageCacheService);

//   constructor() {
//     // Efecto para cargar la imagen con caché
//     effect(() => {
//       const url = this.imageUrl();
//       const cacheEnabled = this.enableCache();

//       if (url && cacheEnabled) {
//         this.loadImageWithCache(url);
//       } else if (url) {
//         // Si el caché está deshabilitado, usar URL directamente
//         this.cachedImageUrl.set(url);
//       }
//     });
//   }

//   /**
//    * Carga la imagen usando el servicio de caché
//    */
//   private loadImageWithCache(url: string): void {
//     this.isLoad.set(false);
//     this.hasError.set(false);

//     this.imageCacheService.getImage(url).subscribe({
//       next: (blobUrl) => {
//         this.cachedImageUrl.set(blobUrl);
//       },
//       error: (error) => {
//         console.error('Error loading cached image:', error);
//         this.hasError.set(true);
//         // Fallback a URL original si falla el caché
//         this.cachedImageUrl.set(url);
//       },
//     });
//   }

//   /**
//    * Obtiene métricas del servicio de caché
//    */
//   public getImageMetrics() {
//     return this.imageCacheService.getMetrics();
//   }
// }


import { NgClass, NgStyle } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ElementRef,
  Component,
  viewChild,
  computed,
  input,
  signal,
} from "@angular/core";
import { Assets } from "@assets";
import { ItemSkeletonComponent } from "../item-skeleton/item-skeleton.component";
import {
  transformUpperCaseInput,
  transformBooleanInput,
} from "@shared/utils/transform-input";

@Component({
  selector: "app-image",
  templateUrl: "./image.component.html",
  styleUrl: "./image.component.scss",
  imports: [ItemSkeletonComponent, NgStyle, NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageComponent {
  public imgRef = viewChild<ElementRef<HTMLImageElement>>("imgRef");

  /**
   * Define la ruta de la imagen
   * @type {string}
   */
  public image = input("", { transform: transformUpperCaseInput });

  /**
   * Define la url de la imagen si es externa
   * @type {string}
   */
  public src = input("");

  /**
   * Define la altura de la imagen
   * @type {string}
   */
  public height = input.required<string>();

  /**
   * Define el ancho de la imagen
   * @type {string}
   */
  public width = input.required<string>();

  /**
   * Define el texto alternativo de la imagen
   * @type {string}
   */
  public alt = input<string>("");

  /**
   * Define las clases de la imagen
   * @type {string}
   */
  public classes = input<string>("");

  /**
   * Define el tipo de decodificación de la imagen
   * @type {"async" | "sync" | "auto"}
   */
  public decoding = input<"async" | "sync" | "auto">("async");

  /**
   * Define si la imagen es prioridad
   * @type {boolean}
   */
  public priority = input(false, { transform: transformBooleanInput });

  /**
   * Obtiene la URL de la imagen
   * @type {string}
   */
  public imageUrl = computed(() => {
    if (this.src()) return this.src();
    if (!this.image()) return "";

    const keys = this.image().split(".");
    let image = Assets.images;

    for (const key of keys) {
      image = image?.[key];
      if (!image) break;
    }

    return image || this.image();
  });

  public isLoad = signal(false);
}
