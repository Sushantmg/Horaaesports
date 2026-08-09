import PageHeader from "../components/PageHeader";
import Faq from "../sections/Faq";

export default function FaqPage() {
  return (
    <>
      <PageHeader
        kicker="// INTEL"
        title="FAQ"
        sub="Answers from the armory."
        accent="KNOWLEDGE"
      />
      <Faq heading={false} />
    </>
  );
}
