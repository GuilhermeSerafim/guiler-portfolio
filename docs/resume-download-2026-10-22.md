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
