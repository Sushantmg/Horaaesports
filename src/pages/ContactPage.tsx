import PageHeader from "../components/PageHeader";
import Contact from "../sections/Contact";

export default function ContactPage() {
  return (
    <>
      <PageHeader
        kicker="// THE HUDDLE"
        title="CONTACT"
        sub="Ping us before the final circle."
        accent="TALK TO US"
      />
      <Contact heading={false} />
    </>
  );
}
