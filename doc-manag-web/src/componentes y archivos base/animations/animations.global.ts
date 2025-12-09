import {
  animate,
  AnimationTriggerMetadata,
  AUTO_STYLE,
  style,
  transition,
  trigger,
} from "@angular/animations";

export const slideCustomAnimation = (
  name: string,
  direction: "X" | "Y",
  from: string,
  to: string,
  time: {
    enter?: string;
    leave?: string;
    enterDelay?: string;
    leaveDelay?: string;
  }
): AnimationTriggerMetadata => {
  let triggerCustom = trigger(name, []);

  if (time.leave) {
    triggerCustom.definitions.push(
      transition(":leave", [
        animate(
          `${time.leave}  ${time.leaveDelay || "0ms"} ease-out`,
          style({
            transform: `translate${direction}(${from})`,
            opacity: 0,
          })
        ),
      ])
    );
  }

  if (time.enter) {
    triggerCustom.definitions.push(
      transition(":enter", [
        style({
          transform: `translate${direction}(${from})`,
          opacity: 0,
        }),
        animate(
          `${time.enter} ${time.enterDelay || "0ms"} ease-in`,
          style({
            transform: `translate${direction}(${to})`,
            opacity: 1,
          })
        ),
      ])
    );
  }

  return triggerCustom;
};

export const fadeInCustomAnimation = (
  name: string,
  time: {
    enter?: string;
    leave?: string;
    enterDelay?: string;
    leaveDelay?: string;
  }
): AnimationTriggerMetadata => {
  let triggerCustom = trigger(name, []);
  if (time.enter) {
    triggerCustom.definitions.push(
      transition(":enter", [
        style({ opacity: 0 }),
        animate(
          `${time.enter} ${time.enterDelay || "0ms"} ease-in`,
          style({ opacity: 1 })
        ),
      ])
    );
  }

  if (time.leave) {
    triggerCustom.definitions.push(
      transition(":leave", [
        animate(
          `${time.leave} ${time.leaveDelay || "0ms"} ease-out`,
          style({ opacity: 0 })
        ),
      ])
    );
  }
  return triggerCustom;
};

export const collapseAnimation = (time = '150ms') => trigger("collapse", [
  transition(":enter", [
    style({
      visibility: "hidden",
      overflow: "hidden",
      height: 0,
    }),
    animate(
      `${time} ease-in`,
      style({ height: AUTO_STYLE, visibility: AUTO_STYLE })
    ),
  ]),
  transition(":leave", [
    style({ overflow: "hidden" }),
    animate(
      `${time} ease-out`,
      style({ paddingBottom: 0, paddingTop: 0, height: 0 })
    ),
  ]),
]);

/**
 * Animation para hacer zoom suave (in/out) para el zoom
 */
export function animateZoom(
  setter: (v: number) => void,
  start: number,
  end: number,
  duration: number,
  onUpdate?: (progress: number) => void,
  onDone?: () => void
) {
  const startTime = performance.now();
  function animate(now: number) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = progress < 0.5
      ? 2 * progress * progress
      : -1 + (4 - 2 * progress) * progress;
    setter(start + (end - start) * ease);
    if (onUpdate) onUpdate(ease);
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      setter(end);
      if (onDone) onDone();
    }
  }
  requestAnimationFrame(animate);
}

/**
 * Animación de zoom-in (hacia un punto x/y)
 */
export function animateZoomIn(
  zoomLevelSetter: (v: number) => void,
  zoomXSetter: (v: number) => void,
  zoomYSetter: (v: number) => void,
  panOffsetXSetter: (v: number) => void,
  panOffsetYSetter: (v: number) => void,
  startZoom: number,
  endZoom: number,
  duration: number,
  x: number,
  y: number
) {
  animateZoom(zoomLevelSetter, startZoom, endZoom, duration, () => {
    zoomXSetter(x);
    zoomYSetter(y);
    panOffsetXSetter(0);
    panOffsetYSetter(0);
  });
}

/**
 * Animación de zoom-out (reset)
 */
export function animateZoomOut(
  zoomLevelSetter: (v: number) => void,
  zoomXSetter: (v: number) => void,
  zoomYSetter: (v: number) => void,
  panOffsetXSetter: (v: number) => void,
  panOffsetYSetter: (v: number) => void,
  startZoom: number,
  endZoom: number,
  duration: number
) {
  animateZoom(zoomLevelSetter, startZoom, endZoom, duration, () => {
    zoomXSetter(50);
    zoomYSetter(50);
    panOffsetXSetter(0);
    panOffsetYSetter(0);
  });
}
