import {
  ChangeDetectionStrategy,
  ContentChildren,
  HostBinding,
  Component,
  QueryList,
  input,
  output,
  OnInit,
  signal,
} from "@angular/core";
import { NgClass, NgStyle, NgTemplateOutlet } from "@angular/common";
import { slideCustomAnimation } from "@shared/animations/animations.global";
import { StepItemComponent } from "./step-item/step-item.component";
import { StepElementComponent } from "./step-element/step-element.component";

export interface Step {
  orientation?: StepOrientation;
  disabledElement?: boolean;
  isSelected?: boolean;
  isFinished?: boolean;
  description?: string;
  type?: StepType;
  index?: number;
  label?: string;
  icon?: string;
}

export type StepType = "basic" | "custom-icon" | "dot" | "inline";

export type StepOrientation = "horizontal" | "vertical";

@Component({
  selector: "app-step",
  templateUrl: "./step.component.html",
  imports: [StepElementComponent, NgTemplateOutlet, NgStyle, NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    slideCustomAnimation("slideEnterTop", "Y", "-1rem", "0", {
      enter: "300ms",
    }),
  ],
})
export class StepComponent implements OnInit {
  @HostBinding('style.min-height') minHeight = '0';

  /**
   * Lista de items enviada como proyección
   */
  @ContentChildren(StepItemComponent, {
    descendants: true,
    read: StepItemComponent,
  })
  readonly stepItems!: QueryList<StepItemComponent>;

  public selectionChange = output<number>();

  /**
   * Lista de items enviada como input
   */
  public steps = input<Step[]>();

  /**
   * Indica el slide seleccionado
   */
  public selectedIndex = input(0);

  /** Indica la orientación del slide
   * @default 'horizontal'
   */
  public orientation = input<StepOrientation>("horizontal");

  /** Indica el tipo de step
   * @default 'basic'
   */
  public type = input<StepType>("basic");

  /** Indica el tamaño del step */
  public size = input<"default" | "sm">("default");

  /** Indica si se ha realizado la inicialización */
  public init = signal(true);

  public ngOnInit(): void {
    setTimeout(() => this.init.set(false), 1000);
  }

  public getTransformByIndex(index: number): string {
    return `translate3d(${(index - this.selectedIndex()) * 100 + "%"},0,0)`;
  }

  public selectStep(index: number) {
    this.selectionChange.emit(index);
  }
}
