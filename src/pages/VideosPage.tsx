import PageHeader from "../components/PageHeader";
import Videos from "../sections/Videos";

export default function VideosPage() {
  return (
    <>
      <PageHeader
        kicker="// THE REEL"
        title="VIDEOS"
        sub="Watch parties, highlights and interviews — straight from the drop zone."
        accent="PRESS PLAY"
      />
      <Videos heading={false} />
    </>
  );
}
