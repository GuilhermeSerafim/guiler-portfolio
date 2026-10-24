import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { getConsent, isAnalyticsConfigured, setConsent, subscribeConsent } from "../analytics/client";
import { PrivacyNotice } from "./PrivacyNotice";
import "./AnalyticsPreferences.css";

export function AnalyticsPreferences() {
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
    setFeedback(getConsent() === "granted" ? "Estatísticas permitidas neste navegador." : "Estatísticas recusadas neste navegador.");
    setOpen(false);
  }

  const choices = (compact = false) => (
    <div className="analytics-actions">
      <button type="button" aria-label="Aceitar estatísticas" onClick={() => choose("granted")}>{compact ? "Aceitar" : "Aceitar estatísticas"}</button>
      <button type="button" onClick={() => choose("denied")}>{consent === "granted" ? "Retirar autorização" : "Recusar"}</button>
    </div>
  );

  return (
    <div className={`analytics-preferences${configured && consent === "unknown" && !dismissed ? " analytics-preferences--inviting" : ""}`}>
      {configured && consent === "unknown" && !dismissed && (
        <aside className="analytics-invite" aria-label="Escolha de estatísticas">
          <p>Posso medir visitas e cliques para melhorar o portfólio? Só com sua autorização.</p>
          {choices(true)}
          <div className="analytics-invite-footer">
            <button className="analytics-text-button" type="button" aria-label="Como funciona a privacidade" onClick={() => setOpen(true)}>Privacidade</button>
            <button className="analytics-text-button" type="button" onClick={() => setDismissed(true)}>Agora não</button>
          </div>
        </aside>
      )}
      <button ref={trigger} type="button" className="analytics-text-button" onClick={() => setOpen(true)}>Preferências de privacidade</button>
      <span className="analytics-feedback" role="status">{feedback}</span>
      <dialog ref={dialog} className="analytics-dialog" aria-labelledby="analytics-preferences-title" onClose={() => setOpen(false)} onClick={event => { if (event.target === event.currentTarget) setOpen(false); }}>
        <div className="analytics-dialog-heading">
          <h2 id="analytics-preferences-title">Preferências de privacidade</h2>
          <button type="button" onClick={() => setOpen(false)} aria-label="Fechar preferências">Fechar</button>
        </div>
        <p role="status">{!configured ? "Estatísticas desativadas neste ambiente" : consent === "granted" ? "Você permitiu estatísticas. Retirar a autorização recarrega a página." : consent === "denied" ? "Você recusou estatísticas." : "Estatísticas aguardam sua escolha."}</p>
        {!configured && consent === "granted" && <p>Há uma autorização salva neste navegador. Você pode retirá-la mesmo com a coleta indisponível nesta página.</p>}
        {configured ? choices() : consent === "granted" && <div className="analytics-actions"><button type="button" onClick={() => choose("denied")}>Retirar autorização</button></div>}
        <PrivacyNotice />
      </dialog>
    </div>
  );
}
