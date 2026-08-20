# BELLIV Strategy · Site

Aplicação Node.js do site da BELLIV Strategy. No ar hoje: uma página de
construção. O design system da marca já está no repositório e é o que a página
consome.

## Rodar

Precisa de **Node 20 ou mais novo**. Não há dependências — não existe
`npm install`.

```bash
npm start          # produção, porta 3000
npm run dev        # recarrega ao salvar
npm run build      # gera os HTML estáticos da raiz
npm test           # 17 testes
```

Abra <http://localhost:3000>.

### Variáveis de ambiente

| Variável | Padrão | O que faz |
|---|---|---|
| `PORT` | `3000` | Porta HTTP. `0` pede uma porta livre ao sistema. |
| `HOST` | `0.0.0.0` | Interface de escuta. |
| `CONTACT_EMAIL` | vazio | E-mail exibido na página. Vazio esconde o bloco. |
| `NODE_ENV` | — | `production` liga cache de views e de estáticos. |

## Estrutura

```
index.html                 GERADO por npm run build — não edite
404.html                   GERADO por npm run build — não edite
.htaccess                  regras Apache (hospedagem compartilhada)
robots.txt
server.js                  servidor HTTP, só biblioteca padrão do Node
build.js                   gera os HTML estáticos a partir de src/views/
package.json               scripts e engines. Zero dependências.
src/views/
├── index.html             FONTE da página de construção
└── 404.html               FONTE do erro 404
public/
├── css/pagina.css         estilo da página (só tokens, nenhum valor cru)
├── js/pagina.js           monta o feixe no fundo
└── favicon.svg            símbolo V da marca
design-system/             o design system (ver seção abaixo)
docs/index.html            documentação visual — NÃO servida na web
test/servidor.test.js      17 testes
```

Os HTML da raiz são **gerados**. Edite `src/views/` e rode `npm run build`.

### Rotas

| Rota | Resposta |
|---|---|
| `/` | Página de construção |
| `/health` | `{"status":"ok"}` para health check do host |
| `/design-system/*` | Tokens, CSS de componentes, assets e JS da marca |
| `/public/*` | Estáticos da página |
| qualquer outra | 404 com a página da marca |

`docs/` **não é servido de propósito**: é documentação interna da marca
(posicionamento, território verbal). O repositório é privado, mas um site
publicado não é.

## Design system

Está em **[`design-system/`](design-system/)** e é a referência para qualquer
interface deste repositório. Documentação técnica completa em
[`design-system/README.md`](design-system/README.md); documentação visual em
[`docs/index.html`](docs/index.html) — página única, autocontida, abre no
navegador.

```
design-system/
├── tokens/
│   ├── belliv-tokens.css      CSS custom properties · a fonte da verdade
│   ├── belliv-tokens.json     mesmos valores em JSON (Figma, scripts)
│   └── tailwind.config.js     mesmos valores como config Tailwind
├── css/
│   └── belliv-components.css  botões, campos, cards, alertas, nav, tabelas
├── js/
│   └── belliv-feixe.js        o feixe da marca, geometria do manual
└── assets/                    símbolo V e feixe, em SVG
```

### Usar em uma página nova

```html
<html lang="pt-BR" data-bv-theme="dark">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;600&family=Instrument+Serif:ital@0;1&display=swap">
<link rel="stylesheet" href="/design-system/tokens/belliv-tokens.css">
<link rel="stylesheet" href="/design-system/css/belliv-components.css">

<body class="bv">
  <p class="bv-eyebrow">Território estratégico</p>
  <h1 class="bv-display">Estratégia para transformar o que já existe.</h1>
  <button class="bv-btn bv-btn--primary">Falar com a Belliv</button>
</body>
```

O tema **escuro é o padrão institucional** — Graphite é o fundo institucional e
60% do sistema de cor. Use `data-bv-theme="dark"`, `="violet"` ou deixe o padrão
(claro) por seção.

