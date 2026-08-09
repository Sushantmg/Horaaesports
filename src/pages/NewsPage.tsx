import PageHeader from "../components/PageHeader";
import News from "../sections/News";

export default function NewsPage() {
  return (
    <>
      <PageHeader
        kicker="// THE WIRE"
        title="NEWS"
        sub="Announcements, transfers, and tournament recaps straight from the camp."
        accent="STAY UPDATED"
      />
      <News heading={false} />
    </>
  );
}
