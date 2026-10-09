import { useCallback } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

export function setGlowVars(el: HTMLElement, clientX: number, clientY: number) {
  const rect = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${clientX - rect.left}px`);
  el.style.setProperty("--my", `${clientY - rect.top}px`);
}

export function usePointerGlow<T extends HTMLElement>() {
  return useCallback((e: ReactPointerEvent<T>) => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setGlowVars(e.currentTarget, e.clientX, e.clientY);
  }, []);
}
