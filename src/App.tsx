import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Route, Routes, useLocation } from "react-router-dom";
import { isPageTranslated } from "./lib/translate";
import BackgroundCanvas from "./components/BackgroundCanvas";
import ErrorBoundary from "./components/ErrorBoundary";
import HudFrame from "./components/HudFrame";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollTop from "./components/ScrollTop";
import GamerCursor from "./components/GamerCursor";
import KillFeed from "./components/KillFeed";
import ScrollProgress from "./components/ScrollProgress";
import CrtEffect from "./components/CrtEffect";
import Konami from "./components/Konami";
import Preloader from "./components/Preloader";
import PrideIntro from "./components/PrideIntro";
import Home from "./pages/Home";

// Home stays eager (LCP route) — everything else splits into its own chunk
// so first load only ships what "/" needs.
const PlayerDetail = lazy(() => import("./pages/PlayerDetail"));
const NewsDetail = lazy(() => import("./pages/NewsDetail"));
const RosterPage = lazy(() => import("./pages/RosterPage"));
const AchievementsPage = lazy(() => import("./pages/AchievementsPage"));
const SchedulePage = lazy(() => import("./pages/SchedulePage"));
const NewsPage = lazy(() => import("./pages/NewsPage"));
const GalleryPage = lazy(() => import("./pages/GalleryPage"));
const VideosPage = lazy(() => import("./pages/VideosPage"));
const FaqPage = lazy(() => import("./pages/FaqPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

function RouteFallback() {
  return (
    <main className="page-mini">
      <div className="page-loader">
        <div className="preloader-bar"><span></span></div>
        <p>LOADING…</p>
      </div>
    </main>
  );
}

export default function App() {
  const { pathname } = useLocation();
  const [booted, setBooted] = useState(false);
  const [intro, setIntro] = useState(false);
  const prevPath = useRef(pathname);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    document.getElementById("content")?.focus({ preventScroll: true });
    if (prevPath.current !== pathname) {
      prevPath.current = pathname;
      if (isPageTranslated()) window.location.reload();
    }
  }, [pathname]);

  const handlePreloadDone = () => {
    setBooted(true);
    setIntro(true);
  };

  return (
    <>
      <Preloader onDone={handlePreloadDone} />
      {/* Render content immediately so it loads/paints behind the preloader
          overlay instead of waiting ~2s for the boot animation. */}
      <div className="site">
        <a className="skip-link" href="#content">
          Skip to content
        </a>
        <BackgroundCanvas />
        <HudFrame />
        <Navbar />
        <div className="page-transition" id="content" tabIndex={-1} key={pathname}>
          <ErrorBoundary key={pathname} resetKey={pathname}>
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/roster" element={<RosterPage />} />
                <Route path="/roster/:slug" element={<PlayerDetail />} />
                <Route path="/achievements" element={<AchievementsPage />} />
                <Route path="/schedule" element={<SchedulePage />} />
                <Route path="/news" element={<NewsPage />} />
                <Route path="/news/:slug" element={<NewsDetail />} />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/videos" element={<VideosPage />} />
                <Route path="/faq" element={<FaqPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </div>
        <Footer />
        <ScrollTop />
      </div>
      {booted &&
        createPortal(
          <>
            <GamerCursor />
            <KillFeed />
            <ScrollProgress />
            <CrtEffect />
            <Konami />
          </>,
          document.body
        )}
      {intro && <PrideIntro onFinish={() => setIntro(false)} />}
    </>
  );
}
