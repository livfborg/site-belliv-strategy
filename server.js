/**
 * BELLIV STRATEGY · servidor do site
 *
 * Sem dependências: só a biblioteca padrão do Node. Não existe `npm install`,
 * o que remove risco de supply chain e faz a aplicação subir em qualquer host
 * que rode Node 20 ou mais novo.
 *
 *   npm start        produção
 *   npm run dev      recarrega ao salvar
 *   npm test         teste de fumaça
 *
 * Variáveis de ambiente:
 *   PORT       porta HTTP (padrão 3000)
 *   HOST       interface (padrão 0.0.0.0)
 *   CONTACT_EMAIL   e-mail exibido na página. Se vazio, o bloco não aparece.
 */

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, resolve, normalize, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('.', import.meta.url)));
// PORT=0 é válido: pede ao sistema uma porta livre (usado nos testes).
// `Number(x) || 3000` cairia no fallback, porque 0 é falsy.
const PORT = parsePort(process.env.PORT, 3000);
const HOST = process.env.HOST || '0.0.0.0';
const CONTACT_EMAIL = (process.env.CONTACT_EMAIL || '').trim();
const DEV = process.env.NODE_ENV !== 'production';

/**
 * Diretórios servidos publicamente.
 *
 * `docs/` fica DE FORA de propósito: é a documentação interna da marca
 * (posicionamento, território verbal) e o repositório é privado, mas o site
 * publicado não é. Não exponha docs/ aqui.
 */
const STATIC_DIRS = ['/design-system', '/public'];

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.txt': 'text/plain; charset=utf-8'
};

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  // A página só carrega o próprio código e o Google Fonts.
  'Content-Security-Policy': [
    "default-src 'self'",
    "style-src 'self' https://fonts.googleapis.com",
    "font-src https://fonts.gstatic.com",
    "script-src 'self'",
    "img-src 'self' data:",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'none'"
  ].join('; ')
};

function parsePort(value, fallback) {
  if (value === undefined || value === '') return fallback;
  const n = Number(value);
  if (!Number.isInteger(n) || n < 0 || n > 65535) {
    console.warn(`[belliv] PORT inválida (${value}), usando ${fallback}.`);
    return fallback;
  }
  return n;
}

/** Traduz a URL pública para um caminho em disco, ou null se for inválida. */
function resolveStatic(urlPath) {
  const dir = STATIC_DIRS.find(
    (d) => urlPath === d || urlPath.startsWith(d + '/')
  );
  if (!dir) return null;

  // /public/x -> src/public/x   ·   /design-system/x -> design-system/x
  const rel = dir === '/public'
    ? join('src', 'public', urlPath.slice(dir.length))
    : join(dir.slice(1), urlPath.slice(dir.length));

  const filePath = resolve(join(ROOT, normalize(rel)));

  // barreira contra path traversal: tem de continuar dentro de ROOT
  if (filePath !== ROOT && !filePath.startsWith(ROOT + sep)) return null;
  return filePath;
}

async function readIfFile(filePath) {
  try {
    const info = await stat(filePath);
    if (!info.isFile()) return null;
    return { body: await readFile(filePath), size: info.size, mtime: info.mtime };
  } catch {
    return null;
  }
}

function send(res, status, body, headers = {}) {
  res.writeHead(status, { ...SECURITY_HEADERS, ...headers });
  if (body) res.end(body);
  else res.end();
}

/** Injeta no HTML os valores que vêm do ambiente. */
function renderPage(html) {
  const contactBlock = CONTACT_EMAIL
    ? `<a class="page__contact" href="mailto:${escapeHtml(CONTACT_EMAIL)}">${escapeHtml(CONTACT_EMAIL)}</a>`
    : '';
  return html
    .replace('<!--CONTACT-->', contactBlock)
    .replace(/<!--YEAR-->/g, String(new Date().getFullYear()));
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

const viewCache = new Map();
async function view(name) {
  if (!DEV && viewCache.has(name)) return viewCache.get(name);
  const raw = await readFile(join(ROOT, 'src', 'views', name), 'utf8');
  const out = renderPage(raw);
  viewCache.set(name, out);
  return out;
}

const server = createServer(async (req, res) => {
  try {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      return send(res, 405, 'Método não permitido', {
        'Content-Type': 'text/plain; charset=utf-8',
        Allow: 'GET, HEAD'
      });
    }

    let urlPath;
    try {
      urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    } catch {
      return send(res, 400, 'URL inválida', { 'Content-Type': 'text/plain; charset=utf-8' });
    }

    // saúde da aplicação, para o health check do host
    if (urlPath === '/health') {
      return send(res, 200, JSON.stringify({ status: 'ok', uptime: process.uptime() }), {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store'
      });
    }

    if (urlPath === '/' || urlPath === '/index.html') {
      const html = await view('index.html');
      return send(res, 200, html, {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': DEV ? 'no-store' : 'public, max-age=300'
      });
    }

    const filePath = resolveStatic(urlPath);
    if (filePath) {
      const file = await readIfFile(filePath);
      if (file) {
        const type = MIME[extname(filePath).toLowerCase()] || 'application/octet-stream';
        return send(res, 200, file.body, {
          'Content-Type': type,
          'Content-Length': file.size,
          'Last-Modified': file.mtime.toUTCString(),
          'Cache-Control': DEV ? 'no-store' : 'public, max-age=3600'
        });
      }
    }

    const notFound = await view('404.html');
    return send(res, 404, notFound, { 'Content-Type': 'text/html; charset=utf-8' });
  } catch (err) {
    console.error('[belliv] erro ao responder', req.method, req.url, err);
    return send(res, 500, 'Erro interno', { 'Content-Type': 'text/plain; charset=utf-8' });
  }
});

server.listen(PORT, HOST, () => {
  // a porta real: com PORT=0 quem escolhe é o sistema
  const { port } = server.address();
  console.log(`[belliv] site em http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${port}`);
  if (!CONTACT_EMAIL) {
    console.log('[belliv] CONTACT_EMAIL não definido — o bloco de contato não será exibido.');
  }
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    console.log(`\n[belliv] ${signal} recebido, encerrando.`);
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 5000).unref();
  });
}

export { server };
