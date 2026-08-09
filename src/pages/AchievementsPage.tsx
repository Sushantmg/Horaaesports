import PageHeader from "../components/PageHeader";
import Achievements from "../sections/Achievements";

export default function AchievementsPage() {
  return (
    <>
      <PageHeader
        kicker="// THE LEGACY"
        title="ACHIEVEMENTS"
        sub="A record that shook Nepali esports — and put us on the world map."
        accent="HISTORY MADE"
      />
      <Achievements heading={false} />
    </>
  );
}
