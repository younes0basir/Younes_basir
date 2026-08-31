import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Toast from "./Toast.tsx";
import WordsPullUpMultiStyle from "./WordsPullUpMultiStyle.tsx";
import { useMagnetic } from "../hooks/useMagnetic.ts";
import { EASE_SOFT } from "../lib/motion.ts";
import { EMAIL, SOCIALS } from "../lib/site.ts";

export default function Contact() {
  const reduceMotion = useReducedMotion();
  const [copied, setCopied] = useState(false);
  const emailCta = useMagnetic(0.2);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  };

  return (
    <section id="contact" className="bg-black px-3 py-16 sm:px-4 sm:py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-6xl rounded-2xl bg-[#101010] px-4 py-12 sm:px-5 sm:py-16 md:rounded-[2rem] md:px-12 md:py-24">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-7">
            <p className="text-primary text-xs tracking-[0.2em] uppercase">Contact</p>
            <WordsPullUpMultiStyle
              className="mt-6 text-left text-[clamp(1.65rem,6vw,3.75rem)] leading-[0.95] text-[#E1E0CC]"
              segments={[
                { text: "Have a role or project in mind?", className: "font-normal" },
                { text: "Let's talk.", className: "font-serif italic", newline: true },
              ]}
            />
            <motion.p
              initial={reduceMotion ? false : { y: 16, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: 0.3, ease: EASE_SOFT }}
              className="mt-6 max-w-md text-sm leading-relaxed text-gray-400 sm:text-base"
            >
              I&apos;m currently seeking a data internship — send me a message and I&apos;ll reply
              within 24 hours.
            </motion.p>
          </div>

          <motion.div
            initial={reduceMotion ? false : { y: 16, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.4, ease: EASE_SOFT }}
            className="flex flex-col gap-5 sm:gap-6 lg:col-span-5 lg:items-end"
          >
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center lg:justify-end">
              <a
                href={`mailto:${EMAIL}`}
                className="font-serif break-all text-lg text-[#E1E0CC] italic transition-opacity hover:opacity-70 sm:break-normal sm:text-2xl md:text-3xl"
              >
                {EMAIL}
              </a>
              <button
                type="button"
                onClick={copyEmail}
                className="inline-flex min-h-11 w-full shrink-0 items-center justify-center rounded-full border border-white/10 px-4 text-sm text-gray-400 transition-colors hover:border-primary/40 hover:text-[#E1E0CC] sm:w-auto"
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </div>

            <div className="flex w-full flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3 lg:justify-end">
              <motion.a
                href={`mailto:${EMAIL}`}
                style={emailCta.style}
                onMouseMove={emailCta.onMouseMove}
                onMouseLeave={emailCta.onMouseLeave}
                className="bg-primary inline-flex min-h-11 w-full items-center justify-center rounded-full px-5 text-sm font-medium text-black sm:w-auto"
              >
                Email me
              </motion.a>

              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary inline-flex min-h-11 w-full items-center justify-center rounded-full border border-white/10 px-5 py-2.5 text-sm transition-colors hover:border-primary/40 sm:w-auto"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      <Toast message="Email copied to clipboard" visible={copied} />
    </section>
  );
}
