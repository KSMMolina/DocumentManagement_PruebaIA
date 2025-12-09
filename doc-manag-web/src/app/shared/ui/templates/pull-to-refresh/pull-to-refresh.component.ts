import {
  ChangeDetectionStrategy,
  ElementRef,
  Component,
  Renderer2,
  OnDestroy,
  computed,
  output,
  inject,
  signal,
  input,
  HostBinding,
  viewChild,
} from "@angular/core";
import { safeEffect } from "@shared/signals/signal";
import { IconComponent } from "@shared/ui/components/icon/icon.component";
import { LayoutService } from "@layout.service";
import { ButtonComponent } from "@shared/ui/components/button/button.component";

@Component({
  selector: "app-pull-to-refresh",
  templateUrl: "./pull-to-refresh.component.html",
  styleUrls: ["./pull-to-refresh.component.scss"],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent, ButtonComponent],
})
export class PullToRefreshComponent implements OnDestroy {
  @HostBinding("style") defaultStyle = { "min-height": "0", height: "100%" };

  public refresh = output<void>();

  public refreshDistance = input(70);

  public isLoading = signal(false);
  private pulling = signal(false);
  private touchStartY = signal(0);

  private pullDistance = signal(0);

  public iconTransform = computed(() => `${this.pullDistance()}px`);

  private listeners: Array<() => void> = [];

  private pullToRefreshPrincipalPage = signal<HTMLDivElement | null>(null);

  private layoutService: LayoutService = inject(LayoutService);
  private renderer: Renderer2 = inject(Renderer2);

  constructor() {
    safeEffect(
      (isMobile) => {
        isMobile ? this.initTouchEvents() : this.removeTouchEvents();
      },
      [this.layoutService.isMobile]
    );
  }

  private initTouchEvents(): void {
    this.pullToRefreshPrincipalPage.set(
      document.getElementById("pullToRefreshPrincipalPage") as HTMLDivElement
    );

    this.listeners.push(
      this.renderer.listen(
        this.pullToRefreshPrincipalPage(),
        "touchstart",
        this.onTouchStart
      ),
      this.renderer.listen(
        this.pullToRefreshPrincipalPage(),
        "touchmove",
        this.onTouchMove
      ),
      this.renderer.listen(
        this.pullToRefreshPrincipalPage(),
        "touchend",
        this.onTouchEnd
      )
    );

    console.log(this.pullToRefreshPrincipalPage());
  }

  private removeTouchEvents(): void {
    this.listeners.forEach((listener) => listener());
    this.listeners = [];
  }

  public onTouchStart = (event: TouchEvent): void => {
    const target = event.target as HTMLElement;

    if (
      !this.pullToRefreshPrincipalPage() ||
      this.isLoading() ||
      this.pullToRefreshPrincipalPage()?.scrollTop > 0
    ) {
      return;
    }

    this.pulling.set(true);
    this.touchStartY.set(event.touches[0].clientY);
    this.pullDistance.set(0);
  };

  public onTouchMove = (event: TouchEvent): void => {
    if (!this.pulling() || this.isLoading()) return;

    const deltaY = event.touches[0].clientY - this.touchStartY();

    if (deltaY > 0 && this.pullToRefreshPrincipalPage()?.scrollTop === 0) {
      event.preventDefault();
      this.pullDistance.set(Math.min(deltaY, this.refreshDistance()));
    } else {
      this.pullDistance.set(0);
      this.pulling.set(false);
    }
  };

  public onTouchEnd = (): void => {
    if (!this.pulling()) return;

    this.pulling.set(false);

    if (this.pullDistance() >= this.refreshDistance()) {
      this.isLoading.set(true);
      this.layoutService.pageIsRefreshing.set(true);
      this.refresh.emit();

      setTimeout(() => {
        this.pullDistance.set(0);
        this.layoutService.pageIsRefreshing.set(false);
        this.isLoading.set(false);
      }, 800);
    } else {
      this.pullDistance.set(0);
    }
  };

  ngOnDestroy() {
    this.removeTouchEvents();
  }
}
