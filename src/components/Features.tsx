import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowUpRight, Check, ChevronLeft, ChevronRight, CodeXml, ExternalLink, Grid3x3, Layers, Maximize2, Pause, Play } from "lucide-react";
import MediaPreview from "./MediaPreview.tsx";
import WordsPullUpMultiStyle from "./WordsPullUpMultiStyle.tsx";
import { useMagnetic } from "../hooks/useMagnetic.ts";
import { useProjects } from "../hooks/useProjects.ts";
import { EASE_SOFT } from "../lib/motion.ts";
import { frameObjectClass, resolveMainImagePublicId } from "../types/media.ts";
import type { ProjectCard } from "../types/project.ts";

const AUTOPLAY_MS = 7000;
const SWIPE_PX = 56;

function externalHref(value?: string): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function useMediaBaseWidth() {
  const [width, setWidth] = useState(800);
  useEffect(() => {
    const update = () => {
      const v = window.innerWidth;
      if (v >= 1280) setWidth(1600);
      else if (v >= 768) setWidth(1200);
      else setWidth(900);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return width;
}

function StatusBadge({ live }: { live: boolean }) {
  if (live) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium tracking-[0.14em] text-emerald-400 uppercase backdrop-blur-sm">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.7)] motion-safe:animate-pulse" aria-hidden="true" />
        Live
      </span>
    );
  }
  return (
    <span className="rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-[10px] tracking-[0.14em] text-gray-400 uppercase backdrop-blur-sm">Soon</span>
  );
}

function ProjectCover({ card, publicId, baseWidth, isHovered }: { card: ProjectCard; publicId: string; baseWidth: number; isHovered?: boolean }) {
  if (publicId) {
    return (
      <div className="absolute inset-0 h-full w-full overflow-hidden">
        <div className={`absolute inset-0 transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${isHovered ? "scale-[1.07]" : "scale-100"}`}>
          <MediaPreview publicId={publicId} alt={`${card.title} preview`} className={`absolute inset-0 h-full w-full ${frameObjectClass(card.imageFrame)}`} frame={card.imageFrame} baseWidth={baseWidth} />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: "radial-gradient(600px circle at 50% 120%, rgba(222,219,200,0.10), transparent 60%)" }} />
      </div>
    );
  }
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-[#222] via-[#121212] to-black">
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-20" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="font-serif text-2xl text-[#E1E0CC] italic sm:text-3xl">{card.title}</p>
        <p className="text-[11px] tracking-[0.16em] text-gray-500 uppercase">{card.category}</p>
      </div>
    </div>
  );
}

function ProjectsSkeleton() {
  return (
    <div className="mt-10 grid gap-6 lg:grid-cols-12">
      <div className="lg:col-span-8 aspect-[16/10] animate-pulse rounded-[2rem] bg-white/[0.06] border border-white/5" />
      <div className="lg:col-span-4 space-y-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-[5.5rem] animate-pulse rounded-2xl bg-white/[0.04] border border-white/5" />
        ))}
      </div>
    </div>
  );
}

