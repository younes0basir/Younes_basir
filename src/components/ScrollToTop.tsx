import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { resetScrollAfterPaint } from "../lib/scroll.ts";

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useLayoutEffect(() => {
    if (hash) {
      return;
    }

    resetScrollAfterPaint();
  }, [pathname, hash]);

  return null;
}
