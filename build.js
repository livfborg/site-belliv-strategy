/**
 * BELLIV STRATEGY · build estático
 *
 * Gera index.html e 404.html na raiz do repositório a partir de src/views/.
 * Isso faz a raiz do repositório ser um site estático válido — necessário em
 * hospedagem compartilhada (Apache), onde não há runtime Node e o servidor
 * simplesmente serve arquivos.
 *
 * Os arquivos gerados são versionados de propósito: a integração Git da
 * Hostinger só faz pull, não roda build. Sem eles no repositório, o deploy
 * chegaria sem index.html.
 *
 *   npm run build
 *
 * Depois de editar qualquer coisa em src/views/, rode o build de novo.
 * `npm test` falha se os gerados estiverem fora de sincronia com a fonte.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { render, loadConfig } from './src/render.js';

const ROOT = resolve(fileURLToPath(new URL('.', import.meta.url)));
const PAGES = [
  { from: join('src', 'views', 'index.html'), to: 'index.html' },
  { from: join('src', 'views', '404.html'), to: '404.html' }
];

const BANNER = `<!--
  ARQUIVO GERADO — não edite aqui.
  Fonte: src/views/%s
  Gere de novo com: npm run build
-->
`;


/** Conteúdo que o arquivo gerado deve ter, dado o template. */
export async function buildPage(page, opts = {}) {
  const src = await readFile(join(ROOT, page.from), 'utf8');
  const body = render(src, opts);
  return BANNER.replace('%s', page.to) + body;
}

export async function build(opts = {}) {
  const config = await loadConfig();
  const contato = opts.contato ?? config.contato ?? {};
  const results = [];
  for (const page of PAGES) {
    const out = await buildPage(page, { contato, year: opts.year });
    await writeFile(join(ROOT, page.to), out, 'utf8');
    results.push({ ...page, bytes: Buffer.byteLength(out) });
  }
  return results;
}

export { PAGES };

// executado direto: npm run build
if (import.meta.url === `file://${process.argv[1]}`) {
  const results = await build();
  for (const r of results) {
    console.log(`[build] ${r.from} -> ${r.to}  (${r.bytes.toLocaleString('pt-BR')} bytes)`);
  }
  console.log('[build] pronto. Commite os arquivos gerados para o deploy por Git funcionar.');
}
