import { Fragment, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { EASE_SOFT, pullUpDelay } from "../lib/motion.ts";

export type StyledSegment = {
  text: string;
  className?: string;
  newline?: boolean;
};

type StyledWord = {
  word: string;
  className: string;
  newline: boolean;
};

type WordsPullUpMultiStyleProps = {
  segments: StyledSegment[];
  className?: string;
};

function toWords(segments: StyledSegment[]): StyledWord[] {
  return segments.flatMap((segment) =>
    segment.text
      .split(" ")
      .filter(Boolean)
      .map((word, wordIndex) => ({
        word,
        className: segment.className ?? "",
        newline: Boolean(segment.newline) && wordIndex === 0,
      })),
  );
}

export default function WordsPullUpMultiStyle({
  segments,
  className = "",
}: WordsPullUpMultiStyleProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const reduceMotion = useReducedMotion();
  const words = toWords(segments);

  return (
    <div ref={ref} className={className}>
      {words.map((item, index) => (
        <Fragment key={`${item.word}-${index}`}>
          {item.newline ? <br /> : null}
          <motion.span
            initial={reduceMotion ? false : { y: 16, opacity: 0 }}
            animate={reduceMotion || isInView ? { y: 0, opacity: 1 } : undefined}
            transition={{ duration: 0.45, delay: pullUpDelay(index), ease: EASE_SOFT }}
            className={`inline-block ${item.className}`}
          >
            {item.word}
            {"\u00A0"}
          </motion.span>
        </Fragment>
      ))}
    </div>
  );
}
