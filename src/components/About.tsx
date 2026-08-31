import { useRef } from "react";
import type { MotionValue } from "framer-motion";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import portraitFallback from "../assets/younesbgr.png";
import MediaPreview from "./MediaPreview.tsx";
import WordsPullUpMultiStyle from "./WordsPullUpMultiStyle.tsx";
import { cloudinaryConfigured } from "../lib/cloudinary.ts";
import { EASE_SOFT } from "../lib/motion.ts";
import { ABOUT_PORTRAIT_PUBLIC_ID, SKILL_GROUPS, TIMELINE } from "../lib/site.ts";

const BODY_TEXT =
  "Over three years of Software Engineering I have shipped three live projects — an e-learning platform, a hardware storefront, and a medical appointment system — while completing more than five data analysis courses and holding a GPA above 3.5. Right now I am deepening my work in data analysis with Python, SQL querying, and turning results into stories people can act on.";

const STATS = [
  { value: "3", label: "Live projects" },
  { value: "5+", label: "Data courses" },
  { value: "3.5+", label: "GPA / 4.0" },
];

const FOCUS = ["Frontend", "Backend", "Data"];

const MASTERING = [
  "Data Analysis with Python",
  "SQL for Data Querying",
  "Data Visualization & Storytelling",
];

type AnimatedLetterProps = {
  char: string;
  index: number;
  totalChars: number;
  progress: MotionValue<number>;
};

function AnimatedLetter({ char, index, totalChars, progress }: AnimatedLetterProps) {
  const charProgress = index / totalChars;
  const opacity = useTransform(progress, [charProgress - 0.1, charProgress + 0.05], [0.45, 1]);

  return <motion.span style={{ opacity }}>{char}</motion.span>;
}

function AboutPortrait({ reduceMotion }: { reduceMotion: boolean | null }) {
  const imageClassName = "about-portrait-image";

  const image = cloudinaryConfigured ? (
    <MediaPreview
      publicId={ABOUT_PORTRAIT_PUBLIC_ID}
      alt="Younes Basir, wearing a navy blazer and glasses"
      frame="original"
      baseWidth={720}
      className={imageClassName}
    />
  ) : (
    <img
      src={portraitFallback}
      alt="Younes Basir, wearing a navy blazer and glasses"
      className={imageClassName}
      loading="lazy"
    />
  );

  return (
    <motion.figure
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, ease: EASE_SOFT }}
      className="about-portrait mx-auto w-full max-w-[10.5rem] lg:mx-0"
    >
      <div className="about-portrait-frame">
        <div className="about-portrait-glow" aria-hidden="true" />
        {image}
      </div>
      <figcaption className="mt-3 text-center text-[11px] tracking-[0.16em] text-gray-500 uppercase lg:text-left">
        Younes Basir
      </figcaption>
    </motion.figure>
  );
}

export default function About() {
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: paragraphRef,
    offset: ["start 0.8", "end 0.2"],
  });

  const chars = BODY_TEXT.split("");

  return (
    <section id="about" className="bg-black px-4 py-20 md:px-8 md:py-32">
      <div className="mx-auto max-w-6xl rounded-2xl bg-[#101010] px-5 py-14 md:rounded-[2rem] md:px-12 md:py-20 lg:px-16 lg:py-24">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_11.5rem] lg:gap-x-14">
          <div className="order-1">
            <p className="text-primary text-xs tracking-[0.2em] uppercase">About</p>
            <WordsPullUpMultiStyle
              className="mt-5 max-w-xl text-left text-3xl leading-[0.95] text-[#E1E0CC] sm:text-4xl md:text-5xl lg:text-[3.25rem]"
              segments={[
                { text: "I am Younes Basir,", className: "font-normal" },
                { text: "an aspiring data analyst.", className: "font-serif italic", newline: true },
              ]}
            />
            <div className="mt-8 flex flex-wrap gap-2">
              {FOCUS.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 px-3 py-1.5 text-xs tracking-wide text-gray-400 uppercase"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <aside className="order-2 flex flex-col gap-8 lg:sticky lg:top-24 lg:row-span-2">
            <AboutPortrait reduceMotion={reduceMotion} />
            <ol className="space-y-5 border-l border-white/10 pl-5">
              {TIMELINE.map((item, i) => (
                <motion.li
                  key={item.label}
                  initial={reduceMotion ? false : { y: 12, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: EASE_SOFT }}
                  className="relative"
                >
                  <span className="absolute top-1.5 -left-[1.44rem] h-2 w-2 rounded-full bg-primary" />
                  <p className="text-[11px] tracking-[0.18em] text-gray-500 uppercase">{item.label}</p>
                  <p className="mt-1 text-sm text-[#E1E0CC] sm:text-base">{item.title}</p>
                  <p className="mt-0.5 text-sm text-gray-500">{item.detail}</p>
                </motion.li>
              ))}
            </ol>
          </aside>

          <div className="order-3">
            <p
              ref={paragraphRef}
              aria-label={BODY_TEXT}
              className="max-w-xl text-left text-sm leading-relaxed text-[#DEDBC8] sm:text-base md:text-lg"
            >
              {reduceMotion ? (
                BODY_TEXT
              ) : (
                <span aria-hidden="true">
                  {chars.map((char, i) => (
                    <AnimatedLetter
                      key={`${char}-${i}`}
                      char={char}
                      index={i}
                      totalChars={chars.length}
                      progress={scrollYProgress}
                    />
                  ))}
                </span>
              )}
            </p>

            <div className="mt-10">
              <p className="text-xs tracking-[0.18em] text-gray-500 uppercase">Currently mastering</p>
              <ul className="mt-3 flex flex-col gap-2">
                {MASTERING.map((item) => (
                  <li
                    key={item}
                    className="border-primary/40 text-sm text-[#E1E0CC] sm:text-base"
                    style={{ borderLeftWidth: 2, paddingLeft: 14 }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-3 sm:grid-cols-3">
          {SKILL_GROUPS.map((group, i) => (
            <motion.article
              key={group.title}
              initial={reduceMotion ? false : { y: 16, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: EASE_SOFT }}
              className="rounded-2xl border border-white/5 bg-black/30 p-5 transition-colors duration-300 hover:border-primary/25"
            >
              <h3 className="text-xs tracking-[0.18em] text-gray-500 uppercase">{group.title}</h3>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-[#E1E0CC]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-3 gap-4 border-t border-white/5 pt-10">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={reduceMotion ? false : { y: 16, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: EASE_SOFT }}
            >
              <p className="font-serif text-3xl text-[#E1E0CC] italic sm:text-4xl md:text-5xl">
                {stat.value}
              </p>
              <p className="mt-2 text-xs tracking-wide text-gray-400 uppercase">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
