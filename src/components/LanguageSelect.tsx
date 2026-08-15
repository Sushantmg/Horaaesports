import { useEffect, useRef, useState } from "react";
import {
  ensureGoogleTranslate,
  setLanguage,
  getCurrentLanguage,
  isTranslateReady,
} from "../lib/translate";

const LANGUAGES: { code: string; label: string }[] = [
  { code: "en", label: "English" },
  { code: "ne", label: "Nepali" },
  { code: "hi", label: "Hindi" },
  { code: "bn", label: "Bengali" },
  { code: "ur", label: "Urdu" },
  { code: "ar", label: "Arabic" },
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "pt", label: "Portuguese" },
  { code: "ru", label: "Russian" },
  { code: "zh-CN", label: "Chinese (Simplified)" },
  { code: "zh-TW", label: "Chinese (Traditional)" },
  { code: "ja", label: "Japanese" },
  { code: "ko", label: "Korean" },
  { code: "it", label: "Italian" },
  { code: "tr", label: "Turkish" },
  { code: "nl", label: "Dutch" },
  { code: "pl", label: "Polish" },
  { code: "th", label: "Thai" },
  { code: "vi", label: "Vietnamese" },
  { code: "id", label: "Indonesian" },
  { code: "fa", label: "Persian" },
  { code: "uk", label: "Ukrainian" },
  { code: "el", label: "Greek" },
  { code: "sv", label: "Swedish" },
  { code: "ro", label: "Romanian" },
  { code: "ta", label: "Tamil" },
  { code: "te", label: "Telugu" },
  { code: "mr", label: "Marathi" },
  { code: "pa", label: "Punjabi" },
  { code: "sw", label: "Swahili" },
  { code: "fil", label: "Filipino" },
];

export default function LanguageSelect() {
  const rootRef = useRef<HTMLDivElement>(null);
  const pendingRef = useRef<string | null>(null);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [lang, setLang] = useState("en");

  useEffect(() => {
    ensureGoogleTranslate();
    if (isTranslateReady()) {
      setReady(true);
      return;
    }
    let attempts = 0;
    const id = window.setInterval(() => {
      if (isTranslateReady()) {
        window.clearInterval(id);
        setReady(true);
      } else if (++attempts > 60) {
        window.clearInterval(id);
      }
    }, 250);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const current = getCurrentLanguage();
    setLang(current || "en");
  }, [ready]);

  useEffect(() => {
    if (!ready || !pendingRef.current) return;
    const code = pendingRef.current;
    pendingRef.current = null;
    setLanguage(code);
  }, [ready]);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const choose = (code: string) => {
    setOpen(false);
    if (code === lang) return;
    setLang(code);
    if (!ready) {
      pendingRef.current = code;
      return;
    }
    setLanguage(code);
  };

  const label = LANGUAGES.find((l) => l.code === lang)?.label ?? "English";

  return (
    <div className={`lang-select${open ? " open" : ""}`} ref={rootRef}>
      <button
        className="lang-btn"
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        title="Translate this site"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="lang-icon" aria-hidden="true">
          🌐
        </span>
        <span className="lang-label">{label}</span>
        <span className={`lang-caret${open ? " up" : ""}`} aria-hidden="true">
          ▾
        </span>
      </button>
      <div className="lang-menu" role="listbox" aria-label="Choose a language">
        {LANGUAGES.map((l) => (
          <button
            key={l.code}
            type="button"
            role="option"
            aria-selected={l.code === lang}
            className={`lang-item${l.code === lang ? " active" : ""}`}
            onClick={() => choose(l.code)}
          >
            {l.label}
          </button>
        ))}
      </div>
      <div id="google_translate_element"></div>
    </div>
  );
}
