import { useState, type FormEvent } from "react";
import SectionHeading from "../components/SectionHeading";
import Reveal from "../components/Reveal";
import { postContact } from "../api";

const SOCIALS = [
  { label: "IG", href: "https://www.instagram.com/horaaesports" },
  { label: "YT", href: "https://www.youtube.com/@HoraaEsportsOfficial" },
  { label: "FB", href: "https://www.facebook.com/horaaesports/" },
  { label: "TT", href: "https://www.tiktok.com/@horaa.esports" },
  { label: "DC", href: "https://discord.gg/BXwybtRTRX" },
];

export default function Contact() {
  const [state, setState] = useState<{ status: "idle" | "sending" | "done" | "error"; msg: string }>({
    status: "idle",
    msg: "",
  });

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const subject = String(data.get("subject") || "").trim();
    const message = String(data.get("message") || "").trim();

    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length < 10) {
      setState({ status: "error", msg: "Please fill in the required fields correctly." });
      return;
    }

    setState({ status: "sending", msg: "" });
    try {
      await postContact({ name, email, subject, message });
      setState({ status: "done", msg: "Message sent! The Horaa camp will get back to you soon." });
      form.reset();
    } catch (err) {
      setState({ status: "error", msg: `⚠ ${err}. Please try again or email info@horaaesports.com.np` });
    }
  };

  return (
    <section className="section" id="contact">
      <div className="container">
        <SectionHeading kicker="// The Bridge" title="PARTNER WITH US" sub="Sponsorships, business, media, or just say hi — we answer." />

        <div className="contact-grid">
          <Reveal className="contact-info">
            <div className="info-card">
              <span className="info-label">EMAIL</span>
              <a href="mailto:info@horaaesports.com.np">info@horaaesports.com.np</a>
            </div>
            <div className="info-card">
              <span className="info-label">PHONE</span>
              <a href="tel:+9779803857466">+977-9803857466</a>
            </div>
            <div className="info-card">
              <span className="info-label">LOCATION</span>
              <span>Gaming District, Esports City, Nepal</span>
            </div>
            <div className="info-card">
              <span className="info-label">FOLLOW THE JOURNEY</span>
              <div className="socials">
                {SOCIALS.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener" aria-label={s.label}>
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal className="contact-form-wrap">
            <form className="contact-form" onSubmit={onSubmit} noValidate>
              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="cName">Your Name</label>
                  <input type="text" id="cName" name="name" placeholder="Ravi Karki" required />
                </div>
                <div className="form-field">
                  <label htmlFor="cEmail">Email</label>
                  <input type="email" id="cEmail" name="email" placeholder="you@brand.com" required />
                </div>
              </div>
              <div className="form-field">
                <label htmlFor="cSubject">Subject</label>
                <select id="cSubject" name="subject">
                  <option>Sponsorship</option>
                  <option>Business Inquiry</option>
                  <option>Media / Press</option>
                  <option>Merchandise</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-field">
                <label htmlFor="cMessage">Message</label>
                <textarea id="cMessage" name="message" rows={5} placeholder="Tell us about the partnership..." required />
              </div>
              <button type="submit" className="btn btn-primary btn-block" disabled={state.status === "sending"}>
                {state.status === "sending" ? "Sending…" : "Send Message"}
              </button>
              {state.status !== "idle" && state.status !== "sending" && (
                <p className={`form-status ${state.status}`}>{state.msg}</p>
              )}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
