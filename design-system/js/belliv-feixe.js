/**
 * BELLIV STRATEGY · Feixe Belliv
 * Grafismo único da marca (§07 do Manual da Marca v1.0).
 *
 * Geometria medida na página 9 do manual:
 *   - 13 raios de MESMO comprimento com origem comum
 *   - primeiro raio a 1° da vertical, passo constante de 7°, último a 85°
 *   - traço de 1 pt em escala de referência
 *   - opacidade de 100% na origem a 40% na ponta
 *
 * Regras que este módulo NÃO pode violar:
 *   - origem sempre em um canto inferior, abrindo para cima
 *   - apenas sobre Graphite (#18171C) ou Deep Violet (#302544)
 *   - nunca sobre Ivory, nunca sobre fotografia com muita informação
 *
 * Uso:
 *   BellivFeixe.mount(document.getElementById('feixe'));
 *   BellivFeixe.mount(el, { origin: 'bottom-right', fit: 'contain' });
 */
(function (global) {
  'use strict';

  var RAYS = 13;
  var FIRST_ANGLE = 1;   // graus a partir da vertical
  var STEP = 7;          // graus, constante
  var OPACITY_ORIGIN = 1;
  var OPACITY_TIP = 0.4;
  var LILAC_RGB = '169,139,239';   // #A98BEF

  var DEFAULTS = {
    origin: 'bottom-left',   // 'bottom-left' | 'bottom-right'
    fit: 'cover',            // 'cover' = pontas fora do quadro · 'contain' = 13 pontas visíveis
    color: LILAC_RGB,
    inset: 0.05,             // recuo da origem, em fração do lado (só em 'contain')
    maxDpr: 2
  };

  function angleOf(i) {
    return (FIRST_ANGLE + STEP * i) * Math.PI / 180;
  }

  /** Desenha o feixe uma vez no canvas, no tamanho de layout atual. */
  function draw(canvas, options) {
    if (!canvas || !canvas.getContext) { return; }
    var o = Object.assign({}, DEFAULTS, options || {});
    var ctx = canvas.getContext('2d');
    if (!ctx) { return; }

    var rect = canvas.getBoundingClientRect();
    var w = Math.max(1, Math.round(rect.width));
    var h = Math.max(1, Math.round(rect.height));
    var dpr = Math.min(global.devicePixelRatio || 1, o.maxDpr);

    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    var contain = o.fit === 'contain';
    var mirror = o.origin === 'bottom-right';
    var pad = contain ? Math.round(Math.min(w, h) * o.inset) : 0;

    var ox = mirror ? w - pad : pad;
    var oy = h - pad;

    // Comprimento comum dos 13 raios. Em 'contain' cabe inteiro no quadro;
    // em 'cover' passa da diagonal, então a moldura corta as pontas.
    var len = contain
      ? (Math.min(w, h) - pad * 2) * 0.95
      : Math.hypot(w, h) * 1.35;

    ctx.lineWidth = 1;
    ctx.lineCap = 'butt';

    for (var i = 0; i < RAYS; i++) {
      var a = angleOf(i);
      var x2 = ox + Math.sin(a) * len * (mirror ? -1 : 1);
      var y2 = oy - Math.cos(a) * len;

      var grad = ctx.createLinearGradient(ox, oy, x2, y2);
      grad.addColorStop(0, 'rgba(' + o.color + ',' + OPACITY_ORIGIN + ')');
      grad.addColorStop(1, 'rgba(' + o.color + ',' + OPACITY_TIP + ')');

      ctx.strokeStyle = grad;
      ctx.beginPath();
      ctx.moveTo(ox, oy);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  }

  /**
   * Desenha e mantém o feixe correto em redimensionamento e troca de fonte.
   * Devolve uma função para desmontar.
   */
  function mount(canvas, options) {
    if (!canvas) { return function () {}; }
    var raf = 0;

    function render() { draw(canvas, options); }

    function onResize() {
      global.cancelAnimationFrame(raf);
      raf = global.requestAnimationFrame(render);
    }

    render();
    global.addEventListener('resize', onResize);

    // fontes podem mudar a altura do bloco que contém o canvas
    if (global.document && global.document.fonts && global.document.fonts.ready) {
      global.document.fonts.ready.then(render).catch(function () {});
    }

    return function unmount() {
      global.cancelAnimationFrame(raf);
      global.removeEventListener('resize', onResize);
    };
  }

  global.BellivFeixe = {
    draw: draw,
    mount: mount,
    // constantes expostas para quem precisar reproduzir a construção
    RAYS: RAYS,
    FIRST_ANGLE: FIRST_ANGLE,
    STEP: STEP,
    LAST_ANGLE: FIRST_ANGLE + STEP * (RAYS - 1),
    OPACITY_ORIGIN: OPACITY_ORIGIN,
    OPACITY_TIP: OPACITY_TIP
  };
})(typeof window !== 'undefined' ? window : globalThis);
