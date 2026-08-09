import Hero from "../sections/Hero";
import Ticker from "../sections/Ticker";
import Achievements from "../sections/Achievements";
import StatsBand from "../sections/StatsBand";
import Roster from "../sections/Roster";
import Schedule from "../sections/Schedule";
import News from "../sections/News";
import Gallery from "../sections/Gallery";
import Merch from "../sections/Merch";
import Sponsors from "../sections/Sponsors";
import Faq from "../sections/Faq";
import Contact from "../sections/Contact";

export default function Home() {
  return (
    <main id="home">
      <Hero />
      <Ticker />
      <Achievements />
      <StatsBand />
      <Roster />
      <Schedule />
      <News />
      <Gallery />
      <Merch />
      <Sponsors />
      <Faq />
      <Contact />
    </main>
  );
}
