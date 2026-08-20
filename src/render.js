/**
 * BELLIV STRATEGY · render compartilhado
 *
 * Uma única implementação usada pelo servidor Node (em tempo de resposta) e
 * pelo build estático (em tempo de build). Antes isso estava duplicado em
 * server.js e build.js, com risco real de as duas versões divergirem.
 */

import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));

export function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

export async function loadConfig() {
  try {
    const raw = await readFile(join(ROOT, 'site.config.json'), 'utf8');
    return JSON.parse(raw);
  } catch {
    return { contato: {} };
  }
}

/** Só entra na página o canal que estiver preenchido na configuração. */
export function renderContato(contato = {}) {
  const canais = [];

  if (contato.email) {
    canais.push({
      rotulo: 'E-mail',
      valor: contato.email,
      href: `mailto:${contato.email}`
    });
  }
  if (contato.whatsapp) {
    const digitos = String(contato.whatsapp).replace(/\D/g, '');
    canais.push({
      rotulo: 'WhatsApp',
      valor: contato.whatsappLabel || contato.whatsapp,
      href: `https://wa.me/${digitos}`
    });
  }
  if (contato.instagram) {
    canais.push({ rotulo: 'Instagram', valor: '@belliv.strategy', href: contato.instagram });
  }
  if (contato.linkedin) {
    canais.push({ rotulo: 'LinkedIn', valor: 'BELLIV Strategy', href: contato.linkedin });
  }

  if (canais.length === 0) return '';

  const itens = canais.map((c) => `
        <li class="canal">
          <span class="canal__rotulo">${escapeHtml(c.rotulo)}</span>
          <a class="canal__valor" href="${escapeHtml(c.href)}">${escapeHtml(c.valor)}</a>
        </li>`).join('');

  return `<ul class="canais">${itens}
      </ul>`;
}

/** Aplica na página os valores que vêm da configuração e do ambiente. */
export function render(html, { contato = {}, year = new Date().getFullYear() } = {}) {
  return html
    .replace('<!--CONTATO-->', renderContato(contato))
    .replace(/<!--YEAR-->/g, String(year));
}
