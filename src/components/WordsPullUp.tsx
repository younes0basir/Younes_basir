import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { EASE_SOFT, pullUpDelay } from "../lib/motion.ts";

type WordsPullUpProps = {
  text: string;
  className?: string;
  showAsterisk?: boolean;
};

export default function WordsPullUp({ text, className = "", showAsterisk = false }: WordsPullUpProps) {
  const words = text.split(" ");
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const reduceMotion = useReducedMotion();

  return (
    <div ref={ref} className={className}>
      {words.map((word, i) => {
        const isLastWord = i === words.length - 1;
        const showOnThisWord = showAsterisk && isLastWord;

        return (
          <motion.span
            key={`${word}-${i}`}
            initial={reduceMotion ? false : { y: 20, opacity: 0 }}
            animate={reduceMotion || isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.45, delay: pullUpDelay(i), ease: EASE_SOFT }}
            className="inline-block"
          >
            {showOnThisWord ? (
              <>
                {word.slice(0, -1)}
                <span className="relative inline-block">
                  {word.slice(-1)}
                  <span className="absolute top-[0.65em] -right-[0.3em] text-[0.31em]">*</span>
                </span>
              </>
            ) : (
              word
            )}
            {!isLastWord && "\u00A0"}
          </motion.span>
        );
      })}
    </div>
  );
}