function ProjectLightbox({ card, startIndex, onClose }: { card: ProjectCard; startIndex: number; onClose: () => void }) {
  const reduceMotion = useReducedMotion();
  const images = card.imagePublicIds.length ? card.imagePublicIds : [resolveMainImagePublicId(card)].filter(Boolean) as string[];
  const [idx, setIdx] = useState(startIndex);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e as unknown as globalThis.KeyboardEvent).key === "Escape") onClose();
      if ((e as unknown as globalThis.KeyboardEvent).key === "ArrowRight") setIdx((v) => (v + 1) % images.length);
      if ((e as unknown as globalThis.KeyboardEvent).key === "ArrowLeft") setIdx((v) => (v - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey as any);
    return () => window.removeEventListener("keydown", onKey as any);
  }, [images.length, onClose]);
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="lightbox-backdrop absolute inset-0 bg-black/85" />
      <motion.div
        initial={reduceMotion ? undefined : { scale: 0.97, y: 10, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={reduceMotion ? undefined : { scale: 0.98, opacity: 0 }}
        transition={{ duration: 0.35, ease: EASE_SOFT }}
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[92svh] w-full max-w-5xl flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0a0a0a]"
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-black">
          <AnimatePresence mode="wait">
            <motion.div key={images[idx]} initial={reduceMotion ? false : { opacity: 0, scale: 1.02 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="absolute inset-0">
              {images[idx] ? <MediaPreview publicId={images[idx]!} alt={card.title} className="h-full w-full object-cover" frame={card.imageFrame} baseWidth={1600} /> : null}
            </motion.div>
          </AnimatePresence>
          <button type="button" onClick={onClose} className="absolute top-4 right-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md hover:bg-black/75">✕</button>
          {images.length > 1 ? (
            <>
              <button type="button" onClick={() => setIdx((v) => (v - 1 + images.length) % images.length)} className="absolute left-3 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md"><ChevronLeft className="h-5 w-5" /></button>
              <button type="button" onClick={() => setIdx((v) => (v + 1) % images.length)} className="absolute right-3 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md"><ChevronRight className="h-5 w-5" /></button>
              <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
                {images.map((_, i) => (
                  <span key={i} className={`h-1 rounded-full transition-all ${i === idx ? "w-7 bg-primary" : "w-1.5 bg-white/50"}`} />
                ))}
              </div>
            </>
          ) : null}
        </div>
        <div className="flex items-center justify-between gap-4 border-t border-white/5 bg-[#101010] px-6 py-4">
          <div className="min-w-0">
            <p className="text-[11px] tracking-[0.16em] text-primary uppercase">{card.number} · {card.category}</p>
            <p className="truncate font-medium text-[#E1E0CC]">{card.title}</p>
          </div>
          <span className="shrink-0 rounded-full bg-white/10 px-2.5 py-1 text-xs text-gray-300">{idx + 1} / {images.length}</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 48 : -48, opacity: 0, scale: 0.985, filter: "blur(4px)" }),
  center: { x: 0, opacity: 1, scale: 1, filter: "blur(0px)" },
  exit: (dir: number) => ({ x: dir > 0 ? -48 : 48, opacity: 0, scale: 0.985, filter: "blur(4px)" }),
};

