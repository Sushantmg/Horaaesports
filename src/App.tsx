import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import BackgroundCanvas from "./components/BackgroundCanvas";
import HudFrame from "./components/HudFrame";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollTop from "./components/ScrollTop";
import Home from "./pages/Home";
import PlayerDetail from "./pages/PlayerDetail";
import NewsDetail from "./pages/NewsDetail";

export default function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  return (
    <>
      <BackgroundCanvas />
      <HudFrame />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/players/:slug" element={<PlayerDetail />} />
        <Route path="/news/:slug" element={<NewsDetail />} />
        <Route path="*" element={<Home />} />
      </Routes>
      <Footer />
      <ScrollTop />
    </>
  );
}
