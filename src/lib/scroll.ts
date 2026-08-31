export function resetScrollPosition() {
  if (typeof window === "undefined") {
    return;
  }

  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

export function resetScrollAfterPaint() {
  resetScrollPosition();
  requestAnimationFrame(() => {
    resetScrollPosition();
    requestAnimationFrame(resetScrollPosition);
  });
}

export function installScrollGuards() {
  if (typeof window === "undefined") {
    return;
  }

  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  resetScrollPosition();

  window.addEventListener("pageshow", (event) => {
    if (event.persisted && !window.location.hash) {
      resetScrollAfterPaint();
    }
  });
}
