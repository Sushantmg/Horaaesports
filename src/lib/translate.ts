let initialized = false;
let killSwitch = false;

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
  new window.google.translate.TranslateElement(
    {
      pageLanguage: "en",
      autoDisplay: false,
      includedLanguages: "en,ne,hi,bn,ur,ar,es,fr,de,pt,ru,zh-CN,zh-TW,ja,ko,it,tr,nl,pl,th,vi,id,fa,uk,el,sv,ro,ta,te,mr,pa,sw,fil",
    },
    "google_translate_element"
  );
}

function removeGoogleChrome() {
  document
    .querySelectorAll(".goog-te-banner-frame, .goog-te-balloon-frame, #goog-gt-tt")
    .forEach((el) => el.remove());
  document.body.style.setProperty("top", "0px", "important");
}

function startChromeKiller() {
  if (killSwitch) return;
  killSwitch = true;
  removeGoogleChrome();
  new MutationObserver(() => removeGoogleChrome()).observe(document.body, { childList: true });
}

export function ensureGoogleTranslate() {
  startChromeKiller();
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

export function isTranslateReady() {
  return !!document.querySelector<HTMLSelectElement>(".goog-te-combo");
}

export function getCurrentLanguage() {
  const select = document.querySelector<HTMLSelectElement>(".goog-te-combo");
  if (!select || !select.value) return "en";
  return select.value;
}

export function setLanguage(code: string) {
  const select = document.querySelector<HTMLSelectElement>(".goog-te-combo");
  if (!select) return false;
  const option = Array.from(select.options).find((o) => o.value === code);
  if (!option) return false;
  select.value = code;
  select.dispatchEvent(new Event("change", { bubbles: true }));
  return true;
}
