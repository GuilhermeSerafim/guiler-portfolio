# Currículo e interação de download

Correção local solicitada em 22/10/2026. Fonte: `.Net e React/Guilherme_Serafim_Fullstack.pdf`, fornecida pelo usuário. URL pública histórica preservada: `/GuilhermeSerafim_Fullstack.pdf`.

## Diagnóstico

O arquivo anterior tinha 309.405 bytes e respondia como PDF. O link com `download` funcionou no teste local anterior à alteração; a falha relatada não foi reproduzida nesse Chromium. A leitura pública encontrou `Content-Disposition: inline`, mas isso, isoladamente, não comprova a causa. O cursor não intercepta o clique e Analytics não cancela a navegação.

## Alteração

- Substituição pela fonte exata de 319.712 bytes, sem editar o documento. SHA-256: `F2D85743D548B95BD372B41247AF6A39C2637BDD3CBA7DEC257CC412F7EA0591`.
- Nome explícito `Guilherme_Serafim_Fullstack.pdf` nos downloads do hero e contato.
- Configuração de `Content-Disposition: attachment` somente no caminho do PDF; cache com revalidação. Estrutura conferida na [documentação oficial de headers da Vercel](https://vercel.com/docs/project-configuration/vercel-json#headers).
- Seta desce 3 px e sublinhado aparece em 220 ms no hero por hover/foco; contato compartilha o movimento da seta. Feedback de toque, alvo mínimo de 44 px e foco visível preservados.
- Movimento reduzido elimina deslocamento e transição. Nenhuma dependência, listener de download, toast de sucesso presumido ou mudança nos eventos de Analytics.

Os headers da Vercel só poderão ser verificados no servidor após publicação. Vite local não aplica `vercel.json`; o download local usa o atributo HTML nativo. Esta etapa permanece local.

## Verificação concluída

- Build TypeScript/Vite aprovado no fonte final (`index-B3P2Ycm4.js`, `index-_Ha3Z2El.css`).
- Quatro downloads reais no Chromium, por clique e toque emulado, nos links do hero e contato. Nome esperado, nenhum erro e navegação preservada.
- Os quatro arquivos baixados e o PDF em `dist` têm o mesmo SHA-256 e os mesmos 319.712 bytes da fonte.
- Hover e foco ativam seta/sublinhado; foco visível. Movimento reduzido deixa a seta estática, sem transição.
- Layouts de 390 e 320 px sem overflow; alvo do hero com 44 px. Nenhum `pageerror` nem request Google nos contextos novos.
- Roteiro e evidências em `<workspace>/output/playwright/resume-download-qa.js`, `resume-download-qa-result.json`, `resume-download-hover.png` e PDFs baixados.
- Revisão independente aprovada. Analytics, efeitos anteriores e revisão dos projetos preservados.

## Prévia local posterior: feedback de solicitação

Após a publicação da correção acima, o usuário aprovou experimentar localmente um retorno visual ao clicar. Branch `preview/resume-feedback`, sem push ou deploy.

- Links do hero e contato usam `ResumeDownloadLink`, mantendo caminho, nome de download e payload de Analytics.
- O clique anima apenas a seta por 360 ms e mostra `Download solicitado` por 2 segundos. O link continua nativo e imediato; o texto confirma a solicitação, sem afirmar que o arquivo foi salvo.
- Os dois rótulos ocupam a mesma célula de grid desde a primeira renderização, reservando a largura do maior texto. No celular, as ações podem ocupar linhas separadas; ativar o feedback não muda suas dimensões.
- Estado independente em cada link. Novo clique reinicia o timer e a animação; desmontagem limpa o timer. Status acessível e preferência por movimento reduzido preservados.
- Build e TypeScript aprovados: `index-C_IOJkTP.js` e `index-BGXw4l8E.css`.
- Verificação nos dois links em 1440, 390 e 320 px: download real, nome esperado, retorno ao estado inicial, dimensões estáveis e ausência de overflow/erros de página.
- Teclado, cliques repetidos e toque emulado aprovados. Movimento reduzido testado ao carregar e após alteração: seta sem animação.
- Os PDFs salvos pelo hero e contato mantiveram o SHA-256 da fonte (`F2D85743D548B95BD372B41247AF6A39C2637BDD3CBA7DEC257CC412F7EA0591`).
- Evidências em `<workspace>/output/playwright/resume-feedback-qa-result.json`, `resume-feedback-touch-qa-result.json`, capturas e PDFs `resume-feedback-*`.

Revisão local: http://127.0.0.1:5195/ e http://127.0.0.1:5195/#contato.
