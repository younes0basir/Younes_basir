import type { MouseEvent } from "react";
import { useMotionValue, useReducedMotion, useSpring } from "framer-motion";

const SPRING = { stiffness: 280, damping: 22, mass: 0.35 };

export function useMagnetic(strength = 0.28) {
  const reduceMotion = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, SPRING);
  const y = useSpring(rawY, SPRING);

  const onMouseMove = (event: MouseEvent<HTMLElement>) => {
    if (reduceMotion) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    rawX.set((event.clientX - rect.left - rect.width / 2) * strength);
    rawY.set((event.clientY - rect.top - rect.height / 2) * strength);
  };

  const onMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return { style: { x, y }, onMouseMove, onMouseLeave };
}
