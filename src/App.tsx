import { useCallback, useState } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { useReducedMotion } from "framer-motion";
import PageLoader from "./components/PageLoader.tsx";
import ScrollToTop from "./components/ScrollToTop.tsx";
import AdminPage from "./pages/AdminPage.tsx";
import HomePage from "./pages/HomePage.tsx";
import { resetScrollAfterPaint } from "./lib/scroll.ts";

const SPLASH_SESSION_KEY = "younes-portfolio-splash-seen";

type SplashPhase = "loading" | "exiting" | "done";

function AppRoutes() {
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const splashSeen =
    typeof window !== "undefined" && sessionStorage.getItem(SPLASH_SESSION_KEY) === "1";
  const showSplash = location.pathname === "/" && !splashSeen && !reduceMotion;
  const [splashPhase, setSplashPhase] = useState<SplashPhase>(showSplash ? "loading" : "done");
  const contentReady = splashPhase === "exiting" || splashPhase === "done";

  const handleExitStart = useCallback(() => {
    resetScrollAfterPaint();
    setSplashPhase("exiting");
  }, []);

  const handleSplashDone = useCallback(() => {
    sessionStorage.setItem(SPLASH_SESSION_KEY, "1");
    resetScrollAfterPaint();
    setSplashPhase("done");
  }, []);

  return (
    <>
      {showSplash && splashPhase !== "done" ? (
        <PageLoader onExitStart={handleExitStart} onDone={handleSplashDone} />
      ) : null}
      {contentReady ? (
        <>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<HomePage reveal={splashPhase === "exiting"} />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </>
      ) : null}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
