import {
  EnvironmentInjector,
  OutputEmitterRef,
  createComponent,
  ApplicationRef,
  ComponentRef,
  Injectable,
  Injector,
  inject,
  Type,
} from "@angular/core";
import { Observable, Subject } from "rxjs";
import { randomIdLength } from "./helper.service";
import { InjectorsService } from "@injectors.service";

export type InputsDialog<T extends Dialog> = Partial<Record<keyof T, any>>;

/**
 * @param backdropColor default rgba(51, 51, 51, 0.4)
 */
export type BackDropDialog = {
  backdropColor?: string;
  removeBackDrop?: boolean;
};

export type DurationAnimationDialog = {
  durationOpen: number;
  durationClose: number;
};

export type DisableAnimationDialog = {
  disableAnimationOpen?: boolean;
  disableAnimationClose?: boolean;
};

export type StylesDialog = {
  zIndex?: number;
};

/**
 * @param duration on ms default {durationOpen: 150; durationClose: 100}
 */
export type AnimationDialog = {
  disableAnimation?: boolean | DisableAnimationDialog;
  duration?: number | DurationAnimationDialog;
};

export interface OptionsDialog<T extends Dialog> {
  inputs?: InputsDialog<T>;
  animation?: AnimationDialog;
  backDrop?: BackDropDialog;
  styles?: StylesDialog;
  injector?: Injector;
  injectorE?: EnvironmentInjector;
  customClassDialog?: string[];
  removePadding?: boolean;
}

export interface Dialog {
  dialogClose: OutputEmitterRef<any>;
  $destroy?: Subject<void>;
}

const stylesDialog: Partial<CSSStyleDeclaration> = {
  position: "fixed",
  inset: "0",
  zIndex: "100",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  filter: "drop-shadow(0px 16px 48px rgba(0, 0, 0, 0.22))",
  backgroundColor: "#00000080",
};

const classDialog = ["center-all", "height-100", "width-100", "padding-l"];

export class IntanceComponent<T extends Dialog> {
  readonly #id: string = `app--dialog-${randomIdLength(8)?.toLowerCase()}`;
  private frames: Keyframe[] = [];
  private elementDialog!: HTMLElement;
  private elementBackdrop?: HTMLElement;
  private readonly $onClose = new Subject<any>();
  public componentRef!: ComponentRef<T>;
  constructor(
    private component: any,
    private injector: Injector,
    private injectorE: EnvironmentInjector,
    private applicationRef: ApplicationRef,
    private options?: OptionsDialog<T>
  ) {
    this.initComponent();

    this.componentRef.instance.$destroy = new Subject();
  }

  private get el(): HTMLElement {
    return this.elementBackdrop || this.elementDialog;
  }

  private get duration(): DurationAnimationDialog {
    const d = this.options?.animation?.duration;
    let duration: DurationAnimationDialog = {
      durationClose: 100,
      durationOpen: 150,
    };
    if (typeof d === "number") {
      duration = {
        durationClose: d,
        durationOpen: d,
      };
    } else if (d) {
      duration = d;
    }
    return duration;
  }

  private get disabledAnimation(): DisableAnimationDialog {
    const d = this.options?.animation?.disableAnimation;
    let disabled: DisableAnimationDialog = {
      disableAnimationClose: false,
      disableAnimationOpen: false,
    };
    if (typeof d === "boolean") {
      disabled = {
        disableAnimationClose: d,
        disableAnimationOpen: d,
      };
    } else if (d) {
      disabled = d;
    }
    return disabled;
  }

  private setStyles(styles: Partial<CSSStyleDeclaration>): void {
    const s: Partial<CSSStyleDeclaration> = {
      ...styles,
      zIndex: this.options?.styles?.zIndex?.toString() ?? styles.zIndex,
      backgroundColor:
        this.options?.backDrop?.backdropColor || styles.backgroundColor,
    };
    this.options?.backDrop?.removeBackDrop && delete s.backgroundColor;
    Object.keys(s)?.forEach((key) => {
      this.el.style[key] = s[key];
    });
  }

  private addBackDrop(): void {
    if (this.options?.backDrop?.removeBackDrop) return;
    this.elementBackdrop = document.createElement("app--dialog-backdrop");
    this.elementBackdrop.appendChild(this.elementDialog);
  }

  private initComponent(): void {
    this.elementDialog = document.createElement(this.#id);
    this.addBackDrop();
    this.setStyles(stylesDialog);
    this.componentRef = createComponent(this.component, {
      environmentInjector: this.options?.injectorE || this.injectorE,
      hostElement: this.elementDialog,
      elementInjector: this.options?.injector || this.injector,
    });

    classDialog.forEach((className) => {
      if (this.options?.removePadding && className === "padding-l") return;

      this.elementDialog.classList.add(className);
    });

    this.options?.customClassDialog?.forEach((className) =>
      this.elementDialog.classList.add(className)
    );

    this.setInputs();
    this.showComponent();
  }

  private setInputs(): void {
    const inputs: InputsDialog<T> = this.options?.inputs || {};
    Object.keys(inputs)?.forEach((key) => {
      const input = inputs[key];
      try {
        this.componentRef.setInput(key, input);
      } catch (error) {}
    });
  }

  private showComponent(): void {
    this.applicationRef.attachView(this.componentRef.hostView);
    document.body.appendChild(this.el);
    this.animationOpen().then(() => {
      this.obsInternalClose();
    });
  }

  private async animationOpen(): Promise<void> {
    if (this.disabledAnimation?.disableAnimationOpen) return;
    this.frames = [
      {
        scale: "0.5",
        opacity: 0.5,
      },
      {
        scale: "1",
        opacity: 1,
      },
    ];
    await this.animation(this.duration.durationOpen);
  }

  private async animationClose(): Promise<void> {
    if (this.disabledAnimation?.disableAnimationClose) return;
    this.frames = [
      {
        scale: "1",
        opacity: 1,
      },
      {
        scale: "0.5",
        opacity: 0.5,
      },
    ];
    await this.animation(this.duration.durationClose);
  }

  private async animation(duration: number): Promise<void> {
    return new Promise<void>((resolve) => {
      this.elementDialog.animate(this.frames, {
        duration,
        iterations: 1,
        easing: "ease-out",
      }).onfinish = (ev: AnimationPlaybackEvent) => {
        resolve();
      };
    });
  }

  private obsInternalClose(): void {
    this.componentRef.instance?.dialogClose?.subscribe((res?: any) =>
      this.close(res)
    );
  }

  public get id(): string {
    return this.#id;
  }

  public async close(e?: any): Promise<void> {
    await this.animationClose();
    this.el && document.body.removeChild(this.el);
    this.componentRef.hostView &&
      this.applicationRef.detachView(this.componentRef.hostView);
    e && this.$onClose.next(e);

    this.componentRef.instance.$destroy?.next();
    this.componentRef.instance.$destroy?.complete();
  }

  public get onClose(): Observable<any> {
    return this.$onClose.asObservable();
  }
}

/**
 * @author David Gallego
 * @see https://angular.dev/guide/elements
 *
 * @export
 * @class DialogService
 */
@Injectable({
  providedIn: "root",
})
export class DialogService {
  private applicationRef: ApplicationRef = inject(ApplicationRef);
  private injectorsService: InjectorsService = inject(InjectorsService);

  open<T extends Dialog>(
    component: Type<T>,
    options?: OptionsDialog<T>
  ): IntanceComponent<T> {
    return new IntanceComponent<T>(
      component,
      this.injectorsService.injector(),
      this.injectorsService.environmentInjector(),
      this.applicationRef,
      options
    );
  }
}
