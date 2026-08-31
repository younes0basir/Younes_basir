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
    <section id="top" className="min-h-svh p-4 md:h-screen md:p-6">
      <div
        ref={frameRef}
        onPointerMove={onPointerMove}
        className="relative min-h-[calc(100svh-2rem)] w-full overflow-hidden rounded-2xl md:h-full md:min-h-0 md:rounded-[2rem]"
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

        <div className="absolute right-0 bottom-0 left-0 z-10 px-5 pb-6 md:px-8 md:pb-8">
          <div className="grid grid-cols-12 items-end gap-6 md:gap-8">
            <div className="col-span-12 lg:col-span-7">
              <WordsPullUp
                text="Younes"
                showAsterisk
                className="text-[24vw] leading-[0.85] font-medium tracking-[-0.07em] text-[#E1E0CC] sm:text-[22vw] md:text-[18vw] lg:text-[15vw] xl:text-[14vw]"
              />
              <motion.p
                initial={reduceMotion ? false : { y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.28, ease: EASE_SOFT }}
                className="font-serif mt-1 text-4xl text-[#E1E0CC] italic sm:text-5xl md:text-6xl lg:text-right"
              >
                Basir
              </motion.p>
            </div>

            <div className="col-span-12 flex flex-col gap-5 rounded-2xl bg-black/40 p-4 backdrop-blur-[2px] lg:col-span-5 lg:bg-transparent lg:p-0 lg:backdrop-blur-none lg:pb-6">
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
                <span className="text-primary/80 text-xs tracking-[0.18em] uppercase">
                  Open to data internships
                </span>
              </motion.div>

              <motion.p
                initial={reduceMotion ? false : { y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.52, ease: EASE_SOFT }}
                className="text-primary/75 max-w-md text-sm leading-relaxed sm:text-base"
              >
                Third-year Software Engineering student and aspiring data analyst. I turn data into
                insights and build web applications that solve real problems.
              </motion.p>

              <motion.div
                initial={reduceMotion ? false : { y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.68, ease: EASE_SOFT }}
                className="flex flex-wrap items-center gap-3"
              >
                <motion.a
                  href="#projects"
                  style={primary.style}
                  onMouseMove={primary.onMouseMove}
                  onMouseLeave={primary.onMouseLeave}
                  className="bg-primary inline-flex min-h-11 items-center rounded-full px-5 text-sm font-medium text-black sm:text-base"
                >
                  View my work
                </motion.a>
                <motion.a
                  href="#contact"
                  style={secondary.style}
                  onMouseMove={secondary.onMouseMove}
                  onMouseLeave={secondary.onMouseLeave}
                  className="text-primary inline-flex min-h-11 items-center rounded-full border border-white/15 px-5 py-2.5 text-sm transition-colors hover:border-primary/50"
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
