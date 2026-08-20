# BELLIV STRATEGY · Design System

Sistema de design derivado do **Manual da Marca BELLIV v1.0 (2026)**.
Nada aqui contradiz o manual. Tudo que **não** está no manual e precisou ser
criado para viabilizar interface está marcado como **extensão** — veja
[Decisões e extensões](#decisões-e-extensões).

---

## Estrutura

```
belliv-design-system/
├── tokens/
│   ├── belliv-tokens.css      # CSS custom properties · a fonte da verdade
│   ├── belliv-tokens.json     # mesmos valores em JSON (Figma, scripts, Style Dictionary)
│   └── tailwind.config.js     # mesmos valores como config Tailwind
├── css/
│   └── belliv-components.css  # camada de componentes (botões, forms, cards, nav…)
├── js/
│   └── belliv-feixe.js        # o feixe da marca em canvas, geometria travada
├── assets/
│   ├── belliv-simbolo-v.svg                 # símbolo V · Belliv Lilac
│   ├── belliv-simbolo-v-ink.svg             # símbolo V · Lilac Ink
│   ├── belliv-simbolo-v-ivory.svg           # símbolo V · Ivory (p/ fundo escuro)
│   ├── belliv-simbolo-v-graphite.svg        # símbolo V · Graphite (p/ fundo claro)
│   │
│   ├── belliv-feixe-referencia.svg          # CONSTRUÇÃO · sem fundo, 13 pontas visíveis
│   ├── belliv-feixe-referencia-graphite.svg # CONSTRUÇÃO · sobre Graphite
│   ├── belliv-feixe-referencia-violet.svg   # CONSTRUÇÃO · sobre Deep Violet
│   │
│   ├── belliv-feixe-graphite.svg            # APLICAÇÃO · 16:9 sobre Graphite
│   ├── belliv-feixe-violet.svg              # APLICAÇÃO · 16:9 sobre Deep Violet
│   ├── belliv-feixe-graphite-direita.svg    # APLICAÇÃO · origem no canto inf. direito
│   └── belliv-feixe-transparente.svg        # APLICAÇÃO · sem fundo, para compor
└── README.md
```

---

## Instalação

### 1. Fontes

As duas fontes da marca estão no Google Fonts e **não estão instaladas nesta
máquina**. Para trabalhar em ferramenta de design (Figma, Illustrator, InDesign),
baixe e instale:

- **Manrope** — https://fonts.google.com/specimen/Manrope
- **Instrument Serif** — https://fonts.google.com/specimen/Instrument+Serif

Para web:

```html
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap">
```

### 2. CSS puro

```html
<link rel="stylesheet" href="tokens/belliv-tokens.css">
<link rel="stylesheet" href="css/belliv-components.css">
<body class="bv">…</body>
```

### 3. Tailwind

**v3** — use `tokens/tailwind.config.js` como seu config.

**v4** — importe os tokens e exponha via `@theme`:

```css
@import "tailwindcss";
@import "./tokens/belliv-tokens.css";

@theme {
  --color-lilac: var(--bv-lilac);
  --color-graphite: var(--bv-graphite);
  --font-sans: var(--bv-font-sans);
  --font-serif: var(--bv-font-serif);
  /* … */
}
```

---

## Temas

O tema **escuro é o institucional** — o manual define Graphite como fundo
institucional e 60% do uso de cor. O claro é a exceção editorial.

| Tema | Como aplicar | Fundo | Quando usar |
|---|---|---|---|
| Escuro | `data-bv-theme="dark"` ou `.bv-dark` | Graphite `#18171C` | Padrão institucional: site, capa, apresentação, social |
| Claro | padrão (`:root`) | Ivory `#F8F7F2` | Documentos, leitura longa, papelaria |
| Violeta | `data-bv-theme="violet"` ou `.bv-violet` | Deep Violet `#302544` | Superfície de destaque, seção de ruptura |

Os temas trocam apenas a camada semântica. Componentes não mudam de classe.

```html
<section class="bv-violet bv-section">
  <p class="bv-eyebrow">Território estratégico</p>
  <h2 class="bv-display">Estratégia para transformar o que já existe.</h2>
</section>
```

> **Regra do manual (§05):** Deep Violet **nunca no mesmo bloco** que Graphite.
> Use um ou o outro por seção, nunca adjacentes sem separação.

---

## Cor

### Paleta oficial (§05)

| Token | Hex | Nome | Papel |
|---|---|---|---|
| `--bv-graphite` | `#18171C` | Graphite | Fundo institucional · **60%** |
| `--bv-ivory` | `#F8F7F2` | Ivory | Papel · **25%** |
| `--bv-deep-violet` | `#302544` | Deep Violet | Superfície de destaque · **10%** |
| `--bv-lilac` | `#A98BEF` | Belliv Lilac | Acento: títulos, símbolo, detalhes · **5%** |
| `--bv-lilac-ink` | `#5B3FB0` | Lilac Ink | Texto e link em fundo claro |
| `--bv-soft-lilac` | `#EAE4FA` | Soft Lilac | Superfície clara de marca |

### Contraste — medido, não estimado

Todas as combinações foram calculadas em WCAG 2.1:

| Combinação | Razão | Nível | Uso |
|---|---|---|---|
| Graphite sobre Ivory | 16.62:1 | AAA | Texto padrão claro |
| Lilac Ink sobre Ivory | 7.04:1 | AAA | Texto corrido e link em claro |
| Ivory sobre Graphite | 16.62:1 | AAA | Texto padrão escuro |
| Belliv Lilac sobre Graphite | 6.47:1 | AA | Texto e link em escuro |
| Belliv Lilac sobre Deep Violet | 5.17:1 | AA | Texto e link em violeta |
| Ivory sobre Deep Violet | 13.28:1 | AAA | Texto em violeta |
| **Belliv Lilac sobre Ivory** | **2.57:1** | **reprovado** | ver aviso abaixo |

> ### ⚠️ Um ponto a corrigir no manual
>
> O manual (§05) autoriza *"Lilac sobre Ivory: apenas títulos acima de 40px"*.
> Essa combinação mede **2.57:1**. O mínimo WCAG para texto grande é **3:1** —
> ou seja, ela **não passa nem como texto grande**, em nenhum tamanho.
>
> Neste sistema, `--bv-text-display` em tema claro carrega essa cor e está
> marcado como **decorativo**. Se o título precisa ser lido — e um título
> precisa — use `--bv-text-brand` (Lilac Ink, 7.04:1). Reserve o lilás sobre
> Ivory para elemento gráfico puro, onde nenhuma informação depende dele.
>
> Em fundo escuro não existe esse problema: o lilás mede 6.47:1 e é a cor
> correta de texto e link, exatamente como o manual determina.

### Cores funcionais — extensão

O manual não define cores de sistema (sucesso, erro, alerta). Interface precisa
delas. Foram escolhidas frias e dessaturadas para respeitar *"evitar cores
quentes saturadas"* (§08), e cada uma passa AA na superfície a que se destina.

| Papel | Claro | Escuro |
|---|---|---|
| Sucesso | `#1F6F5C` · 5.62:1 AA | `#5FC9AC` · 8.86:1 AAA |
| Alerta | `#8A5A12` · 5.51:1 AA | `#E5B15C` · 9.15:1 AAA |
| Erro | `#A8283A` · 6.46:1 AA | `#F2818E` · 7.05:1 AAA |
| Informação | `#5B3FB0` (Lilac Ink) | `#A98BEF` (Belliv Lilac) |

**Uso restrito a feedback de sistema.** Nunca em peça de marca, nunca perto do
logotipo — o manual proíbe cor fora da paleta na assinatura (§04).

---

## Tipografia

| Família | Papel | Regra |
|---|---|---|
| **Manrope** | Principal · títulos institucionais, texto, interface, assinaturas | — |
| **Instrument Serif** | Destaque · frases de marca e aberturas editoriais | **Nunca em texto corrido** (§06) |
| **Menlo** | Rótulos técnicos e código | Só em contexto técnico |

### Pesos (§06)

| Peso | Uso |
|---|---|
| ExtraLight 200 | Wordmark e títulos grandes |
| Light 300 | Títulos |
| Regular 400 | Texto corrido |
| SemiBold 600 | Rótulos e ênfase |

### Escala

Razão **1.25** (major third), base 16px. `--bv-text-xs` a `--bv-text-6xl`.

### Tracking — a assinatura da marca

O letterspacing largo é o que identifica a BELLIV tipograficamente, mais até
que a paleta. Não improvise valores:

| Token | Valor | Uso |
|---|---|---|
| `--bv-tracking-wide` | `0.08em` | Rótulos de seção, botões |
| `--bv-tracking-wider` | `0.18em` | Rótulos institucionais (`.bv-eyebrow`) |
| `--bv-tracking-widest` | `0.38em` | Wordmark BELLIV |
| `--bv-tracking-sub` | `0.52em` | Subtítulo STRATEGY |
| `--bv-tracking-tight` | `-0.02em` | Display serif |

---

## Logotipo

```html
<span class="bv-wordmark" style="font-size: 2rem">
  <span class="bv-wordmark__name">Belliv</span>
  <span class="bv-wordmark__descriptor">Strategy</span>
</span>
```

O lockup escala com `font-size`. As classes já aplicam o tracking correto e
compensam o espaço fantasma que o tracking cria à direita.

- **Área de respiro (§04):** margem mínima = altura da letra B em todos os
  lados. `.bv-wordmark-clearspace` aplica `1em`, que equivale à altura do B na
  escala do lockup.
- **Tamanho mínimo:** 24 mm de largura.
- **Proibido (§04):** distorcer ou inclinar · aplicar sobre gradiente · usar
  cor fora da paleta · colorir letras isoladas.

> ⚠️ **Para peça final, converta o wordmark em curvas.** O lockup em CSS/SVG
> depende da Manrope estar carregada; se a fonte falha, o logotipo quebra.
> Os SVGs em `assets/` do **símbolo** já são curvas — o **wordmark** não, porque
> a Manrope não está instalada nesta máquina e não pôde ser vetorizada aqui.

---

## Sistema gráfico

O manual descreve o símbolo e o feixe em palavras, mas não dá números. Os
valores abaixo foram **medidos pixel a pixel** nas páginas 5 e 9 do PDF, e a
construção resultante foi conferida contra o original lado a lado.

### Símbolo V (§03)

Vision · Value · Velocity · Visionary thinking. Um vetor que abre caminhos.
**Não é a letra V da tipografia.**

| Parâmetro | Valor |
|---|---|
| Abertura total | **50,67°** (meia-abertura 25,335°) |
| Largura / altura | **0,8983** |
| Espessura | **12% da altura**, perpendicular ao eixo do braço |
| Vértice interno | **71,96%** da altura |
| Terminais superiores | corte **perpendicular ao eixo do braço** |
| Vértice inferior | **ângulo vivo**, sem raio |

O detalhe que se perde se você redesenhar de olho: **os terminais do topo são
cortados perpendicularmente ao braço**, não na horizontal. Por isso o canto
interno de cada braço fica mais alto que o externo. Um V com corte horizontal
não é o símbolo da BELLIV.

Path pronto (viewBox `0 0 134.740 150`):

```
M 0.000 7.702 L 67.370 150.000 L 134.740 7.702
L 118.472 0.000 L 67.370 107.935 L 16.269 0.000 Z
```

### Feixe BELLIV (§07)

Grafismo único — **não existem duas versões**.

| Parâmetro | Valor |
|---|---|
| Raios | **13**, todos de **mesmo comprimento** |
| Primeiro raio | **1°** da vertical |
| Passo angular | **7°**, constante |
| Último raio | **85°** da vertical |
| Abertura do leque | **84°** |
| Traço | **1pt** em escala de referência |
| Opacidade | **100% na origem → 40% na ponta** (gradiente por raio) |
| Origem | sempre em **canto inferior**, abrindo **para cima** |
| Fundo | apenas **Graphite** ou **Deep Violet** |

Os 13 raios têm o **mesmo comprimento** — as pontas descrevem um arco, não a
moldura. Isso é visível na página 9 do manual e é a chave da construção: o feixe
não é "linhas cortadas pela borda", é um leque de raios iguais. Em aplicação
ampliada (capa, abertura) as pontas caem fora do quadro e o corte fica invisível
— mas a construção continua sendo a mesma.

Por isso há duas famílias de asset:

| Arquivo | Uso |
|---|---|
| `belliv-feixe-referencia*.svg` | Quadrado, as 13 pontas visíveis. É a **construção** — use para conferir e redesenhar. |
| `belliv-feixe-graphite.svg` e variantes | 16:9, feixe ampliado e cortado pela moldura. É a **aplicação** — capa, abertura, seção. |

Duas formas de aplicar. Em CSS, para um bloco estático:

```html
<section class="bv-dark bv-fan bv-section">…</section>
<section class="bv-dark bv-fan bv-fan--right bv-section">…</section>
```

Em canvas, quando o feixe precisa acompanhar redimensionamento e ficar nítido
em tela retina — é o caminho recomendado para hero e abertura:

```html
<canvas id="feixe"></canvas>
<script src="js/belliv-feixe.js"></script>
<script>
  BellivFeixe.mount(document.getElementById('feixe'), {
    origin: 'bottom-right',   // 'bottom-left' | 'bottom-right'
    fit: 'cover'              // 'cover' corta as pontas · 'contain' mostra as 13
  });
</script>
```

| Opção | Padrão | O que faz |
|---|---|---|
| `origin` | `'bottom-left'` | Canto de origem. Só os dois cantos inferiores. |
| `fit` | `'cover'` | `'cover'` amplia e a moldura corta · `'contain'` mostra as 13 pontas. |
| `color` | lilás | Cor do traço em `'r,g,b'`. Troque só por Deep Violet ou lilás. |
| `inset` | `0.05` | Recuo da origem, fração do lado. Só em `'contain'`. |

`BellivFeixe.mount()` devolve uma função para desmontar. As constantes da
construção ficam expostas em `BellivFeixe.RAYS`, `.FIRST_ANGLE`, `.STEP`,
`.LAST_ANGLE` — se você precisar reproduzir a geometria em outra ferramenta,
leia dali em vez de recopiar números.

> **O véu de legibilidade.** O manual proíbe o feixe sobre conteúdo com muita
> informação. Quando o texto tiver de conviver com o grafismo, ponha entre os
> dois um gradiente da própria cor da superfície, dissolvendo na direção em que
> o leque abre. É o que a página de construção faz — veja
> `src/public/css/pagina.css`. Em viewport estreita o leque alcança a coluna de
> texto e o véu precisa avançar mais.

`belliv-feixe-graphite-direita.svg` é o **mesmo** grafismo espelhado para o canto
inferior direito — posicionamento, não versão nova.

> ⚠️ **Uma imprecisão no arquivo original.** Das 13 linhas da página 9, doze caem
> exatamente na grade de 7°. A décima segunda está **1,7° fora** (79,6° onde a
> grade pede 77,9°). É desvio do arquivo, não regra. Os assets aqui usam a grade
> regular de 7° — se você comparar com o PDF, essa é a única diferença.

**Nunca** em Ivory · **nunca** sobre fotografia com muita informação.

---

## Componentes

Prefixo `bv-`. Nenhum componente contém valor cru: tudo referencia token
semântico, então todos funcionam nos três temas sem troca de classe.

| Grupo | Classes |
|---|---|
| Tipografia | `.bv-eyebrow` `.bv-display` `.bv-display-translation` `.bv-h1`–`.bv-h4` `.bv-body` `.bv-link` |
| Marca | `.bv-wordmark` `.bv-signature` `.bv-symbol` `.bv-fan` |
| Ação | `.bv-btn` + `--primary` `--secondary` `--ghost` `--danger` `--sm` `--lg` |
| Formulário | `.bv-field` `.bv-label` `.bv-input` `.bv-select` `.bv-textarea` `.bv-help` `.bv-error` |
| Superfície | `.bv-card` + `--brand` `--vector` · `.bv-alert` + `--info` `--success` `--warning` `--danger` |
| Estrutura | `.bv-rule-list` `.bv-index` `.bv-table` `.bv-nav` `.bv-tag` |
| Layout | `.bv-container` `.bv-section` `.bv-grid` + `--2` `--3` `--4` `--editorial` `.bv-divider` |

### Geometria de interface

A marca é de **ângulo vivo** — o vértice do símbolo é agudo, o feixe é reto.
Por isso o raio de borda é quase zero por princípio: `--bv-radius-md` (4px) é o
**máximo** para superfície de interface. `--bv-radius-pill` só em tag e badge.

Sombra é recurso secundário: em marca escura, profundidade vem de superfície
(`--bv-surface-raised`, `--bv-surface-sunken`), não de sombra.

---

## Acessibilidade

- Todo par de cor do sistema foi **medido** em WCAG 2.1 — as razões estão nas
  tabelas acima e como comentário em `belliv-tokens.css`.
- `--bv-text-subtle` em tema claro mede 3.95:1: **só a partir de 24px** ou em
  SemiBold a partir de 19px. Em tema escuro mede 7.06:1 e é livre.
- Foco visível é obrigatório. `.bv :focus-visible` aplica anel de 2px na cor de
  marca. Nunca remova sem substituir por indicador equivalente.
- `prefers-reduced-motion` zera as durações automaticamente.
- Instrument Serif tem contraste de traço alto e hastes finas: em corpo de texto
  ela prejudica legibilidade. A proibição do manual (§06) é também uma regra de
  acessibilidade — respeite.

---

## Decisões e extensões

O manual cobre marca. Um design system precisa cobrir interface. Onde faltou
definição, a escolha está registrada aqui:

| # | Item | Situação | Decisão |
|---|---|---|---|
| 1 | Escala violeta 50–950 | Extensão | Derivada das 4 cores oficiais, que ocupam as posições 100, 400, 700 e 900. As oficiais não foram alteradas. |
| 2 | Escala neutra 0–950 | Extensão | Ivory na posição 50, Graphite na 900. Ponta clara quente (papel), ponta escura fria (tinta). |
| 3 | Cores funcionais | Extensão | Frias e dessaturadas, todas AA na superfície de destino. Uso restrito a feedback de sistema. |
| 4 | Escala tipográfica | Extensão | Razão 1.25, base 16px. O manual define famílias e pesos, não tamanhos. |
| 5 | Escala de espaço | Extensão | Base 4px. |
| 6 | Raio de borda | Extensão | Máximo 4px, derivado do princípio de ângulo vivo do símbolo. |
| 7 | Lilás sobre Ivory | **Conflito** | O manual autoriza para títulos ≥40px; mede 2.57:1 e reprova em WCAG. Marcado como decorativo. Ver aviso na seção Cor. |
| 8 | Wordmark vetorizado | **Pendente** | Manrope não está instalada nesta máquina; o wordmark ficou como lockup CSS. Precisa ser convertido em curvas em ferramenta de design. |
| 9 | Fotografia | Fora de escopo | O manual (§08) define direção — arquitetura, tecnologia, luz fria, sem pessoas. Não há imagens para catalogar aqui. |

### O que ainda falta decidir com você

- **Vetorizar o wordmark** (item 8) — precisa da Manrope instalada.
- **Ícones**: o manual não define sistema de ícones. Recomendo traço de 1.5px,
  terminais retos e cantos vivos, para acompanhar o feixe e o símbolo.
- **Componentes de dados**: gráficos e dashboards precisam de paleta
  categórica, que não existe no manual. A escala violeta sozinha não separa
  séries o suficiente.

---

*Derivado do Manual da Marca BELLIV v1.0 · 2026 · Documento interno*
