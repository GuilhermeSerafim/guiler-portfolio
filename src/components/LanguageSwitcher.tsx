import { useEffect, useState } from "react";
import { getLanguageHref, useTranslation } from "../i18n";
import "./LanguageSwitcher.css";

export function LanguageSwitcher() {
  const { locale, t } = useTranslation();
  const [location, setLocation] = useState(() => ({ search: window.location.search, hash: window.location.hash }));
  useEffect(() => {
    const update = () => setLocation({ search: window.location.search, hash: window.location.hash });
    window.addEventListener("hashchange", update);
    window.addEventListener("popstate", update);
    return () => {
      window.removeEventListener("hashchange", update);
      window.removeEventListener("popstate", update);
    };
  }, []);
  return <nav className="language-switcher" aria-label={t("Idioma", "Language")}>
    {(["pt-BR", "en"] as const).map(language => <a
      key={language}
      href={getLanguageHref(language, location)}
      hrefLang={language}
      lang={language}
      aria-label={language === "en" ? "EN — English" : "PT — Português"}
      aria-current={locale === language ? "page" : undefined}
      onClick={event => {
        // Consent can remove social entry parameters without a navigation event.
        // Read the current URL at click time so those values are not restored.
        event.currentTarget.href = getLanguageHref(language, window.location);
      }}
    >{language === "en" ? "EN" : "PT"}</a>)}
  </nav>;
}
