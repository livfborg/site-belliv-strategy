/**
 * BELLIV STRATEGY · página de construção
 * Monta o feixe da marca no fundo. Nada além disso.
 */
(function () {
  'use strict';

  var canvas = document.getElementById('feixe');
  if (!canvas || !window.BellivFeixe) { return; }

  // Origem no canto inferior esquerdo, abrindo para cima, cortado pela moldura
  // — a composição de abertura do manual.
  window.BellivFeixe.mount(canvas, { origin: 'bottom-right', fit: 'cover' });
})();
