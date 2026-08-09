import Reveal from "./Reveal";

interface SectionHeadingProps {
  kicker: string;
  title: string;
  sub: string;
}

export default function SectionHeading({ kicker, title, sub }: SectionHeadingProps) {
  return (
    <Reveal className="section-head">
      <span className="section-kicker">{kicker}</span>
      <h2 className="section-title">{title}</h2>
      <p className="section-sub">{sub}</p>
    </Reveal>
  );
}
