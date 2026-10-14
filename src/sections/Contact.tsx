import { useRef, useState, type FormEvent } from "react";
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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MESSAGE_MIN = 10;
const MESSAGE_MAX = 1000;

type Fields = { name: string; email: string; subject: string; message: string };
type FieldErrors = Partial<Record<keyof Fields, string>>;

function validate(fields: Fields): FieldErrors {
  const errors: FieldErrors = {};
  if (fields.name.trim().length < 2) errors.name = "Enter your name (min 2 characters).";
  if (!EMAIL_RE.test(fields.email.trim())) errors.email = "Enter a valid email address.";
  if (!fields.subject.trim()) errors.subject = "Choose a subject.";
  const msg = fields.message.trim();
  if (msg.length < MESSAGE_MIN) errors.message = `Message needs at least ${MESSAGE_MIN} characters (${msg.length}/${MESSAGE_MIN}).`;
  else if (msg.length > MESSAGE_MAX) errors.message = `Keep it under ${MESSAGE_MAX} characters (${msg.length}/${MESSAGE_MAX}).`;
  return errors;
}

export default function Contact({ heading = true }: { heading?: boolean }) {
  const [fields, setFields] = useState<Fields>({
    name: "",
    email: "",
    subject: "Sponsorship",
    message: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Fields, boolean>>>({});
  const [status, setStatus] = useState<{ kind: "idle" | "sending" | "done" | "error"; msg: string }>({
    kind: "idle",
    msg: "",
  });
  const formRef = useRef<HTMLFormElement>(null);

  const setField = (key: keyof Fields, value: string) => {
    const next = { ...fields, [key]: value };
    setFields(next);
    // Live-clear a field error once it becomes valid after touch.
    if (touched[key]) {
      const nextErrors = validate(next);
      setErrors((prev) => ({ ...prev, [key]: nextErrors[key] }));
    }
  };

  const blurField = (key: keyof Fields) => {
    setTouched((t) => ({ ...t, [key]: true }));
    setErrors(validate({ ...fields }));
  };

  const focusFirstError = (errs: FieldErrors) => {
    const order: (keyof Fields)[] = ["name", "email", "subject", "message"];
    const first = order.find((k) => errs[k]);
    if (first && formRef.current) {
      formRef.current.querySelector<HTMLElement>(`#c-${first}`)?.focus();
    }
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errs = validate(fields);
    setErrors(errs);
    setTouched({ name: true, email: true, subject: true, message: true });
    if (Object.keys(errs).length > 0) {
      setStatus({ kind: "error", msg: "Please fix the highlighted fields before sending." });
      focusFirstError(errs);
      return;
    }

    setStatus({ kind: "sending", msg: "" });
    try {
      await postContact({
        name: fields.name.trim(),
        email: fields.email.trim(),
        subject: fields.subject.trim(),
        message: fields.message.trim(),
      });
      setStatus({ kind: "done", msg: "Message sent! The Horaa camp will get back to you soon." });
      setFields({ name: "", email: "", subject: "Sponsorship", message: "" });
      setTouched({});
      setErrors({});
    } catch (err) {
      setStatus({
        kind: "error",
        msg: `${err instanceof Error ? err.message : "Send failed"}. Try again or email info@horaaesports.com.np`,
      });
    }
  };

  const sending = status.kind === "sending";
  const msgLen = fields.message.trim().length;

  const fieldProps = (key: keyof Fields) => ({
    "aria-invalid": Boolean(errors[key]) as true | undefined,
    "aria-describedby": errors[key] ? `c-${key}-error` : key === "message" ? "c-message-count" : undefined,
  });

  return (
    <section className="section" id="contact">
      <div className="container">
        {heading && (
          <SectionHeading kicker="// The Bridge" title="PARTNER WITH US" sub="Sponsorships, business, media, or just say hi — we answer." />
        )}

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
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal className="contact-form-wrap">
            <form ref={formRef} className="contact-form" onSubmit={onSubmit} noValidate aria-busy={sending}>
              <div className="form-row">
                <div className={`form-field${errors.name ? " invalid" : ""}`}>
                  <label htmlFor="c-name">Your Name</label>
                  <input
                    type="text"
                    id="c-name"
                    name="name"
                    placeholder="Ravi Karki"
                    required
                    autoComplete="name"
                    maxLength={80}
                    value={fields.name}
                    onChange={(e) => setField("name", e.target.value)}
                    onBlur={() => blurField("name")}
                    {...fieldProps("name")}
                  />
                  {errors.name && (
                    <p className="field-error" id="c-name-error" role="alert">
                      {errors.name}
                    </p>
                  )}
                </div>
                <div className={`form-field${errors.email ? " invalid" : ""}`}>
                  <label htmlFor="c-email">Email</label>
                  <input
                    type="email"
                    id="c-email"
                    name="email"
                    placeholder="you@brand.com"
                    required
                    autoComplete="email"
                    maxLength={120}
                    value={fields.email}
                    onChange={(e) => setField("email", e.target.value)}
                    onBlur={() => blurField("email")}
                    {...fieldProps("email")}
                  />
                  {errors.email && (
                    <p className="field-error" id="c-email-error" role="alert">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>
              <div className={`form-field${errors.subject ? " invalid" : ""}`}>
                <label htmlFor="c-subject">Subject</label>
                <select
                  id="c-subject"
                  name="subject"
                  value={fields.subject}
                  onChange={(e) => setField("subject", e.target.value)}
                  onBlur={() => blurField("subject")}
                  {...fieldProps("subject")}
                >
                  <option>Sponsorship</option>
                  <option>Business Inquiry</option>
                  <option>Media / Press</option>
                  <option>Merchandise</option>
                  <option>Other</option>
                </select>
                {errors.subject && (
                  <p className="field-error" id="c-subject-error" role="alert">
                    {errors.subject}
                  </p>
                )}
              </div>
              <div className={`form-field${errors.message ? " invalid" : ""}`}>
                <label htmlFor="c-message">Message</label>
                <textarea
                  id="c-message"
                  name="message"
                  rows={5}
                  placeholder="Tell us about the partnership..."
                  required
                  maxLength={MESSAGE_MAX + 100}
                  value={fields.message}
                  onChange={(e) => setField("message", e.target.value)}
                  onBlur={() => blurField("message")}
                  {...fieldProps("message")}
                />
                <div className="field-meta">
                  {errors.message ? (
                    <p className="field-error" id="c-message-error" role="alert">
                      {errors.message}
                    </p>
                  ) : (
                    <span />
                  )}
                  <span
                    id="c-message-count"
                    className={`char-count${msgLen < MESSAGE_MIN || msgLen > MESSAGE_MAX ? " warn" : ""}`}
                    aria-live="polite"
                  >
                    {msgLen}/{MESSAGE_MAX} · min {MESSAGE_MIN}
                  </span>
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-block" disabled={sending}>
                {sending ? "Sending…" : "Send Message"}
              </button>
              {status.kind === "done" && (
                <div className="form-status done" role="status" aria-live="polite">
                  <p>{status.msg}</p>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm form-reset"
                    onClick={() => setStatus({ kind: "idle", msg: "" })}
                  >
                    Send another
                  </button>
                </div>
              )}
              {status.kind === "error" && (
                <p className="form-status error" role="alert">
                  {status.msg}
                </p>
              )}
              {status.kind === "sending" && (
                <p className="form-status" role="status" aria-live="polite">
                  Sending your message…
                </p>
              )}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
