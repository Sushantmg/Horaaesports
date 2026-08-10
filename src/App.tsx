import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Route, Routes, useLocation } from "react-router-dom";
import BackgroundCanvas from "./components/BackgroundCanvas";
import HudFrame from "./components/HudFrame";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollTop from "./components/ScrollTop";
import GamerCursor from "./components/GamerCursor";
import KillFeed from "./components/KillFeed";
import ScrollProgress from "./components/ScrollProgress";
import CrtEffect from "./components/CrtEffect";
import Preloader from "./components/Preloader";
import PrideIntro from "./components/PrideIntro";
import Home from "./pages/Home";
import PlayerDetail from "./pages/PlayerDetail";
import NewsDetail from "./pages/NewsDetail";
import RosterPage from "./pages/RosterPage";
import AchievementsPage from "./pages/AchievementsPage";
import SchedulePage from "./pages/SchedulePage";
import NewsPage from "./pages/NewsPage";
import GalleryPage from "./pages/GalleryPage";
import VideosPage from "./pages/VideosPage";
import FaqPage from "./pages/FaqPage";
import ContactPage from "./pages/ContactPage";

export default function App() {
  const { pathname } = useLocation();
  const [booted, setBooted] = useState(false);
  const [intro, setIntro] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  const handlePreloadDone = () => {
    setBooted(true);
    setIntro(true);
  };

  return (
    <>
      <Preloader onDone={handlePreloadDone} />
      {booted && (
        <div className="site">
          <BackgroundCanvas />
          <HudFrame />
          <Navbar />
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
            <Route path="*" element={<Home />} />
          </Routes>
          <Footer />
          <ScrollTop />
        </div>
      )}
      {booted &&
        createPortal(
          <>
            <GamerCursor />
            <KillFeed />
            <ScrollProgress />
            <CrtEffect />
          </>,
          document.body
        )}
      {intro && <PrideIntro onFinish={() => setIntro(false)} />}
    </>
  );
}
