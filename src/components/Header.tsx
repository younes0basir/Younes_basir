import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useActiveSection } from "../hooks/useActiveSection.ts";
import { NAV_ITEMS } from "../lib/site.ts";

function NavAnchor({
  item,
  className,
  current,
  onClick,
}: {
  item: (typeof NAV_ITEMS)[number];
  className: string;
  current?: boolean;
  onClick?: () => void;
}) {
  const currentAttr = !item.external && current ? true : undefined;

  if (item.external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noreferrer"
        className={className}
        onClick={onClick}
      >
        {item.label}
      </a>
    );
  }

  return (
    <a href={item.href} className={className} aria-current={currentAttr} onClick={onClick}>
      {item.label}
    </a>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const activeId = useActiveSection();
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.55);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const root = overlayRef.current;
    const focusables = root
      ? Array.from(root.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'))
      : [];

    focusables[0]?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        return;
      }

      if (event.key !== "Tab" || focusables.length === 0) {
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 right-0 left-0 z-[60] h-[2px] origin-left bg-primary"
        style={{ scaleX: scrollYProgress }}
      />

      <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
        <div
          className={`flex h-16 items-center justify-between px-5 transition-[background-color,border-color,backdrop-filter] duration-300 md:h-[4.25rem] md:px-10 ${
            scrolled
              ? "pointer-events-auto border-b border-white/5 bg-black/80 backdrop-blur-md"
              : ""
          }`}
        >
          <a
            href="#top"
            className={`text-sm tracking-wide text-[#E1E0CC] transition-opacity duration-300 ${
              scrolled ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            Younes Basir
          </a>

          <nav
            aria-label="Primary"
            className={`hidden items-center gap-8 md:flex ${
              scrolled ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            {NAV_ITEMS.map((item) => (
              <NavAnchor
                key={item.label}
                item={item}
                current={item.href === `#${activeId}`}
                className="nav-link nav-underline inline-flex min-h-11 items-center text-sm"
              />
            ))}
          </nav>

          <button
            type="button"
            className="pointer-events-auto inline-flex min-h-11 items-center rounded-full border border-white/10 bg-black/50 px-4 text-sm text-[#E1E0CC] md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            ref={overlayRef}
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 flex flex-col justify-end bg-black px-6 pt-24 pb-12 md:hidden"
          >
            <p className="mb-8 text-xs tracking-[0.2em] text-gray-500 uppercase">Younes Basir</p>
            <nav className="flex flex-col gap-2">
              {NAV_ITEMS.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ y: 16, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.05 * index, duration: 0.35 }}
                >
                  <NavAnchor
                    item={item}
                    current={item.href === `#${activeId}`}
                    className="flex min-h-12 items-center text-3xl text-[#E1E0CC]"
                    onClick={() => setMenuOpen(false)}
                  />
                </motion.div>
              ))}
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
