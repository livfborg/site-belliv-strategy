/**
 * Teste de fumaça do servidor. Sem dependências: usa node:test e fetch.
 *   npm test
 */
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';

let server;
let base;

before(async () => {
  process.env.PORT = '0';                 // porta livre, escolhida pelo SO
  ({ server } = await import('../server.js'));
  await new Promise((res) => {
    if (server.listening) return res();
    server.once('listening', res);
  });
  base = `http://127.0.0.1:${server.address().port}`;
});

after(() => server?.close());

test('a página inicial responde 200 e é HTML', async () => {
  const r = await fetch(`${base}/`);
  assert.equal(r.status, 200);
  assert.match(r.headers.get('content-type'), /text\/html/);
});

test('a home é o site institucional', async () => {
  const html = await (await fetch(`${base}/`)).text();
  assert.match(html, /Estratégia para transformar o que já existe/);
  assert.match(html, /We Belliv/);
});

test('as seções do site estão presentes e ancoradas', async () => {
  const html = await (await fetch(`${base}/`)).text();
  for (const id of ['essencia', 'servicos', 'territorio', 'metodo', 'ferramenta', 'escopo', 'contato']) {
    assert.match(html, new RegExp(`id="${id}"`), `falta a seção #${id}`);
  }
});

test('os serviços do catálogo aparecem', async () => {
  const html = await (await fetch(`${base}/`)).text();
  for (const s of ['Social Media', 'SEO', 'Newsletter', 'Google Ads', 'Meta Ads',
                   'LinkedIn Ads', 'Landing pages', 'ZapFlow', 'Análise de Dados']) {
    assert.ok(html.includes(s), `falta o serviço "${s}"`);
  }
});

/**
 * O material de origem era uma proposta para um cliente específico. Nada disso
 * pode vazar para o site público: nem o nome, nem as áreas de atuação, nem os
 * produtos do onboarding, nem os valores.
 */
test('nada do cliente da proposta aparece no site', async () => {
  const html = (await (await fetch(`${base}/`)).text()).toLowerCase();
  const proibidos = [
    'miguelles', 'nikolas', 'advocacia', 'advogad', 'escritório', 'escritorio',
    'previdenc', 'auxílio', 'auxilio', 'doença', 'moradia', 'residente',
    'fies', 'contrato nulo', 'servidores tempor', 'médic', 'oab',
    'r$', '4.600', '3.800', '3.500', '2.800'
  ];
  for (const termo of proibidos) {
    assert.ok(!html.includes(termo), `o site não deveria mencionar "${termo}"`);
  }
});

test('a barra de navegação abre com o tema do hero, sem piscar', async () => {
  const html = await (await fetch(`${base}/`)).text();
  assert.match(html, /<header class="topo" id="topo" data-bv-theme="dark">/);
});

test('cada seção declara o próprio tema da marca', async () => {
  const html = await (await fetch(`${base}/`)).text();
  const temas = [...html.matchAll(/data-bv-theme="(\w+)"/g)].map((m) => m[1]);
  assert.ok(temas.includes('dark'), 'falta seção Graphite');
  assert.ok(temas.includes('light'), 'falta seção Ivory');
  assert.ok(temas.includes('violet'), 'falta seção Deep Violet');
});

/**
 * Regra do manual (§05): Deep Violet nunca no mesmo bloco que Graphite.
 * Na prática: nunca duas seções adjacentes violet e dark.
 */
test('Deep Violet nunca fica adjacente a Graphite', async () => {
  const html = await (await fetch(`${base}/`)).text();
  const secoes = [...html.matchAll(/<(?:section|footer)[^>]*data-bv-theme="(\w+)"/g)]
    .map((m) => m[1]);

  for (let i = 1; i < secoes.length; i++) {
    const par = [secoes[i - 1], secoes[i]].sort().join('+');
    assert.notEqual(par, 'dark+violet',
      `seções ${i - 1} e ${i} são ${secoes[i - 1]} e ${secoes[i]} — precisa de Ivory entre elas`);
  }
});

test('a página carrega o design system, não CSS solto', async () => {
  const html = await (await fetch(`${base}/`)).text();
  assert.match(html, /\/design-system\/tokens\/belliv-tokens\.css/);
  assert.match(html, /\/design-system\/css\/belliv-components\.css/);
});

test('o tema institucional escuro está aplicado', async () => {
  const html = await (await fetch(`${base}/`)).text();
  assert.match(html, /data-bv-theme="dark"/);
});


