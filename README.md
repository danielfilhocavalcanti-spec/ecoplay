# Educação Escolar, Saúde e Meio Ambiente — Educação Escolar, Saúde e Meio Ambiente

Projeto web com páginas educativas e jogos, organizado para funcionar como PWA (Progressive Web App).

## Arquivos principais
- `index.html`: página inicial
- `meio_ambiente.html`: conteúdo sobre meio ambiente
- `saude.html`: conteúdo sobre saúde
- `diversao.html`: área de jogos
- `ecoplay.html`, `bioaventura.html`, `aventura_da_aventura.html`: jogos educativos
- `style.css`: estilos compartilhados
- `manifest.json`: configuração de instalação
- `pwa.js`: botão de instalação e registro do service worker
- `service-worker.js`: cache para uso offline
- `imagens/`: ícones do aplicativo

## Como testar
1. Extraia todos os arquivos mantendo as pastas.
2. Para visualizar as páginas, abra `index.html` no navegador.
3. Para testar a instalação e o modo offline, publique o projeto em um servidor HTTPS (por exemplo, GitHub Pages) ou rode em `localhost`. Abrir o HTML diretamente pelo gerenciador de arquivos não permite todos os recursos de PWA.
4. Depois de publicar, abra a página no navegador compatível e use o menu do navegador para instalar, caso o botão de instalação não apareça.

## Observação
O cache offline depende das páginas e recursos realmente disponíveis no servidor. Se editar os nomes dos arquivos, atualize também as referências no HTML, no manifesto e no `service-worker.js`.
