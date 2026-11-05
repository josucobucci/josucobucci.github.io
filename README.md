# Portfólio

Portfólio interativo em formato de catálogo, feito com HTML, CSS e JavaScript puro, sem build. Hospedado no GitHub Pages.

## Rodar localmente

```bash
cd portfolio
python3 -m http.server 8000
# abra http://localhost:8000
```

> Abrir o `index.html` direto pelo explorador de arquivos (`file://`) não funciona, porque o navegador bloqueia o `fetch` do `projects.json`.

## Adicionar ou editar projetos

Tudo vem de [`data/projects.json`](data/projects.json):

- `projects[]`: cada projeto vira um card. O que tiver `"featured": true` vai pro banner principal.
- `features[]`: as features do projeto. Cada uma vira um card na fileira "feature por feature" e aparece listada no modal.
- `prototype`: `true` abre o protótipo de celular do projeto (o `id` precisa existir em `prototype.js`, `proto-clubix.js` ou `proto-hal.js`).
- `demo`: URL de uma versão web real (iframe), alternativa ao protótipo. Sem `prototype` nem `demo`, o botão aparece como "Demo em breve".
- `repo`: link do GitHub. Com `null`, a página mostra "Código privado".
- `related` e `relation`: ids de projetos que funcionam juntos e o texto que explica a relação.
- `comingSoon[]`: projetos anunciados que ainda não têm conteúdo.

## Publicar no GitHub Pages

1. Crie um repositório público chamado **`josucobucci.github.io`**.
2. Suba o conteúdo desta pasta para a branch `main`.
3. Em **Settings → Pages**, escolha *Deploy from a branch*, depois `main` e `/ (root)`.
4. O site fica em `https://josucobucci.github.io`.