export default function Features() {
  const { projects, isLoading, isError } = useProjects();
  const reduceMotion = useReducedMotion();
  const liveCta = useMagnetic(0.18);
  const [category, setCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"showcase" | "grid">("showcase");
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [direction, setDirection] = useState(1);
  const [imgDirection, setImgDirection] = useState(1);
  const [cardHovered, setCardHovered] = useState(false);
  const [lightbox, setLightbox] = useState<{ card: ProjectCard; idx: number } | null>(null);
  const paused = userPaused || hoverPaused;
  const railRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const mediaWidth = useMediaBaseWidth();

  const categories = useMemo(() => {
    const set = new Set(projects.map((p) => p.category));
    return ["all", ...Array.from(set)];
  }, [projects]);

  const filtered = useMemo(() => {
    if (category === "all") return projects;
    return projects.filter((p) => p.category === category);
  }, [projects, category]);

  const active = filtered[activeIndex] ?? filtered[0] ?? projects[0];
  const activeImages = active?.imagePublicIds ?? [];
  const activeImageId = activeImages[imageIndex] ?? activeImages[0] ?? "";
  const panelId = "project-panel";
  const liveHref = active ? externalHref(active.href) : undefined;
  const sourceHref = active ? externalHref(active.sourceHref) : undefined;
  const liveCount = projects.filter((p) => Boolean(externalHref(p.href))).length;

  // tilt
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springX = useSpring(mx, { stiffness: 120, damping: 18 });
  const springY = useSpring(my, { stiffness: 120, damping: 18 });
  const rotateX = useTransform(springY, [-50, 50], [3.5, -3.5]);
  const rotateY = useTransform(springX, [-50, 50], [-5, 5]);
  const glareX = useTransform(springX, [-50, 50], ["0%", "100%"]);

  const handleCardMouseMove = (e: React.MouseEvent) => {
    if (reduceMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left - rect.width / 2) * 0.12);
    my.set((e.clientY - rect.top - rect.height / 2) * 0.12);
  };
  const handleCardLeave = () => {
    mx.set(0);
    my.set(0);
    setCardHovered(false);
    setHoverPaused(false);
  };

  // Sync active when filter or projects change
  useEffect(() => {
    setActiveIndex(0);
    setImageIndex(0);
  }, [category, projects.length]);

  useEffect(() => {
    if (!active) return;
    const mainId = resolveMainImagePublicId(active);
    setImageIndex(Math.max(0, active.imagePublicIds.indexOf(mainId)));
  }, [active]);

  // Autoplay on filtered list
  useEffect(() => {
    if (reduceMotion || paused || filtered.length < 2 || viewMode === "grid") return;
    const t = window.setInterval(() => {
      setDirection(1);
      setActiveIndex((c) => (c + 1) % filtered.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(t);
  }, [paused, filtered.length, reduceMotion, viewMode]);

  // Scroll rail to active
  useEffect(() => {
    const rail = railRef.current;
    const btn = rail?.querySelector<HTMLButtonElement>('[aria-selected="true"]');
    if (!rail || !btn) return;
    if (window.innerWidth < 1024) {
      const r = rail.getBoundingClientRect();
      const b = btn.getBoundingClientRect();
      rail.scrollBy({ left: b.left - r.left - (r.width - b.width) / 2, behavior: reduceMotion ? "auto" : "smooth" });
    } else {
      btn.scrollIntoView({ block: "nearest", behavior: reduceMotion ? "auto" : "smooth" });
    }
  }, [activeIndex, reduceMotion]);

  // Keyboard nav: left/right project, up/down image
  const onShowcaseKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") { e.preventDefault(); cycleProject(1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); cycleProject(-1); }
    if (e.key === "ArrowUp") { e.preventDefault(); cycleImage(-1); }
    if (e.key === "ArrowDown") { e.preventDefault(); cycleImage(1); }
  };

  const selectProject = (idx: number) => {
    setDirection(idx > activeIndex ? 1 : -1);
    setActiveIndex(idx);
  };
  const cycleProject = (dir: 1 | -1) => {
    if (filtered.length < 2) return;
    setDirection(dir);
    setActiveIndex((c) => (c + dir + filtered.length) % filtered.length);
  };
  const cycleImage = (dir: 1 | -1) => {
    if (activeImages.length < 2) return;
    setImgDirection(dir);
    setImageIndex((c) => (c + dir + activeImages.length) % activeImages.length);
  };
  const onStagePointerDown = (e: PointerEvent<HTMLDivElement>) => { swipeStart.current = { x: e.clientX, y: e.clientY }; };
  const onStagePointerUp = (e: PointerEvent<HTMLDivElement>) => {
    const s = swipeStart.current; swipeStart.current = null; if (!s) return;
    if (e.target instanceof HTMLElement && e.target.closest("button, a")) return;
    const dx = e.clientX - s.x; const dy = e.clientY - s.y;
    if (Math.abs(dx) < SWIPE_PX || Math.abs(dx) < Math.abs(dy)) return;
    const dir = dx < 0 ? 1 : -1;
    if (activeImages.length > 1) cycleImage(dir as 1 | -1); else cycleProject(dir as 1 | -1);
  };

  return (
    <section id="projects" className="relative overflow-hidden bg-black px-4 py-20 md:px-8 md:py-28">
      <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.14]" />
      <div className="project-glow pointer-events-none absolute inset-0" />
      {!reduceMotion ? (
        <>
          <motion.div aria-hidden="true" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1 }} className="pointer-events-none absolute -top-24 left-1/4 h-[420px] w-[420px] rounded-full bg-primary/[0.06] blur-[80px]" />
          <motion.div aria-hidden="true" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.2 }} className="pointer-events-none absolute -bottom-24 right-0 h-[560px] w-[560px] rounded-full bg-[#E1E0CC]/[0.06] blur-[90px]" />
        </>
      ) : null}

      <div className="relative mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex flex-col gap-6">
          <motion.div initial={reduceMotion ? false : { opacity: 0, y: 18 }} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6, ease: EASE_SOFT }} className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] text-primary uppercase"><span className="h-px w-6 bg-primary/60" /> Selected work <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] normal-case tracking-normal text-gray-300">{filtered.length} case{filtered.length !== 1 ? "s" : ""}</span></p>
              <WordsPullUpMultiStyle className="mt-4 max-w-[18ch] text-left text-[2rem] leading-[0.9] sm:text-4xl md:text-[2.85rem]" segments={[{ text: "Live projects,", className: "text-[#E1E0CC] font-normal" }, { text: "built and shipped end to end.", className: "font-serif italic text-[#E1E0CC]", newline: true }]} />
            </div>
            <div className="max-w-sm space-y-3 md:text-right">
              <p className="text-sm leading-relaxed text-gray-400">{liveCount > 0 ? `${liveCount} live product${liveCount === 1 ? "" : "s"} — tap any card to inspect the build, stack, and highlights.` : "Projects loading from the portfolio database."}</p>
              <p className="hidden items-center justify-end gap-1.5 text-[11px] tracking-wide text-gray-500 md:inline-flex"><Layers className="h-3.5 w-3.5" /> Drag or use ← → to navigate • {filtered.length > 1 ? "Autoplay pauses on hover" : null}</p>
            </div>
          </motion.div>

          {/* Filter + view switcher */}
          <motion.div initial={reduceMotion ? false : { opacity: 0, y: 10 }} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }} className="flex flex-col gap-3 border-y border-white/5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Filter by category">
              {categories.map((cat) => {
                const isActive = category === cat;
                const label = cat === "all" ? "All" : cat;
                const count = cat === "all" ? projects.length : projects.filter((p) => p.category === cat).length;
                return (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setCategory(cat)}
                    className={`relative inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-medium tracking-wide transition-colors ${isActive ? "border-primary bg-primary text-black" : "border-white/10 bg-white/[0.03] text-gray-400 hover:border-white/20 hover:text-[#E1E0CC]"}`}
                  >
                    {isActive && !reduceMotion ? <motion.span layoutId="proj-filter" className="absolute inset-0 rounded-full bg-primary" transition={{ type: "spring", stiffness: 300, damping: 30 }} /> : null}
                    <span className="relative capitalize">{label}</span>
                    <span className={`relative rounded-full px-1.5 py-0.5 text-[10px] leading-none ${isActive ? "bg-black/10 text-black" : "bg-white/10 text-gray-300"}`}>{count}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <div className="inline-flex rounded-full border border-white/10 bg-white/[0.03] p-1 backdrop-blur-sm">
                <button
                  type="button"
                  aria-pressed={viewMode === "showcase"}
                  onClick={() => setViewMode("showcase")}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${viewMode === "showcase" ? "bg-[#E1E0CC] text-black" : "text-gray-400 hover:text-[#E1E0CC]"}`}
                >
                  <Layers className="h-3.5 w-3.5" /> Showcase
                </button>
                <button
                  type="button"
                  aria-pressed={viewMode === "grid"}
                  onClick={() => setViewMode("grid")}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${viewMode === "grid" ? "bg-[#E1E0CC] text-black" : "text-gray-400 hover:text-[#E1E0CC]"}`}
                >
                  <Grid3x3 className="h-3.5 w-3.5" /> Grid
                </button>
              </div>
              {viewMode === "showcase" && filtered.length > 1 && !reduceMotion ? (
                <button
                  type="button"
                  onClick={() => setUserPaused((v) => !v)}
                  aria-pressed={userPaused}
                  className="inline-flex h-8 items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-3 text-xs text-gray-300 backdrop-blur-sm hover:border-white/20 hover:text-white"
                >
                  {userPaused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
                  {userPaused ? "Play" : "Pause"}
                </button>
              ) : null}
            </div>
          </motion.div>
        </div>

        {isError ? <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">Could not reach Appwrite — showing cached project data.</motion.p> : null}

        {isLoading && projects.length === 0 ? (
          <ProjectsSkeleton />
        ) : !active ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-14 rounded-[1.75rem] border border-dashed border-white/10 bg-white/[0.02] px-6 py-16 text-center">
            <p className="text-sm text-gray-400">No projects match “{category}”.</p>
            <button type="button" onClick={() => setCategory("all")} className="mt-3 inline-flex rounded-full bg-primary px-4 py-2 text-sm font-medium text-black">Clear filter</button>
          </motion.div>
        ) : viewMode === "grid" ? (
          <motion.div layout className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project, idx) => {
              const pid = resolveMainImagePublicId(project);
              const live = Boolean(externalHref(project.href));
              return (
                <motion.button
                  key={project.id}
                  type="button"
                  layout={!reduceMotion}
                  initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.45, delay: idx * 0.04, ease: EASE_SOFT }}
                  whileHover={reduceMotion ? undefined : { y: -4 }}
                  onClick={() => { setViewMode("showcase"); setActiveIndex(idx); }}
                  className="group relative flex flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0f0f0f] text-left transition-colors hover:border-white/20"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#111]">
                    {pid ? <MediaPreview publicId={pid} alt={project.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" frame={project.imageFrame} baseWidth={640} /> : <div className="flex h-full items-center justify-center text-gray-600">{project.title}</div>}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute left-3 top-3 flex items-center gap-2">
                      <span className="rounded-full border border-white/15 bg-black/55 px-2.5 py-1 text-[10px] tracking-[0.14em] text-white uppercase backdrop-blur-sm">{project.number} · {project.category}</span>
                      <StatusBadge live={live} />
                    </div>
                    <span className="absolute bottom-3 right-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-black opacity-0 transition-all duration-300 group-hover:opacity-100"><ArrowUpRight className="h-4 w-4" /></span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-serif text-xl leading-tight text-[#E1E0CC] italic">{project.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-400">{project.description}</p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {project.stack.slice(0, 3).map((s) => (
                        <span key={s} className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-1 text-[10px] text-gray-400">{s}</span>
                      ))}
                      {project.stack.length > 3 ? <span className="rounded-full bg-white/10 px-2 py-1 text-[10px] text-gray-300">+{project.stack.length - 3}</span> : null}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        ) : (
          <div
            className="mt-10 outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            tabIndex={0}
            onKeyDown={onShowcaseKeyDown}
            onMouseEnter={() => setHoverPaused(true)}
            onMouseLeave={() => setHoverPaused(false)}
            onFocus={() => setHoverPaused(true)}
            onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setHoverPaused(false); }}
          >
            <div className="grid gap-6 lg:grid-cols-12 lg:items-start lg:gap-7">
              {/* Showcase */}
              <motion.div
                ref={cardRef}
                onMouseMove={handleCardMouseMove}
                onMouseEnter={() => setCardHovered(true)}
                onMouseLeave={handleCardLeave}
                style={reduceMotion ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" } as any}
                initial={reduceMotion ? false : { opacity: 0, y: 22, scale: 0.985 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, ease: EASE_SOFT }}
                id={panelId}
                role="tabpanel"
                aria-labelledby={`project-tab-${active.id}`}
                className="project-card-tilt group order-1 overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0a0a0a] shadow-[0_20px_60px_rgba(0,0,0,0.5)] md:rounded-[2rem] lg:col-span-8"
                onPointerDown={onStagePointerDown}
                onPointerUp={onStagePointerUp}
              >
                <div className="relative aspect-[16/10.2] max-h-[44svh] w-full overflow-hidden bg-[#0e0e0e] lg:max-h-[30rem]">
                  <AnimatePresence mode="wait" custom={imgDirection}>
                    <motion.div key={`${active.id}-${activeImageId}`} custom={imgDirection} variants={reduceMotion ? undefined : slideVariants} initial={reduceMotion ? false : "enter"} animate="center" exit={reduceMotion ? undefined : "exit"} transition={{ duration: 0.5, ease: EASE_SOFT }} className="absolute inset-0 cursor-zoom-in" onClick={() => setLightbox({ card: active, idx: imageIndex })}>
                      <ProjectCover card={active} publicId={activeImageId} baseWidth={mediaWidth} isHovered={cardHovered} />
                    </motion.div>
                  </AnimatePresence>

                  <div className="shine-sweep" aria-hidden="true" />
                  {!reduceMotion ? <motion.div aria-hidden="true" style={{ x: glareX }} className="pointer-events-none absolute inset-y-0 -left-1/2 w-[45%] bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" /> : null}

                  {/* Top bar */}
                  <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-2 p-3 sm:p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <motion.span key={`${active.id}-num`} initial={reduceMotion ? false : { scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3 }} className="rounded-full border border-white/15 bg-black/55 px-3 py-1.5 text-[10px] font-medium tracking-[0.16em] text-white uppercase backdrop-blur-md">
                        {active.number} · {active.category}
                      </motion.span>
                      <StatusBadge live={Boolean(liveHref)} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="hidden items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-[11px] text-white backdrop-blur-md sm:inline-flex">
                        <Layers className="h-3 w-3 opacity-70" /> {String(activeIndex + 1).padStart(2, "0")} / {String(filtered.length).padStart(2, "0")}
                      </span>
                      <button type="button" onClick={() => setLightbox({ card: active, idx: imageIndex })} className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-md hover:bg-black/70" aria-label="Expand image">
                        <Maximize2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Center nav arrows - project level */}
                  <div className="pointer-events-none absolute inset-0 z-[5] hidden items-center justify-between p-3 sm:flex">
                    <motion.button type="button" whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }} onClick={() => cycleProject(-1)} className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white backdrop-blur-md hover:bg-black/70" aria-label="Previous project">
                      <ChevronLeft className="h-5 w-5" />
                    </motion.button>
                    <motion.button type="button" whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }} onClick={() => cycleProject(1)} className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white backdrop-blur-md hover:bg-black/70" aria-label="Next project">
                      <ChevronRight className="h-5 w-5" />
                    </motion.button>
                  </div>

                  {/* Bottom controls */}
                  <div className="absolute inset-x-0 bottom-0 z-10">
                    <div className="bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 sm:p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          {activeImages.length > 1 ? (
                            <>
                              <button type="button" onClick={() => cycleImage(-1)} className="inline-flex h-8 items-center gap-1 rounded-full bg-white px-3 text-xs font-medium text-black hover:bg-white/90" aria-label="Previous image"><ChevronLeft className="h-3.5 w-3.5" /> Prev</button>
                              <button type="button" onClick={() => cycleImage(1)} className="inline-flex h-8 items-center gap-1 rounded-full border border-white/20 bg-black/50 px-3 text-xs text-white backdrop-blur-md hover:bg-black/60" aria-label="Next image">Next <ChevronRight className="h-3.5 w-3.5" /></button>
                              <span className="hidden rounded-full bg-black/60 px-2.5 py-1 text-[11px] text-white backdrop-blur-sm sm:inline-flex">{imageIndex + 1} / {activeImages.length}</span>
                            </>
                          ) : (
                            <span className="rounded-full bg-black/60 px-3 py-1 text-xs text-white/80 backdrop-blur-sm">1 image</span>
                          )}
                        </div>
                        <div className="hidden items-center gap-1.5 sm:flex">
                          {activeImages.map((_, i) => (
                            <button key={i} type="button" onClick={() => { setImgDirection(i > imageIndex ? 1 : -1); setImageIndex(i); }} aria-label={`Go to image ${i + 1}`} className={`h-1 rounded-full transition-all ${i === imageIndex ? "w-7 bg-primary" : "w-1.5 bg-white/40 hover:bg-white/70"}`} />
                          ))}
                        </div>
                      </div>
                      {/* autoplay progress */}
                      {filtered.length > 1 && !paused && !reduceMotion ? (
                        <motion.div key={`${active.id}-prog`} className="mt-3 h-px w-full origin-left bg-white/10">
                          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: AUTOPLAY_MS / 1000, ease: "linear" }} className="h-px origin-left bg-primary" />
                        </motion.div>
                      ) : (
                        <div className="mt-3 h-px w-full bg-white/5" />
                      )}
                    </div>
                  </div>
                </div>

                {activeImages.length > 1 ? (
                  <div className="flex gap-2 overflow-x-auto px-3 py-3 no-scrollbar" aria-label="Project images">
                    {activeImages.map((publicId, idx) => (
                      <motion.button key={publicId} type="button" onClick={() => { setImgDirection(idx > imageIndex ? 1 : -1); setImageIndex(idx); }} whileHover={reduceMotion ? undefined : { y: -2, scale: 1.02 }} whileTap={{ scale: 0.97 }} aria-current={idx === imageIndex} className={`relative h-[3.25rem] w-[4.75rem] shrink-0 overflow-hidden rounded-xl border transition-all ${idx === imageIndex ? "border-primary ring-2 ring-primary/20" : "border-white/10 hover:border-white/20"}`}>
                        <MediaPreview publicId={publicId} alt="" className="h-full w-full object-cover" frame="square" thumbnail />
                        {idx === imageIndex ? <span className="absolute inset-0 bg-primary/10" /> : null}
                      </motion.button>
                    ))}
                  </div>
                ) : null}
              </motion.div>

              {/* Rail */}
              <div className="order-2 lg:col-span-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[11px] tracking-[0.18em] text-gray-500 uppercase">Browse</p>
                  <span className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] text-gray-400">{filtered.length} project{filtered.length !== 1 ? "s" : ""}</span>
                </div>

                <div className="relative">
                  <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-6 bg-gradient-to-b from-black to-transparent lg:block hidden" />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-6 bg-gradient-to-t from-black to-transparent lg:block hidden" />

                  <motion.div
                    ref={railRef}
                    initial={reduceMotion ? false : { opacity: 0 }}
                    whileInView={reduceMotion ? undefined : { opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="no-scrollbar flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory lg:max-h-[32rem] lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden lg:pr-1 lg:snap-none"
                    role="tablist"
                    aria-label="Choose a project"
                  >
                    {filtered.map((project, idx) => {
                      const isActive = idx === activeIndex;
                      const thumbId = resolveMainImagePublicId(project);
                      const live = Boolean(externalHref(project.href));
                      return (
                        <motion.button
                          key={project.id}
                          id={`project-tab-${project.id}`}
                          type="button"
                          role="tab"
                          aria-selected={isActive}
                          aria-controls={panelId}
                          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: idx * 0.04, ease: EASE_SOFT }}
                          whileHover={reduceMotion ? undefined : { y: -1 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => selectProject(idx)}
                          className={`group relative flex min-h-[5.75rem] min-w-[17.5rem] snap-center gap-3 overflow-hidden rounded-[1.25rem] border p-3 text-left transition-all duration-300 lg:min-w-0 ${isActive ? "border-primary/30 bg-[#161616] text-[#E1E0CC] shadow-[0_8px_24px_rgba(0,0,0,0.4),0_0_0_1px_rgba(222,219,200,0.08)_inset]" : "border-white/10 bg-white/[0.02] text-gray-400 hover:border-white/20 hover:bg-white/[0.04] hover:text-[#E1E0CC]"}`}
                        >
                          <div className="relative h-[4.25rem] w-[5.75rem] shrink-0 overflow-hidden rounded-xl bg-[#1a1a1a]">
                            {thumbId ? (
                              <MediaPreview publicId={thumbId} alt="" className={`h-full w-full object-cover transition-transform duration-500 ${isActive ? "scale-105" : "group-hover:scale-105"}`} frame="square" thumbnail />
                            ) : (
                              <span className="absolute inset-0 flex items-center justify-center text-[11px] tracking-[0.14em] text-gray-500 uppercase">{project.number}</span>
                            )}
                            <span className="absolute left-1.5 top-1.5 rounded-full bg-black/70 px-1.5 py-0.5 text-[9px] tracking-[0.12em] text-white uppercase backdrop-blur-sm">{project.number}</span>
                          </div>

                          <span className="min-w-0 flex-1 py-0.5">
                            <span className="flex items-start justify-between gap-2">
                              <span className="min-w-0">
                                <span className="block truncate text-[11px] tracking-[0.12em] text-gray-500 uppercase">{project.category}</span>
                                <span className="mt-0.5 block truncate text-[13px] font-medium leading-tight">{project.title}</span>
                              </span>
                              <StatusBadge live={live} />
                            </span>
                            <span className="mt-2 flex flex-wrap gap-1">
                              {project.stack.slice(0, 2).map((s) => (
                                <span key={s} className={`rounded-full border px-1.5 py-0.5 text-[10px] leading-none ${isActive ? "border-white/10 bg-white/10 text-gray-200" : "border-white/5 bg-white/5 text-gray-500"}`}>{s}</span>
                              ))}
                              {project.stack.length > 2 ? <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] leading-none text-gray-300">+{project.stack.length - 2}</span> : null}
                            </span>
                          </span>

                          {isActive ? (
                            <>
                              <span className="absolute left-0 top-1/2 h-10 w-[2px] -translate-y-1/2 rounded-full bg-primary" />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-primary opacity-60"><ChevronRight className="h-4 w-4" /></span>
                            </>
                          ) : (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 opacity-0 transition-opacity group-hover:opacity-100"><ArrowUpRight className="h-4 w-4" /></span>
                          )}
                        </motion.button>
                      );
                    })}
                  </motion.div>
                </div>

                {/* Mobile swipe hint */}
                <p className="mt-2 flex items-center gap-1.5 text-[11px] text-gray-500 lg:hidden"><ChevronLeft className="h-3 w-3" /> Swipe to browse <ChevronRight className="h-3 w-3" /></p>
              </div>

              {/* Details */}
              <div className="order-3 lg:col-span-12" aria-live="polite">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div key={active.id} custom={direction} variants={reduceMotion ? undefined : slideVariants} initial={reduceMotion ? false : "enter"} animate="center" exit="exit" transition={{ duration: 0.45, ease: EASE_SOFT }} className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0f0f0f] md:rounded-[2rem]">
                    <div className="grid gap-0 lg:grid-cols-[1.25fr_0.85fr]">
                      {/* Left: story */}
                      <div className="p-6 md:p-8 lg:p-9">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] tracking-[0.14em] text-primary uppercase"><span className="h-1 w-1 rounded-full bg-primary" /> {active.category} — {active.number}</span>
                          {active.featured ? <span className="inline-flex items-center gap-1 rounded-full bg-[#E1E0CC] px-2.5 py-1 text-[11px] font-medium tracking-wide text-black"><Sparkles className="h-3 w-3" /> Featured</span> : null}
                          <span className="text-xs text-gray-500">{activeImages.length} image{activeImages.length !== 1 ? "s" : ""} · {active.stack.length} tech</span>
                        </div>

                        <h3 className="mt-4 font-serif text-[1.85rem] leading-[0.9] text-[#E1E0CC] italic sm:text-[2.25rem] md:text-[2.5rem]">{active.title}</h3>

                        <p className="mt-4 max-w-prose text-[15px] leading-relaxed text-gray-300 md:text-base">{active.description}</p>

                        {active.items.length > 0 ? (
                          <div className="mt-7">
                            <p className="text-[11px] tracking-[0.14em] text-gray-500 uppercase">Highlights</p>
                            <motion.ul initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07, delayChildren: 0.08 } } }} className="mt-3 grid gap-3 sm:grid-cols-1">
                              {active.items.slice(0, 3).map((item) => (
                                <motion.li key={item} variants={{ hidden: { opacity: 0, x: -8 }, visible: { opacity: 1, x: 0 } }} transition={{ duration: 0.4, ease: EASE_SOFT }} className="flex gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-3.5 py-3 text-sm leading-relaxed text-[#E1E0CC]/90">
                                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-black"><Check className="h-3 w-3" /></span>
                                  {item}
                                </motion.li>
                              ))}
                            </motion.ul>
                          </div>
                        ) : null}
                      </div>

                      {/* Right: stack + actions */}
                      <div className="flex flex-col gap-6 border-t border-white/5 bg-white/[0.02] p-6 md:p-8 lg:border-l lg:border-t-0">
                        <div>
                          <p className="flex items-center gap-2 text-[11px] tracking-[0.14em] text-gray-500 uppercase"><Layers className="h-3.5 w-3.5" /> Tech stack</p>
                          <motion.ul initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05, delayChildren: 0.15 } } }} className="mt-3 flex flex-wrap gap-1.5" aria-label="Tech stack">
                            {active.stack.map((tech, i) => (
                              <motion.li key={tech} variants={{ hidden: { opacity: 0, scale: 0.9, y: 6 }, visible: { opacity: 1, scale: 1, y: 0 } }} transition={{ duration: 0.35, delay: i * 0.035, ease: EASE_SOFT }} whileHover={reduceMotion ? undefined : { y: -1, scale: 1.04 }} className="rounded-full border border-white/10 bg-[#1c1c1c] px-3 py-1.5 text-xs font-medium text-[#E1E0CC] shadow-sm hover:border-primary/30">
                                {tech}
                              </motion.li>
                            ))}
                          </motion.ul>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-black/30 p-4 backdrop-blur-sm">
                          <p className="text-xs tracking-[0.12em] text-gray-500 uppercase">Actions</p>
                          <div className="mt-3 grid gap-2">
                            {liveHref ? (
                              <motion.a href={liveHref} target="_blank" rel="noreferrer" style={liveCta.style} onMouseMove={liveCta.onMouseMove} onMouseLeave={liveCta.onMouseLeave} whileHover={reduceMotion ? undefined : { scale: 1.01 }} whileTap={{ scale: 0.99 }} className="group inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-black shadow-[0_10px_24px_rgba(222,219,200,0.16)] hover:shadow-[0_14px_32px_rgba(222,219,200,0.22)]">
                                <Eye className="h-4 w-4" /> View live <ExternalLink className="h-3.5 w-3.5 opacity-70 transition-transform group-hover:translate-x-0.5" />
                              </motion.a>
                            ) : (
                              <span className="inline-flex h-11 items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 text-sm text-gray-400">Coming soon</span>
                            )}
                            {sourceHref ? (
                              <a href={sourceHref} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 text-sm font-medium text-[#E1E0CC] hover:border-white/20 hover:bg-white/[0.06]">
                                <CodeXml className="h-4 w-4" /> Source code
                              </a>
                            ) : null}
                          </div>
                          <p className="mt-3 text-center text-[11px] leading-relaxed text-gray-500">Opens in a new tab • {liveHref ? "Live build" : "Not deployed yet"}</p>
                        </div>

                        <div className="flex items-center justify-between rounded-xl bg-black/40 px-3.5 py-2 text-xs text-gray-400">
                          <span>Need details?</span>
                          <button type="button" onClick={() => setLightbox({ card: active, idx: imageIndex })} className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-black hover:bg-white/90"><Maximize2 className="h-3 w-3" /> Fullscreen</button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>{lightbox ? <ProjectLightbox card={lightbox.card} startIndex={lightbox.idx} onClose={() => setLightbox(null)} /> : null}</AnimatePresence>
    </section>
  );
}

function Sparkles({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className} aria-hidden="true">
      <path d="M12 3l1.7 4.3L18 9l-4.3 1.7L12 15l-1.7-4.3L6 9l4.3-1.7L12 3z" />
      <path d="M19 11l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2zM6 14l1 1.5 1.5 1-1.5 1L6 19l-1-1.5L3.5 16.5 5 15.5 6 14z" />
    </svg>
  );
}
function Eye({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={className} aria-hidden="true">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
