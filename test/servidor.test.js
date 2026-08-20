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
  process.env.CONTACT_EMAIL = 'teste@exemplo.com';
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

test('a página diz que o site está em construção', async () => {
  const html = await (await fetch(`${base}/`)).text();
  assert.match(html, /Site em construção/i);
  assert.match(html, /Estamos construindo o próximo passo/);
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

test('CONTACT_EMAIL é injetado quando definido', async () => {
  const html = await (await fetch(`${base}/`)).text();
  assert.match(html, /teste@exemplo\.com/);
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
