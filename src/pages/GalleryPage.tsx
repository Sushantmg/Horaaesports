import PageHeader from "../components/PageHeader";
import Gallery from "../sections/Gallery";

export default function GalleryPage() {
  return (
    <>
      <PageHeader
        kicker="// THE ALBUM"
        title="GALLERY"
        sub="Moments frozen between the bullets and the banners."
        accent="FREEZE FRAME"
      />
      <Gallery heading={false} />
    </>
  );
}
