# BELLIV Strategy · Site

Repositório do site da BELLIV Strategy.

## Design system

O design system da marca está em **[`design-system/`](design-system/)** e é a
referência para qualquer interface deste repositório. Documentação completa em
[`design-system/README.md`](design-system/README.md).

```
design-system/
├── tokens/
│   ├── belliv-tokens.css      # CSS custom properties · a fonte da verdade
│   ├── belliv-tokens.json     # mesmos valores em JSON (Figma, scripts)
│   └── tailwind.config.js     # mesmos valores como config Tailwind
├── css/
│   └── belliv-components.css  # botões, campos, cards, alertas, nav, tabelas
└── assets/                    # símbolo V e feixe, em SVG
```

### Uso rápido

```html
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;600&family=Instrument+Serif:ital@0;1&display=swap">

<link rel="stylesheet" href="design-system/tokens/belliv-tokens.css">
<link rel="stylesheet" href="design-system/css/belliv-components.css">
```

```html
<body class="bv">
  <section data-bv-theme="dark" class="bv-section">
    <p class="bv-eyebrow">Território estratégico</p>
    <h2 class="bv-display">Estratégia para transformar o que já existe.</h2>
    <button class="bv-btn bv-btn--primary">Falar com a Belliv</button>
  </section>
</body>
```

O tema **escuro é o padrão institucional** — Graphite é o fundo institucional e
60% do sistema de cor. Aplique `data-bv-theme="dark"`, `="violet"` ou deixe o
padrão (claro) por seção.

### Fontes

Instale antes de abrir qualquer arquivo de design. As duas são gratuitas:

- [Manrope](https://fonts.google.com/specimen/Manrope) — principal
- [Instrument Serif](https://fonts.google.com/specimen/Instrument+Serif) — destaque

## Documentação navegável

[`docs/index.html`](docs/index.html) é a documentação visual do sistema:
paleta com contrastes medidos, especímenes de tipografia, geometria do símbolo
e do feixe, temas e todos os componentes ao vivo. Página única e autocontida —
abra direto no navegador.

## Pontos abertos

Registrados na seção 10 da documentação e no
[README do design system](design-system/README.md#decisões-e-extensões):

- **Lilás sobre Ivory** mede 2.57:1 e reprova em WCAG em qualquer tamanho,
  embora o manual autorize para títulos acima de 40 px. Use Lilac Ink (7.04:1)
  quando o texto precisar ser lido.
- **Wordmark** ainda não vetorizado — depende de instalar a Manrope.
- **Sistema de ícones** e **paleta categórica para gráficos** não existem no
  manual e ainda precisam ser definidos.

---

Design system derivado do Manual da Marca BELLIV v1.0 (2026).
