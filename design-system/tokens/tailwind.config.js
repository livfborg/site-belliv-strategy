/**
 * BELLIV STRATEGY · Tailwind CSS config
 * Derivado do Manual da Marca BELLIV v1.0 (2026)
 *
 * Tailwind v3: use este arquivo como está.
 * Tailwind v4: os mesmos valores estão em tokens/belliv-tokens.css como
 *              custom properties — importe aquele arquivo e use @theme.
 *
 * Instale as fontes:
 *   <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx,vue,svelte}', './index.html'],
  darkMode: ['class', '[data-bv-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // Cores oficiais do manual (§05)
        lilac:      '#A98BEF',
        'lilac-ink':'#5B3FB0',
        'deep-violet':'#302544',
        graphite:   '#18171C',
        'soft-lilac':'#EAE4FA',
        ivory:      '#F8F7F2',

        // Escalas
        violet: {
          50:'#F4F1FE', 100:'#EAE4FA', 200:'#D8CDF7', 300:'#C3AEF2',
          400:'#A98BEF', 500:'#8E6AE4', 600:'#7452CF', 700:'#5B3FB0',
          800:'#45308A', 900:'#302544', 950:'#1E1830',
        },
        neutral: {
          0:'#FFFFFF', 50:'#F8F7F2', 100:'#F1EFE9', 200:'#E3E0D9',
          300:'#CAC7C2', 400:'#A5A2A6', 500:'#7C7A80', 600:'#5C5A61',
          700:'#414046', 800:'#2A292F', 900:'#18171C', 950:'#0F0E12',
        },

        // Funcionais — extensão para interface, fora do manual
        success:  { DEFAULT:'#1F6F5C', dark:'#5FC9AC' },
        warning:  { DEFAULT:'#8A5A12', dark:'#E5B15C' },
        danger:   { DEFAULT:'#A8283A', dark:'#F2818E' },
        info:     { DEFAULT:'#5B3FB0', dark:'#A98BEF' },

        // Semânticos ligados às custom properties (trocam com o tema)
        surface:  'var(--bv-surface)',
        'surface-raised': 'var(--bv-surface-raised)',
        'surface-brand':  'var(--bv-surface-brand)',
        content:  'var(--bv-text)',
        'content-muted': 'var(--bv-text-muted)',
        'content-brand': 'var(--bv-text-brand)',
        line:     'var(--bv-border)',
      },

      fontFamily: {
        sans:  ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', 'ui-serif', 'Georgia', 'serif'],
        mono:  ['Menlo', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },

      fontWeight: {
        // 200 wordmark · 300 títulos · 400 corpo · 600 rótulos
        extralight: '200', light: '300', normal: '400', semibold: '600',
      },

      fontSize: {
        // razão 1.25, base 16px — [tamanho, { line-height, letter-spacing }]
        xs:   ['0.75rem',   { lineHeight: '1.5' }],
        sm:   ['0.875rem',  { lineHeight: '1.5' }],
        base: ['1rem',      { lineHeight: '1.5' }],
        lg:   ['1.25rem',   { lineHeight: '1.5' }],
        xl:   ['1.5625rem', { lineHeight: '1.15' }],
        '2xl':['1.9531rem', { lineHeight: '1.15' }],
        '3xl':['2.4414rem', { lineHeight: '1.15' }],
        '4xl':['3.0518rem', { lineHeight: '1.05' }],
        '5xl':['3.8147rem', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        '6xl':['4.7684rem', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
      },

      letterSpacing: {
        tight:  '-0.02em',
        normal: '0',
        wide:   '0.08em',   // rótulos de seção
        wider:  '0.18em',   // rótulos institucionais
        widest: '0.38em',   // wordmark BELLIV
        sub:    '0.52em',   // subtítulo STRATEGY
      },

      lineHeight: { tight:'1.05', snug:'1.15', normal:'1.5', relaxed:'1.65' },

      spacing: {
        // base 4px, escala da marca
        1:'0.25rem', 2:'0.5rem', 3:'0.75rem', 4:'1rem', 5:'1.5rem', 6:'2rem',
        7:'2.5rem', 8:'3rem', 9:'4rem', 10:'5rem', 11:'6rem', 12:'8rem',
      },

      borderRadius: {
        // marca de ângulo vivo: raio é quase zero por princípio
        none:'0', sm:'2px', DEFAULT:'2px', md:'4px', full:'999px',
      },

      borderWidth: { hairline:'1px', DEFAULT:'1px', 2:'2px' },

      boxShadow: {
        sm:   '0 1px 2px rgb(24 23 28 / 0.06)',
        md:   '0 4px 16px rgb(24 23 28 / 0.08)',
        lg:   '0 16px 48px rgb(24 23 28 / 0.14)',
        focus:'0 0 0 3px rgb(169 139 239 / 0.45)',
        none: 'none',
      },

      transitionTimingFunction: {
        bv:      'cubic-bezier(0.2, 0, 0.2, 1)',
        'bv-out':'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionDuration: { fast:'120ms', DEFAULT:'200ms', slow:'420ms' },

      maxWidth: { container:'76rem', prose:'44rem' },

      backgroundImage: {
        // Feixe BELLIV — grafismo único (§07). Só sobre Graphite ou Deep Violet.
        'feixe':       "url('../assets/belliv-feixe-transparente.svg')",
        'feixe-right': "url('../assets/belliv-feixe-graphite-direita.svg')",
      },
    },
  },
  plugins: [],
}
