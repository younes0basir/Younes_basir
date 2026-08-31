import { AnimatePresence, motion } from "framer-motion";
import { EASE_SOFT } from "../lib/motion.ts";

type ToastProps = {
  message: string;
  visible: boolean;
};

export default function Toast({ message, visible }: ToastProps) {
  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          role="status"
          aria-live="polite"
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 12, opacity: 0 }}
          transition={{ duration: 0.28, ease: EASE_SOFT }}
          className="pointer-events-none fixed bottom-6 left-1/2 z-[70] flex -translate-x-1/2 items-center rounded-full border border-white/10 bg-[#101010] px-4 py-2.5 text-sm text-[#E1E0CC] shadow-lg"
        >
          {message}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
