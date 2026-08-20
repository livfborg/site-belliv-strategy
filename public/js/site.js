/**
 * BELLIV STRATEGY · site institucional
 *
 * Três coisas, nenhuma decorativa:
 *   1. monta o feixe da marca no hero e no rodapé
 *   2. faz a barra de navegação assumir a cor da seção que está atrás dela
 *   3. marca no menu a seção em que o leitor está
 *
 * O item 2 existe por causa de uma regra do manual: Deep Violet nunca aparece
 * no mesmo bloco que Graphite. Uma barra fixa Graphite sobre uma seção violeta
 * violaria isso, então a barra acompanha a seção.
 */
(function () {
  'use strict';

  /* ------------------------------------------------------- feixe da marca */
  if (window.BellivFeixe) {
    var hero = document.getElementById('feixe-hero');
    var rodape = document.getElementById('feixe-rodape');

    if (hero) {
      window.BellivFeixe.mount(hero, { origin: 'bottom-right', fit: 'cover' });
    }
    if (rodape) {
      // bottom-right como no hero: o véu de legibilidade protege a coluna de
      // texto à esquerda, então é à direita que a convergência do leque fica
      // visível. Origem à esquerda desapareceria atrás do véu.
      window.BellivFeixe.mount(rodape, { origin: 'bottom-right', fit: 'cover' });
    }
  }

  /* --------------------------------------- cor da barra = cor da seção */
  var topo = document.getElementById('topo');

  // A própria barra carrega data-bv-theme (tema inicial vem do HTML, para não
  // piscar a cor errada no primeiro frame), então precisa sair da lista.
  var secoes = Array.prototype.slice.call(
    document.querySelectorAll('[data-bv-theme]')
  ).filter(function (el) {
    return el !== topo;
  });

  function temaDaSecaoAtras() {
    if (!topo) { return null; }
    var limite = topo.offsetHeight + 1;
    var atual = null;

    for (var i = 0; i < secoes.length; i++) {
      var r = secoes[i].getBoundingClientRect();
      // a seção que cruza a linha de baixo da barra é a que está atrás dela
      if (r.top <= limite && r.bottom > limite) {
        atual = secoes[i].getAttribute('data-bv-theme');
      }
    }
    return atual;
  }

  function sincronizarBarra() {
    var tema = temaDaSecaoAtras();
    if (topo && tema && topo.getAttribute('data-bv-theme') !== tema) {
      topo.setAttribute('data-bv-theme', tema);
    }
  }

  /* ------------------------------------------- seção atual no menu */
  var links = Array.prototype.slice.call(document.querySelectorAll('.topo__link'));
  var alvos = links
    .map(function (a) {
      var el = document.querySelector(a.getAttribute('href'));
      return el ? { link: a, el: el } : null;
    })
    .filter(Boolean);

  function marcarSecaoAtual() {
    if (!alvos.length) { return; }
    var linha = (topo ? topo.offsetHeight : 0) + window.innerHeight * 0.25;
    var atual = null;

    for (var i = 0; i < alvos.length; i++) {
      var r = alvos[i].el.getBoundingClientRect();
      if (r.top <= linha) { atual = alvos[i]; }
    }

    for (var j = 0; j < alvos.length; j++) {
      alvos[j].link.classList.toggle('is-atual', alvos[j] === atual);
      if (alvos[j] === atual) {
        alvos[j].link.setAttribute('aria-current', 'true');
      } else {
        alvos[j].link.removeAttribute('aria-current');
      }
    }
  }

  /* -------------------------------------------------------- agendamento */
  var agendado = false;
  function aoRolar() {
    if (agendado) { return; }
    agendado = true;
    window.requestAnimationFrame(function () {
      agendado = false;
      sincronizarBarra();
      marcarSecaoAtual();
    });
  }

  sincronizarBarra();
  marcarSecaoAtual();

  window.addEventListener('scroll', aoRolar, { passive: true });
  window.addEventListener('resize', aoRolar);
})();
