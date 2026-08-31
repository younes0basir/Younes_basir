import { useEffect, useRef, useState } from "react";
import { HERO_VIDEO_URL } from "../lib/hero.ts";

const MIN_DISPLAY_MS = 1200;
const MAX_WAIT_MS = 8000;
const PROGRESS_SMOOTHING = 0.1;

export type LoadStage = "init" | "fonts" | "document" | "media" | "ready";

export const LOAD_STAGE_LABELS: Record<LoadStage, string> = {
  init: "Initializing",
  fonts: "Loading typography",
  document: "Preparing layout",
  media: "Loading visuals",
  ready: "Welcome",
};

type Milestones = {
  fonts: boolean;
  document: boolean;
  media: boolean;
  windowLoad: boolean;
};

function milestoneProgress(milestones: Milestones): number {
  let total = 0;
  if (milestones.fonts) total += 0.18;
  if (milestones.document) total += 0.22;
  if (milestones.media) total += 0.35;
  if (milestones.windowLoad) total += 0.25;
  return total;
}

function stageFromMilestones(milestones: Milestones): LoadStage {
  if (milestones.windowLoad) return "ready";
  if (milestones.media) return "media";
  if (milestones.document) return "document";
  if (milestones.fonts) return "fonts";
  return "init";
}

export function usePageLoadProgress() {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<LoadStage>("init");
  const [ready, setReady] = useState(false);
  const milestonesRef = useRef<Milestones>({
    fonts: false,
    document: false,
    media: false,
    windowLoad: false,
  });

  useEffect(() => {
    const started = performance.now();
    let raf = 0;
    let dismissed = false;
    let video: HTMLVideoElement | null = null;

    const syncStage = () => {
      setStage(stageFromMilestones(milestonesRef.current));
    };

    const tryDismiss = () => {
      if (dismissed) {
        return;
      }

      const milestones = milestonesRef.current;
      const elapsed = performance.now() - started;
      const allMilestones =
        milestones.fonts && milestones.document && milestones.media && milestones.windowLoad;
      const timedOut = elapsed >= MAX_WAIT_MS;
      const allDone = (allMilestones || timedOut) && elapsed >= MIN_DISPLAY_MS;

      if (allDone) {
        dismissed = true;
        setProgress(1);
        window.setTimeout(() => setReady(true), 260);
      }
    };

    const tick = () => {
      const target = milestoneProgress(milestonesRef.current);
      setProgress((current) => {
        if (dismissed) {
          return 1;
        }
        return current + (target - current) * PROGRESS_SMOOTHING;
      });
      tryDismiss();
      if (!dismissed) {
        raf = requestAnimationFrame(tick);
      }
    };

    const mark = (key: keyof Milestones) => {
      milestonesRef.current[key] = true;
      syncStage();
      tryDismiss();
    };

    document.fonts.ready.then(() => mark("fonts")).catch(() => mark("fonts"));

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => mark("document"), { once: true });
    } else {
      mark("document");
    }

    video = document.createElement("video");
    video.preload = "auto";
    video.muted = true;
    video.playsInline = true;
    video.src = HERO_VIDEO_URL;

    const finishMedia = () => mark("media");
    video.addEventListener("canplaythrough", finishMedia, { once: true });
    video.addEventListener("loadeddata", finishMedia, { once: true });
    video.addEventListener("error", finishMedia, { once: true });
    video.load();

    if (document.readyState === "complete") {
      mark("windowLoad");
    } else {
      window.addEventListener("load", () => mark("windowLoad"), { once: true });
    }

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      if (video) {
        video.src = "";
        video = null;
      }
    };
  }, []);

  return {
    progress,
    stage,
    stageLabel: LOAD_STAGE_LABELS[stage],
    ready,
  };
}
