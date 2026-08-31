import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { useState, type ReactNode } from "react";

type FlipCardProps = {
  title: string;
  front: ReactNode;
  back: ReactNode;
  className?: string;
  heightClass?: string;
  index?: number;
};

export default function FlipCard({
  title,
  front,
  back,
  className = "",
  heightClass = "h-[20rem] sm:h-[22rem] md:h-[24rem]",
  index = 0,
}: FlipCardProps) {
  const [flipped, setFlipped] = useState(false);
  const reduceMotion = useReducedMotion();

  // Tilt for desktop
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-40, 40], [5, -5]), { stiffness: 120, damping: 18 });
  const ry = useSpring(useTransform(mx, [-40, 40], [-6, 6]), { stiffness: 120, damping: 18 });

  const handleMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (reduceMotion || flipped) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - rect.left - rect.width / 2);
    my.set(e.clientY - rect.top - rect.height / 2);
  };
  const handleLeave = () => {
    mx.set(0);
    my.set(0);
  };

  if (reduceMotion) {
    return (
      <article
        className={`overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#101010] md:rounded-[2rem] ${className}`}
      >
        <div className="relative aspect-[4/5] overflow-hidden">{front}</div>
        <div className="border-t border-white/10">{back}</div>
      </article>
    );
  }

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6 }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`flip-card group ${flipped ? "is-flipped" : ""} ${heightClass} ${className}`}
      onClick={() => setFlipped((value) => !value)}
      aria-pressed={flipped}
      aria-label={`${flipped ? "Hide" : "Show"} details for ${title}`}
      style={flipped ? undefined : { rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" } as any}
    >
      <div className="flip-card-inner">
        <div className="flip-card-front overflow-hidden">
          {front}
          <span className="shine-sweep" aria-hidden="true" />
          <span className="pointer-events-none absolute inset-0 rounded-[inherit] border border-white/0 transition-colors duration-300 group-hover:border-white/10" />
          <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: "radial-gradient(300px circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,0.06), transparent 60%)" }} />
        </div>
        <div className="flip-card-back">{back}</div>
      </div>
    </motion.button>
  );
}
