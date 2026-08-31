import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePageLoadProgress } from "../hooks/usePageLoadProgress.ts";
import { EASE_SOFT } from "../lib/motion.ts";
import { resetScrollPosition } from "../lib/scroll.ts";

const EXIT_MS = 900;
const CONTENT_FADE_MS = 350;

type PageLoaderProps = {
  onExitStart: () => void;
  onDone: () => void;
};

const FIRST_NAME = "Younes";
const LAST_NAME = "Basir";

export default function PageLoader({ onExitStart, onDone }: PageLoaderProps) {
  const reduceMotion = useReducedMotion();
  const { progress, stageLabel, ready } = usePageLoadProgress();
  const [phase, setPhase] = useState<"loading" | "exit">("loading");
  const [mounted, setMounted] = useState(true);
  const displayProgress = Math.min(100, Math.round(progress * 100));

  useEffect(() => {
    if (reduceMotion) {
      onExitStart();
      onDone();
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [onDone, onExitStart, reduceMotion]);

  useEffect(() => {
    if (!ready || phase !== "loading") {
      return;
    }

    onExitStart();
    setPhase("exit");
  }, [onExitStart, phase, ready]);

  useEffect(() => {
    if (phase !== "exit") {
      return;
    }

    const timer = window.setTimeout(() => setMounted(false), CONTENT_FADE_MS);
    return () => window.clearTimeout(timer);
  }, [phase]);

  if (reduceMotion) {
    return null;
  }

  return (
    <AnimatePresence
      onExitComplete={() => {
        resetScrollPosition();
        document.body.style.overflow = "";
        onDone();
      }}
    >
      {mounted ? (
        <motion.div
          key="page-loader"
          role="status"
          aria-live="polite"
          aria-label="Loading portfolio"
          aria-busy={phase === "loading"}
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: EXIT_MS / 1000, ease: EASE_SOFT }}
          className="page-loader fixed inset-0 z-[200] flex flex-col bg-black"
        >
          <div className="noise-overlay pointer-events-none absolute inset-0 opacity-50 mix-blend-overlay" />
          <div className="hero-grid pointer-events-none absolute inset-0 opacity-40" />
          <div className="page-loader-glow pointer-events-none absolute inset-0" aria-hidden="true" />

          <motion.div
            animate={phase === "exit" ? { opacity: 0, y: -10 } : { opacity: 1, y: 0 }}
            transition={{ duration: CONTENT_FADE_MS / 1000, ease: EASE_SOFT }}
            className="relative z-10 flex flex-1 flex-col"
          >
            <div className="flex flex-1 flex-col items-center justify-center px-6">
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE_SOFT }}
                className="text-primary/70 text-[11px] tracking-[0.28em] uppercase"
              >
                Portfolio
              </motion.p>

              <div className="mt-6 overflow-hidden text-center">
                <div className="flex justify-center">
                  {FIRST_NAME.split("").map((char, index) => (
                    <motion.span
                      key={`${char}-${index}`}
                      initial={{ y: "110%", opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        duration: 0.55,
                        delay: 0.08 + index * 0.045,
                        ease: EASE_SOFT,
                      }}
                      className="inline-block text-[clamp(2rem,11vw,3.5rem)] leading-none font-medium tracking-[-0.06em] text-[#E1E0CC] sm:text-6xl md:text-7xl"
                    >
                      {char}
                    </motion.span>
                  ))}
                </div>

                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.65, delay: 0.42, ease: EASE_SOFT }}
                  className="font-serif mt-2 text-[clamp(1.5rem,7vw,2.5rem)] text-[#E1E0CC] italic sm:text-4xl md:text-5xl"
                >
                  {LAST_NAME}
                </motion.p>
              </div>

              <motion.p
                key={stageLabel}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: EASE_SOFT }}
                className="mt-8 min-h-[1.25rem] text-center text-sm text-gray-500"
              >
                {stageLabel}
              </motion.p>
            </div>

            <div className="px-5 pb-[max(2rem,env(safe-area-inset-bottom))] sm:px-8 md:px-12 md:pb-12">
              <div className="mb-3 flex items-center justify-between text-[11px] tracking-[0.18em] text-gray-500 uppercase">
                <span>Loading</span>
                <span>{displayProgress.toString().padStart(2, "0")}%</span>
              </div>
              <div className="page-loader-track h-px overflow-hidden bg-white/10">
                <motion.div
                  className="page-loader-bar h-px origin-left bg-primary"
                  style={{ scaleX: Math.max(progress, 0.04) }}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
