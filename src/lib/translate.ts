let initialized = false;

declare global {
  interface Window {
    google?: {
      translate: {
        TranslateElement: new (options: Record<string, unknown>, elementId: string) => void;
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

function bootstrap() {
  if (initialized) return;
  if (!document.getElementById("google_translate_element")) return;
  if (!window.google?.translate) return;
  initialized = true;
  new window.google.translate.TranslateElement({ pageLanguage: "en", autoDisplay: false }, "google_translate_element");
}

export function ensureGoogleTranslate() {
  if (!document.getElementById("google-translate-script")) {
    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.head.appendChild(script);
  }
  window.googleTranslateElementInit = bootstrap;
  bootstrap();
}

export function isPageTranslated() {
  return (
    document.body.classList.contains("translated-ltr") ||
    document.body.classList.contains("translated-rtl")
  );
}
