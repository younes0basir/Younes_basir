import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import FlipCard from "./FlipCard.tsx";
import MediaPreview from "./MediaPreview.tsx";
import WordsPullUpMultiStyle from "./WordsPullUpMultiStyle.tsx";
import { useGallery } from "../hooks/useGallery.ts";
import { GALLERY_EVENT_TYPES, galleryEventLabel } from "../lib/gallery-events.ts";
import { resolveMainImagePublicId } from "../types/media.ts";
import type { GalleryRecord } from "../types/gallery.ts";
import { EASE_SOFT } from "../lib/motion.ts";

type FilterType = (typeof GALLERY_EVENT_TYPES)[number] | "all";

function formatDate(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function GalleryFront({ item, stacked, onView }: { item: GalleryRecord; stacked?: boolean; onView?: () => void }) {
  const mainImage = resolveMainImagePublicId(item);

  return (
    <>
      {mainImage ? (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 transition-transform duration-[1200ms] ease-out group-hover:scale-110">
            <MediaPreview
              publicId={mainImage}
              alt={item.title}
              className="absolute inset-0 h-full w-full object-cover"
              frame={item.imageFrame}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-90" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-[#101010] to-black" />
      )}

      <motion.span
        initial={{ opacity: 0, y: -8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="absolute top-3 left-3 z-10 rounded-full bg-black/70 px-2.5 py-1 text-[10px] tracking-[0.16em] text-[#E1E0CC] uppercase backdrop-blur-sm"
      >
        {galleryEventLabel(item.eventType)}
      </motion.span>

      <div className="flip-card-front-overlay" />
      <div className="flip-card-title">
        <h3 className="text-xl font-medium text-[#E1E0CC] sm:text-2xl">{item.title}</h3>
        <p className="mt-1 text-xs tracking-wide text-gray-400">
          {formatDate(item.date)} · {item.location}
        </p>
        {stacked ? null : <p className="flip-card-hint">Hover or tap to flip</p>}
        {onView ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onView();
            }}
            className="mt-3 inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-[11px] tracking-wide text-[#E1E0CC] backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            View
            <span aria-hidden="true">↗</span>
          </button>
        ) : null}
      </div>
    </>
  );
}

