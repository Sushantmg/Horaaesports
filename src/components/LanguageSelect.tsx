import { useEffect } from "react";
import { ensureGoogleTranslate } from "../lib/translate";

export default function LanguageSelect() {
  useEffect(() => {
    ensureGoogleTranslate();
  }, []);

  return (
    <div className="lang-select" title="Translate this site">
      <span className="lang-icon" aria-hidden="true">
        🌐
      </span>
      <div id="google_translate_element"></div>
    </div>
  );
}
