import { useTranslation } from "../i18n";

export function PrivacyNotice() {
  const { isEnglish } = useTranslation();
  if (isEnglish) return (
    <div className="analytics-notice">
      <p>Analytics helps Guilherme Serafim understand where visits come from and which links, projects, résumé downloads and contact options attract interest.</p>
      <p>If you accept, Google Analytics receives events with fixed categories and IDs. This application does not send your email address, phone number, copied content or free-form text. Page and referral URLs are reduced to permitted data. Google uses pseudonymous browser and session identifiers; this measurement is not anonymous. Advertising features are disabled.</p>
      <p>Your choice is saved in this browser and on this domain for up to 180 days. Analytics cookies are also configured to last 180 days without automatic renewal; your browser may apply shorter limits. The link hub and portfolio store separate choices.</p>
      <p>You can decline or withdraw consent in these preferences. Withdrawal blocks new events, attempts to delete this site's analytics cookies and reloads the page to remove the loaded service. It does not delete data already sent to Google. If your browser prevents saving your choice, it applies to this page and no automatic reload occurs.</p>
      <p>Clicks indicate interest. They do not confirm that a file was saved, a message was sent or a meeting was booked. Blockers and privacy choices limit these reports.</p>
      <p>Responsible person: Guilherme Serafim. Contact: <a href="mailto:guilerstudies@gmail.com">guilerstudies@gmail.com</a>. Learn how the provider handles data in <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">Google's Privacy Policy</a>.</p>
    </div>
  );
  return (
    <div className="analytics-notice">
      <p>As estatísticas ajudam Guilherme Serafim a entender de onde chegam as visitas e quais links, projetos, currículos e formas de contato despertam interesse.</p>
      <p>Se você aceitar, o Google Analytics recebe eventos com categorias e IDs fixos. A aplicação não envia seu e-mail, telefone, conteúdo copiado ou textos livres. Endereços de página e de origem são reduzidos a dados permitidos. O Google usa identificadores pseudônimos de navegador e sessão; a medição não é anônima. Recursos de publicidade ficam desativados.</p>
      <p>Sua escolha fica neste navegador e domínio por até 180 dias. Os cookies de estatísticas também têm duração configurada de 180 dias, sem renovação automática; o navegador pode aplicar limites menores. O Linkhub e o portfólio guardam escolhas separadas.</p>
      <p>Você pode recusar ou retirar a autorização nestas preferências. A retirada bloqueia novos eventos, tenta apagar os cookies de estatísticas deste site e recarrega a página para remover o serviço carregado. Isso não apaga dados já enviados ao Google. Se o navegador impedir salvar a escolha, ela vale nesta página e a recarga automática é evitada.</p>
      <p>Cliques indicam interesse, não comprovam que um arquivo foi salvo, uma mensagem enviada ou uma reunião marcada. Bloqueadores e escolhas de privacidade limitam os relatórios.</p>
      <p>Responsável: Guilherme Serafim. Contato: <a href="mailto:guilerstudies@gmail.com">guilerstudies@gmail.com</a>. Saiba como o fornecedor trata dados em <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">Privacidade do Google</a>.</p>
    </div>
  );
}