### Grafismo do feixe

```html
<canvas id="feixe"></canvas>
<script src="/design-system/js/belliv-feixe.js"></script>
<script>
  BellivFeixe.mount(document.getElementById('feixe'), {
    origin: 'bottom-right',   // 'bottom-left' | 'bottom-right'
    fit: 'cover'              // 'cover' corta as pontas · 'contain' mostra as 13
  });
</script>
```

O módulo trava a geometria medida no manual: 13 raios de mesmo comprimento,
passo de 7°, de 1° a 85° da vertical, opacidade de 100% na origem a 40% na
ponta. **Só sobre Graphite ou Deep Violet** — nunca em Ivory, nunca sobre
fotografia com muita informação.

### Fontes

Instale antes de abrir qualquer arquivo de design. As duas são gratuitas:

- [Manrope](https://fonts.google.com/specimen/Manrope) — principal
- [Instrument Serif](https://fonts.google.com/specimen/Instrument+Serif) — destaque

## Publicar na Hostinger

O repositório funciona nos dois modos de hospedagem da Hostinger. **A diferença
importa**: em plano compartilhado o `server.js` não roda.

### Hospedagem compartilhada (Premium, Business, Cloud)

É Apache servindo arquivos. Não existe runtime Node — `server.js` fica no
repositório mas nunca executa. O site é servido pelos **arquivos estáticos**
`index.html` e `404.html` da raiz, e pelo `.htaccess`.

No hPanel: **Avançado › Git**, aponte para o repositório, branch `main`, e defina
o diretório de instalação como **`public_html`**. A raiz do repositório passa a
ser a raiz web — é para isso que a estrutura está montada, com `/public/*` e
`/design-system/*` batendo 1:1 com a URL.

Como o deploy só faz `git pull` e não roda build, **`index.html` e `404.html`
são versionados**. Depois de editar qualquer coisa em `src/views/`:

```bash
npm run build      # regenera index.html e 404.html
git commit -am "..." && git push
```

`npm test` falha se você esquecer o build, então o erro não passa em silêncio.

**Ative o SSL antes de forçar HTTPS.** O redirecionamento está comentado no fim
do `.htaccess`. Ligar antes do certificado existir gera loop e tira o site do
ar.

### VPS

Aí sim o Node roda. `npm start`, health check em `/health`, porta em `PORT`.
Use um gerenciador de processo (systemd, pm2) e um proxy reverso na frente.
Nesse modo o `.htaccess` é ignorado e quem aplica as regras é o `server.js`.

### O que o `.htaccess` protege

Em deploy por Git o repositório **inteiro** vira raiz web. Sem as regras, isto
ficaria público em `https://seudominio/`:

| Caminho | Por que precisa bloquear |
|---|---|
| `docs/` | Documentação interna da marca: posicionamento, território verbal |
| `design-system/tokens/belliv-tokens.json` | Carrega o território verbal e a personalidade |
| `src/`, `test/` | Fonte dos templates e testes |
| `server.js`, `build.js`, `package.json` | Código e metadados |
| `*.md` | READMEs |

Verificado com Apache real: todos devolvem 403 ou 404. Se algum dia mudar de
host, **confira isso antes de apontar o domínio** — a proteção depende do
servidor honrar o `.htaccess`.

## Pontos abertos

Registrados na seção 10 da documentação visual e no
[README do design system](design-system/README.md#decisões-e-extensões):

- **Lilás sobre Ivory** mede 2.57:1 e reprova em WCAG em qualquer tamanho,
  embora o manual autorize para títulos acima de 40 px. Use Lilac Ink (7.04:1)
  quando o texto precisar ser lido.
- **Wordmark** ainda não vetorizado — depende de instalar a Manrope.
- **Sistema de ícones** e **paleta categórica para gráficos** não existem no
  manual e ainda precisam ser definidos.

---

Design system derivado do Manual da Marca BELLIV v1.0 (2026).
