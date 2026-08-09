import PageHeader from "../components/PageHeader";
import Schedule from "../sections/Schedule";

export default function SchedulePage() {
  return (
    <>
      <PageHeader
        kicker="// THE CAMPAIGN"
        title="SCHEDULE & RESULTS"
        sub="Every drop, every rotation, every win — tracked."
        accent="MATCH DAY"
      />
      <Schedule heading={false} />
    </>
  );
}