test('os tokens do design system são servidos', async () => {
  const r = await fetch(`${base}/design-system/tokens/belliv-tokens.css`);
  assert.equal(r.status, 200);
  assert.match(r.headers.get('content-type'), /text\/css/);
  assert.match(await r.text(), /--bv-graphite:\s*#18171C/);
});

test('o módulo do feixe é servido como JavaScript', async () => {
  const r = await fetch(`${base}/design-system/js/belliv-feixe.js`);
  assert.equal(r.status, 200);
  assert.match(r.headers.get('content-type'), /javascript/);
});

test('/health responde para o health check do host', async () => {
  const r = await fetch(`${base}/health`);
  assert.equal(r.status, 200);
  assert.equal((await r.json()).status, 'ok');
});

test('endereço inexistente devolve 404 com a página da marca', async () => {
  const r = await fetch(`${base}/nao-existe`);
  assert.equal(r.status, 404);
  assert.match(await r.text(), /Esta página não existe/);
});

test('a documentação interna NÃO é servida', async () => {
  for (const p of ['/docs/index.html', '/docs/', '/README.md']) {
    assert.equal((await fetch(`${base}${p}`)).status, 404, `${p} deveria ser 404`);
  }
});

test('path traversal é bloqueado', async () => {
  const alvos = [
    '/design-system/../server.js',
    '/design-system/../package.json',
    '/public/../../server.js',
    '/design-system/%2e%2e/server.js'
  ];
  for (const p of alvos) {
    const r = await fetch(`${base}${p}`);
    assert.notEqual(r.status, 200, `${p} não deveria ser servido`);
  }
});

test('os estáticos da página são servidos em /public', async () => {
  for (const [p, tipo] of [
    ['/public/css/site.css', /text\/css/],
    ['/public/js/site.js', /javascript/],
    ['/public/css/pagina.css', /text\/css/],
    ['/public/favicon.svg', /image\/svg/]
  ]) {
    const r = await fetch(`${base}${p}`);
    assert.equal(r.status, 200, `${p} deveria existir`);
    assert.match(r.headers.get('content-type'), tipo);
  }
});

test('/robots.txt é servido e protege os caminhos internos', async () => {
  const r = await fetch(`${base}/robots.txt`);
  assert.equal(r.status, 200);
  const txt = await r.text();
  assert.match(txt, /Disallow: \/docs\//);
});

test('o JSON de tokens é bloqueado: carrega território verbal', async () => {
  const r = await fetch(`${base}/design-system/tokens/belliv-tokens.json`);
  assert.equal(r.status, 404);
});

test('sem canais configurados, nenhum link de contato é renderizado', async () => {
  const html = await (await fetch(`${base}/`)).text();
  assert.ok(!html.includes('class="canais"'), 'não deveria haver lista de canais');
  assert.ok(!html.includes('mailto:'), 'não deveria haver mailto vazio');
  assert.ok(!html.includes('wa.me'), 'não deveria haver link de WhatsApp vazio');
});

test('POST é rejeitado com 405', async () => {
  const r = await fetch(`${base}/`, { method: 'POST' });
  assert.equal(r.status, 405);
  assert.equal(r.headers.get('allow'), 'GET, HEAD');
});

test('cabeçalhos de segurança presentes', async () => {
  const h = (await fetch(`${base}/`)).headers;
  assert.equal(h.get('x-content-type-options'), 'nosniff');
  assert.equal(h.get('x-frame-options'), 'DENY');
  assert.match(h.get('content-security-policy'), /default-src 'self'/);
});

/**
 * O deploy por Git da Hostinger só faz pull: não roda build. Então os arquivos
 * gerados na raiz têm de estar versionados E em sincronia com src/views/.
 * Sem esta guarda, uma edição no template subiria sem efeito no site.
 */
test('o build estático está em sincronia com src/views', async () => {
  const { PAGES, buildPage } = await import('../build.js');
  const { readFile } = await import('node:fs/promises');

  for (const page of PAGES) {
    const esperado = await buildPage(page, { contactEmail: '', year: ANO_FIXO });
    const atual = await readFile(new URL(`../${page.to}`, import.meta.url), 'utf8');

    // o ano é dinâmico; compara ignorando-o
    const normaliza = (h) => h.replace(/\b20\d\d\b/g, 'ANO');
    assert.equal(
      normaliza(atual),
      normaliza(esperado),
      `${page.to} está desatualizado. Rode: npm run build`
    );
  }
});

const ANO_FIXO = 2026;
