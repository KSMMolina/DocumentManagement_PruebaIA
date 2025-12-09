// import {
//   ElementRef,
//   Renderer2,
//   Directive,
//   OnDestroy,
//   input,
//   inject,
//   OnInit,
//   signal,
//   ComponentRef,
// } from "@angular/core";
// import { LayoutService } from "@layout.service";
// import { safeEffect } from "@shared/signals/signal";

// import { PullToRefreshBannerComponent } from "@shared/components/pull-to-refresh-banner/pull-to-refresh-banner.component";

// @Directive({
//   selector: "[appPullToRefresh]",
// })
// export class PullToRefreshDirective implements OnInit, OnDestroy {
//   public refreshDistance = input(70);

//   private isPulling = signal(false);
//   private isLoading = signal(false);
//   private pullDistance = signal(0);
//   private touchStartY = signal(0);

//   private listeners: Array<() => void> = [];
//   private bannerRef?: ComponentRef<PullToRefreshBannerComponent>;

//   private elementRef: ElementRef<HTMLElement> = inject(ElementRef);
//   private layoutService: LayoutService = inject(LayoutService);
//   private renderer: Renderer2 = inject(Renderer2);

//   constructor() {
//     safeEffect(
//       (isMobile) => {
//         isMobile ? this.initTouchEvents() : this.removeTouchEvents();
//       },
//       [this.layoutService.isMobile]
//     );

//     this.container.set(this.elementRef.nativeElement as HTMLDivElement);
//   }

//   ngOnInit(): void {
//     if (this.layoutService.isMobile()) {
//       this.initTouchEvents();
//     }
//   }

//   private initTouchEvents(): void {
//     this.listeners.push(
//       this.renderer.listen(
//         this.container,
//         "touchstart",
//         this.onTouchStart.bind(this)
//       ),
//       this.renderer.listen(
//         this.container,
//         "touchmove",
//         this.onTouchMove.bind(this)
//       ),
//       this.renderer.listen(
//         this.container,
//         "touchend",
//         this.onTouchEnd.bind(this)
//       )
//     );
//   }

//   private removeTouchEvents(): void {
//     this.listeners.forEach((off) => off());
//     this.listeners = [];
//   }

//   private resetPull(force = false): void {
//     this.container()?.style.transform = "translateY(0)";
//     if (force) this.isLoading.set(false);
//     this.pullDistance.set(0);
//   }

//   /**
//    * Verifica si todos los contenedores scrollables padres están en scrollTop 0
//    */
//   private checkAllScrollAncestors(element: HTMLElement): boolean {
//     let current = element.parentElement;
//     while (current) {
//       const overflowY = getComputedStyle(current).overflowY;
//       if (
//         (overflowY === "scroll" || overflowY === "auto") &&
//         current.scrollTop > 0
//       ) {
//         return false;
//       }
//       current = current.parentElement;
//     }
//     return true;
//   }

//   ngOnDestroy(): void {
//     this.removeTouchEvents();
//   }
// }
