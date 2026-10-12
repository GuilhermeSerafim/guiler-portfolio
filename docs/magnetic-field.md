# Malha magnética do hero

O efeito é renderizado no topo do portfólio. O parâmetro `?visual=original` permite conferir o mesmo layout sem a camada decorativa.

`src/components/MagneticField.tsx` desenha uma malha de pontos em Canvas 2D. No desktop, os pontos se afastam do cursor e retornam com uma mola amortecida. O desenho permanece estático quando os pontos se acomodam e em dispositivos de toque. As áreas de texto recebem menos contraste para preservar a leitura. Fotos, conteúdo, navegação e dimensões do hero permanecem iguais.

O canvas é decorativo, não intercepta eventos e é oculto de leitores de tela e da impressão. Respeita movimento reduzido e suspende o trabalho quando a aba está oculta ou o hero fora da tela. Limite de 30 fps e DPR 1,5. Nenhuma dependência nova.

A integração foi validada com `npm run build` (TypeScript e Vite), revisão de código e Chromium a 390 e 1440 px: sem overflow ou erros JavaScript, uma única camada magnética e três projetos. Interação do cursor, navegação para Projetos, movimento reduzido e suspensão fora da tela conferidos. A emulação não substitui testes em aparelhos físicos.
