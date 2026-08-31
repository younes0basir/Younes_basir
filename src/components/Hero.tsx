import { useCallback, useEffect, useRef } from "react";
import type { PointerEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { HERO_VIDEO_URL } from "../lib/hero.ts";
import WordsPullUp from "./WordsPullUp.tsx";
import { useMagnetic } from "../hooks/useMagnetic.ts";
import { EASE_SOFT } from "../lib/motion.ts";
import { NAV_ITEMS } from "../lib/site.ts";

export default function Hero() {
  const reduceMotion = useReducedMotion();
  const frameRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const primary = useMagnetic(0.22);
  const secondary = useMagnetic(0.18);

  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const onPointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (reduceMotion) {
        return;
      }

      const frame = frameRef.current;
      if (!frame) {
        return;
      }

      const { clientX, clientY } = event;
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const rect = frame.getBoundingClientRect();
        const x = ((clientX - rect.left) / rect.width) * 100;
        const y = ((clientY - rect.top) / rect.height) * 100;
        frame.style.setProperty("--mx", `${x}%`);
        frame.style.setProperty("--my", `${y}%`);
      });
    },
    [reduceMotion],
  );

  return (
    <section id="top" className="min-h-svh p-3 sm:p-4 md:h-screen md:p-6">
      <div
        ref={frameRef}
        onPointerMove={onPointerMove}
        className="relative flex min-h-[calc(100svh-max(1.5rem,env(safe-area-inset-top))-max(1.5rem,env(safe-area-inset-bottom)))] w-full flex-col overflow-hidden rounded-2xl md:h-full md:min-h-0 md:rounded-[2rem]"
      >
        {reduceMotion ? (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,#212121_0%,#000000_70%)]" />
        ) : (
          <video
            autoPlay
            loop
            muted
            playsInline
            aria-hidden="true"
            src={HERO_VIDEO_URL}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.7] mix-blend-overlay" />
        <div className="hero-grid pointer-events-none absolute inset-0 opacity-70" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/45 via-black/15 to-black/80" />
        {!reduceMotion ? <div className="hero-glow pointer-events-none absolute inset-0" /> : null}

        {!reduceMotion ? (
          <>
            <div className="orb pointer-events-none absolute -top-16 -left-10 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
            <div
              className="orb pointer-events-none absolute right-[-4rem] bottom-24 h-64 w-64 rounded-full bg-[#E1E0CC]/10 blur-3xl"
              style={{ animationDelay: "-6s" }}
            />
          </>
        ) : null}

        <nav
          aria-label="Hero"
          className="absolute top-0 left-1/2 z-20 hidden -translate-x-1/2 rounded-b-3xl bg-black px-8 py-3 md:block"
        >
          <ul className="flex items-center gap-8 lg:gap-12">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                {item.external ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="nav-link nav-underline inline-flex min-h-11 items-center text-sm whitespace-nowrap"
                  >
                    {item.label}
                  </a>
                ) : (
                  <a
                    href={item.href}
                    className="nav-link nav-underline inline-flex min-h-11 items-center text-sm whitespace-nowrap"
                  >
                    {item.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute right-0 bottom-0 left-0 z-10 px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-5 md:px-8 md:pb-8">
          <div className="grid grid-cols-12 items-end gap-4 sm:gap-6 md:gap-8">
            <div className="col-span-12 lg:col-span-7">
              <WordsPullUp
                text="Younes"
                showAsterisk
                className="text-[clamp(2.75rem,18vw,7.5rem)] leading-[0.85] font-medium tracking-[-0.07em] text-[#E1E0CC]"
              />
              <motion.p
                initial={reduceMotion ? false : { y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.28, ease: EASE_SOFT }}
                className="font-serif mt-1 text-[clamp(1.75rem,8vw,3.75rem)] text-[#E1E0CC] italic lg:text-right"
              >
                Basir
              </motion.p>
            </div>

            <div className="col-span-12 flex flex-col gap-4 rounded-2xl bg-black/40 p-3.5 backdrop-blur-[2px] sm:gap-5 sm:p-4 lg:col-span-5 lg:bg-transparent lg:p-0 lg:backdrop-blur-none lg:pb-6">
              <motion.div
                initial={reduceMotion ? false : { y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4, ease: EASE_SOFT }}
                className="flex items-center gap-2.5"
              >
                <span className="relative flex h-2 w-2">
                  <span className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                <span className="text-primary/80 text-[10px] tracking-[0.14em] uppercase sm:text-xs sm:tracking-[0.18em]">
                  Open to data internships
                </span>
              </motion.div>

              <motion.p
                initial={reduceMotion ? false : { y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.52, ease: EASE_SOFT }}
                className="text-primary/75 max-w-md text-[13px] leading-relaxed sm:text-sm sm:text-base"
              >
                Third-year Software Engineering student and aspiring data analyst. I turn data into
                insights and build web applications that solve real problems.
              </motion.p>

              <motion.div
                initial={reduceMotion ? false : { y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.68, ease: EASE_SOFT }}
                className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3"
              >
                <motion.a
                  href="#projects"
                  style={primary.style}
                  onMouseMove={primary.onMouseMove}
                  onMouseLeave={primary.onMouseLeave}
                  className="bg-primary inline-flex min-h-11 w-full items-center justify-center rounded-full px-5 text-sm font-medium text-black sm:w-auto sm:text-base"
                >
                  View my work
                </motion.a>
                <motion.a
                  href="#contact"
                  style={secondary.style}
                  onMouseMove={secondary.onMouseMove}
                  onMouseLeave={secondary.onMouseLeave}
                  className="text-primary inline-flex min-h-11 w-full items-center justify-center rounded-full border border-white/15 px-5 py-2.5 text-sm transition-colors hover:border-primary/50 sm:w-auto"
                >
                  Get in touch
                </motion.a>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
