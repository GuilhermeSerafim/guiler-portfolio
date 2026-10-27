import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { getConsent, isAnalyticsConfigured, setConsent, subscribeConsent } from "../analytics/client";
import { PrivacyNotice } from "./PrivacyNotice";
import { useTranslation } from "../i18n";
import "./AnalyticsPreferences.css";

export function AnalyticsPreferences() {
  const { t } = useTranslation();
  const consent = useSyncExternalStore(subscribeConsent, getConsent, () => "unknown");
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [feedback, setFeedback] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const configured = isAnalyticsConfigured();

  useEffect(() => {
    if (!open) return;
    const element = dialog.current;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : trigger.current;
    element?.showModal();
    return () => { element?.close(); (opener?.isConnected ? opener : trigger.current)?.focus(); };
  }, [open]);

  function choose(value: "granted" | "denied") {
    setConsent(value);
    setFeedback(getConsent() === "granted" ? t("Estatísticas permitidas neste navegador.", "Analytics allowed in this browser.") : t("Estatísticas recusadas neste navegador.", "Analytics declined in this browser."));
    setOpen(false);
  }

  const choices = (compact = false) => (
    <div className="analytics-actions">
      <button type="button" aria-label={t("Aceitar estatísticas", "Accept analytics")} onClick={() => choose("granted")}>{compact ? t("Aceitar", "Accept") : t("Aceitar estatísticas", "Accept analytics")}</button>
      <button type="button" onClick={() => choose("denied")}>{consent === "granted" ? t("Retirar autorização", "Withdraw consent") : t("Recusar", "Decline")}</button>
    </div>
  );

  return (
    <div className={`analytics-preferences${configured && consent === "unknown" && !dismissed ? " analytics-preferences--inviting" : ""}`}>
      {configured && consent === "unknown" && !dismissed && (
        <aside className="analytics-invite" aria-label={t("Escolha de estatísticas", "Analytics choice")}>
          <p>{t("Posso medir visitas e cliques para melhorar o portfólio? Só com sua autorização.", "May I measure visits and clicks to improve this portfolio? Only with your permission.")}</p>
          {choices(true)}
          <div className="analytics-invite-footer">
            <button className="analytics-text-button" type="button" aria-label={t("Como funciona a privacidade", "How privacy works")} onClick={() => setOpen(true)}>{t("Privacidade", "Privacy")}</button>
            <button className="analytics-text-button" type="button" onClick={() => setDismissed(true)}>{t("Agora não", "Not now")}</button>
          </div>
        </aside>
      )}
      <button ref={trigger} type="button" className="analytics-text-button" onClick={() => setOpen(true)}>{t("Preferências de privacidade", "Privacy preferences")}</button>
      <span className="analytics-feedback" role="status">{feedback}</span>
      <dialog ref={dialog} className="analytics-dialog" aria-labelledby="analytics-preferences-title" onClose={() => setOpen(false)} onClick={event => { if (event.target === event.currentTarget) setOpen(false); }}>
        <div className="analytics-dialog-heading">
          <h2 id="analytics-preferences-title">{t("Preferências de privacidade", "Privacy preferences")}</h2>
          <button type="button" onClick={() => setOpen(false)} aria-label={t("Fechar preferências", "Close preferences")}>{t("Fechar", "Close")}</button>
        </div>
        <p role="status">{!configured ? t("Estatísticas desativadas neste ambiente", "Analytics is disabled in this environment") : consent === "granted" ? t("Você permitiu estatísticas. Retirar a autorização recarrega a página.", "You allowed analytics. Withdrawing consent reloads the page.") : consent === "denied" ? t("Você recusou estatísticas.", "You declined analytics.") : t("Estatísticas aguardam sua escolha.", "Analytics is waiting for your choice.")}</p>
        {!configured && consent === "granted" && <p>{t("Há uma autorização salva neste navegador. Você pode retirá-la mesmo com a coleta indisponível nesta página.", "This browser has saved your consent. You can withdraw it even when analytics is unavailable on this page.")}</p>}
        {configured ? choices() : consent === "granted" && <div className="analytics-actions"><button type="button" onClick={() => choose("denied")}>{t("Retirar autorização", "Withdraw consent")}</button></div>}
        <PrivacyNotice />
      </dialog>
    </div>
  );
}
