import PageHeader from "../components/PageHeader";
import Roster from "../sections/Roster";

export default function RosterPage() {
  return (
    <>
      <PageHeader
        kicker="// THE SQUAD"
        title="ROSTER"
        sub="Five hunters on the island. A full unit behind the kill feed."
        accent="FULL SQUAD"
      />
      <Roster heading={false} />
    </>
  );
}