function GalleryBack({ item, stacked, onView }: { item: GalleryRecord; stacked?: boolean; onView?: () => void }) {
  return (
    <div
      className={`flex flex-col p-5 text-left sm:p-6 ${stacked ? "" : "h-full overflow-y-auto"}`}
    >
      <p className="text-[10px] tracking-[0.2em] text-primary uppercase">
        {galleryEventLabel(item.eventType)}
      </p>
      <h3 className="mt-2 font-serif text-2xl text-[#E1E0CC] italic">{item.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-400">{item.description}</p>
      <div className="mt-4 flex flex-wrap gap-3 border-t border-white/10 pt-4 text-xs text-gray-500">
        <span>{formatDate(item.date)}</span>
        <span>{item.location}</span>
      </div>
      {onView ? (
        <button
          type="button"
          onClick={onView}
          className="mt-4 inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-black"
        >
          Open lightbox
        </button>
      ) : null}
    </div>
  );
}

function Lightbox({ item, onClose }: { item: GalleryRecord; onClose: () => void }) {
  const reduceMotion = useReducedMotion();
  const images = item.imagePublicIds.length ? item.imagePublicIds : [resolveMainImagePublicId(item)].filter(Boolean) as string[];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIdx((v) => (v + 1) % images.length);
      if (e.key === "ArrowLeft") setIdx((v) => (v - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [images.length, onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="lightbox-backdrop absolute inset-0 bg-black/80" />
      <motion.div
        initial={reduceMotion ? undefined : { scale: 0.96, y: 12, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={reduceMotion ? undefined : { scale: 0.98, opacity: 0 }}
        transition={{ duration: 0.35, ease: EASE_SOFT }}
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[90svh] w-full max-w-3xl flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#0a0a0a] md:rounded-[2rem]"
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-black">
          <AnimatePresence mode="wait">
            <motion.div
              key={images[idx]}
              initial={reduceMotion ? false : { opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-0"
            >
              {images[idx] ? (
                <MediaPreview publicId={images[idx]!} alt={item.title} className="h-full w-full object-cover" frame={item.imageFrame} baseWidth={1400} />
              ) : null}
            </motion.div>
          </AnimatePresence>
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-[#E1E0CC] backdrop-blur-sm hover:bg-black/80"
            aria-label="Close"
          >
            ✕
          </button>
          {images.length > 1 ? (
            <>
              <button
                type="button"
                onClick={() => setIdx((v) => (v - 1 + images.length) % images.length)}
                className="absolute top-1/2 left-3 z-10 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-[#E1E0CC] backdrop-blur-sm"
                aria-label="Previous"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => setIdx((v) => (v + 1) % images.length)}
                className="absolute top-1/2 right-3 z-10 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-[#E1E0CC] backdrop-blur-sm"
                aria-label="Next"
              >
                ›
              </button>
              <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
                {images.map((_, i) => (
                  <span key={i} className={`h-1 rounded-full transition-all ${i === idx ? "w-6 bg-primary" : "w-1.5 bg-white/50"}`} />
                ))}
              </div>
            </>
          ) : null}
        </div>
        <div className="p-6">
          <p className="text-[11px] tracking-[0.18em] text-primary uppercase">{galleryEventLabel(item.eventType)}</p>
          <h3 className="mt-2 font-serif text-2xl text-[#E1E0CC] italic">{item.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-gray-400">{item.description}</p>
          <p className="mt-4 text-xs text-gray-500">
            {formatDate(item.date)} · {item.location}
          </p>
          {images.length > 1 ? (
            <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar">
              {images.map((pid, i) => (
                <button
                  key={pid}
                  onClick={() => setIdx(i)}
                  className={`h-14 w-20 shrink-0 overflow-hidden rounded-lg border ${i === idx ? "border-primary" : "border-white/10"}`}
                >
                  <MediaPreview publicId={pid} alt="" className="h-full w-full object-cover" frame="square" thumbnail />
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Gallery() {
  const reduceMotion = useReducedMotion();
  const { items, isLoading } = useGallery();
  const [filter, setFilter] = useState<FilterType>("all");
  const [lightbox, setLightbox] = useState<GalleryRecord | null>(null);

  const filtered = filter === "all" ? items : items.filter((i) => i.eventType === filter);

  return (
    <section id="gallery" className="relative overflow-hidden bg-black px-3 py-16 sm:px-4 sm:py-20 md:px-8 md:py-28">
      <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.12]" />
      {!reduceMotion ? (
        <>
          <div className="pointer-events-none absolute -top-32 right-0 h-[480px] w-[480px] rounded-full bg-primary/5 blur-[90px]" />
          <div className="pointer-events-none absolute bottom-0 left-1/4 h-[420px] w-[520px] rounded-full bg-[#E1E0CC]/5 blur-[90px]" />
        </>
      ) : null}

      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: EASE_SOFT }}
          className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <WordsPullUpMultiStyle
            className="max-w-xl text-left text-[clamp(1.5rem,5.5vw,2.25rem)] font-normal sm:text-3xl md:text-4xl"
            segments={[
              { text: "Hackathons, meetups, and time outdoors.", className: "text-[#E1E0CC]" },
            ]}
          />
          <p className="max-w-xs text-sm leading-relaxed text-gray-400 md:text-right">
            Moments from events I joined — building with teams and learning outside the classroom.
          </p>
        </motion.div>

        {/* filter chips with layout animation */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-8 flex gap-2 overflow-x-auto pb-1 no-scrollbar sm:flex-wrap sm:overflow-visible"
          role="tablist"
          aria-label="Filter gallery"
        >
          {(["all", ...GALLERY_EVENT_TYPES] as FilterType[]).map((type) => {
            const active = filter === type;
            const label = type === "all" ? "All" : galleryEventLabel(type as any);
            const count = type === "all" ? items.length : items.filter((i) => i.eventType === type).length;
            return (
              <motion.button
                key={type}
                type="button"
                role="tab"
                aria-selected={active}
                whileHover={reduceMotion ? undefined : { scale: 1.04, y: -1 }}
                whileTap={reduceMotion ? undefined : { scale: 0.96 }}
                onClick={() => setFilter(type)}
                className={`relative inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-xs tracking-wide uppercase transition-colors sm:px-4 ${
                  active ? "border-primary/40 bg-primary text-black" : "border-white/10 bg-white/[0.03] text-gray-400 hover:border-white/20 hover:text-[#E1E0CC]"
                }`}
              >
                {active && !reduceMotion ? (
                  <motion.span layoutId="gallery-filter" className="absolute inset-0 rounded-full bg-primary" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
                ) : null}
                <span className="relative">{label}</span>
                <span className={`relative rounded-full px-1.5 py-0.5 text-[10px] ${active ? "bg-black/15 text-black" : "bg-white/10 text-gray-400"}`}>{count}</span>
              </motion.button>
            );
          })}
        </motion.div>

        {isLoading ? (
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((key) => (
              <div
                key={key}
                className="h-[22rem] animate-pulse rounded-[1.5rem] bg-[#212121] sm:h-[24rem] md:rounded-[2rem]"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-12 rounded-[1.5rem] border border-dashed border-white/10 bg-[#101010] bg-clip-padding px-6 py-12 text-center text-sm text-gray-500 md:rounded-[2rem]"
          >
            No entries for this filter.
          </motion.p>
        ) : items.length === 0 ? (
          <p className="mt-12 rounded-[1.5rem] border border-dashed border-[#101010] bg-[#101010] bg-clip-padding px-6 py-12 text-center text-sm text-gray-500 md:rounded-[2rem]">
            Gallery entries will appear here once added from the{" "}
            <a href="/admin" className="text-primary underline-offset-4 hover:underline">
              admin space
            </a>
            .
          </p>
        ) : (
          <motion.div layout className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout={!reduceMotion}
                  initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: 12, scale: 0.96 }}
                  transition={{
                    duration: 0.55,
                    ease: EASE_SOFT,
                    delay: reduceMotion ? 0 : index * 0.06,
                    layout: { duration: 0.4, ease: EASE_SOFT },
                  }}
                  className="gallery-grid-card"
                >
                  <FlipCard
                    title={item.title}
                    index={index}
                    front={<GalleryFront item={item} stacked={Boolean(reduceMotion)} onView={() => setLightbox(item)} />}
                    back={<GalleryBack item={item} stacked={Boolean(reduceMotion)} onView={() => setLightbox(item)} />}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <AnimatePresence>{lightbox ? <Lightbox item={lightbox} onClose={() => setLightbox(null)} /> : null}</AnimatePresence>
    </section>
  );
}
