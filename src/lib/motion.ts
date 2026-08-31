// Typed as tuples so framer-motion accepts them as bezier definitions.
export const EASE_SOFT: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const EASE_CARD: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const EASE_SMOOTH: [number, number, number, number] = [0.4, 0, 0.2, 1];
export const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const EASE_SPRING: [number, number, number, number] = [0.34, 1.2, 0.64, 1];

export const PULL_UP_STAGGER = 0.08;
export const CARD_STAGGER = 0.12;
export const PROJECT_STAGGER = 0.06;
export const GALLERY_STAGGER = 0.09;

export function pullUpDelay(index: number): number {
  return Math.min(index * PULL_UP_STAGGER, 0.48);
}

// Reusable variants
export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1 },
};

export const staggerContainer = (stagger = 0.08, delayChildren = 0) => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren },
  },
});

export const listItem = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_SOFT } },
};

export const pillVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.05, ease: EASE_SOFT },
  }),
};
