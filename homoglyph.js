/* homoglyph.js — análisis de dominios homográficos (Un Fantasma en el Sistema, MIT)
 * Funciona en el navegador (window.Homoglyph) y en Node (module.exports).
 * El punycode lo calcula el propio parser de URL del entorno (IDNA real). */
(function (root) {
  'use strict';

  // Carácter que no es latino básico → letra latina a la que imita.
  var CONFUSABLE = {
    // Cirílico
    'а': 'a', 'е': 'e', 'о': 'o', 'р': 'p', 'с': 'c',
    'у': 'y', 'х': 'x', 'і': 'i', 'ј': 'j', 'ӏ': 'l',
    'ѕ': 's', 'һ': 'h', 'ԁ': 'd', 'ԛ': 'q', 'ԝ': 'w',
    'ѵ': 'v', 'ɡ': 'g',
    // Griego
    'ο': 'o', 'α': 'a', 'ρ': 'p', 'ν': 'v', 'τ': 't',
    'ι': 'i', 'κ': 'k', 'υ': 'u', 'ε': 'e', 'χ': 'x',
    // Latín ampliado que imita letras básicas
    'ı': 'i', 'ɑ': 'a', 'ɩ': 'i', 'ǀ': 'l'
  };

  function scriptOf(ch) {
    var c = ch.codePointAt(0);
    if ((c >= 0x30 && c <= 0x39) || ch === '-') return 'common';
    if (c >= 0x61 && c <= 0x7A) return 'ascii';
    if (c >= 0x00C0 && c <= 0x024F) return 'latin';
    if (c >= 0x0250 && c <= 0x02AF) return 'latin';
    if (c >= 0x0370 && c <= 0x03FF) return 'greek';
    if (c >= 0x0400 && c <= 0x052F) return 'cyrillic';
    if (c >= 0x0530 && c <= 0x058F) return 'armenian';
    return 'other';
  }

  function hex(ch) {
    return 'U+' + ch.codePointAt(0).toString(16).toUpperCase().padStart(4, '0');
  }

  function isLatin(s) { return s === 'ascii' || s === 'latin'; }

  // Extrae el host de lo que pegue el usuario (URL completa, dominio o correo).
  function extractHost(input) {
    var s = String(input || '').trim();
    if (!s) return '';
    if (s.indexOf('@') > -1 && s.indexOf('/') === -1) s = s.split('@').pop();
    s = s.replace(/^[a-z][a-z0-9+.-]*:\/\//i, '');
    s = s.split(/[\/?#]/)[0];
    s = s.replace(/:\d+$/, '');
    return s.toLowerCase();
  }

  // Descodificador de punycode (RFC 3492) para etiquetas «xn--…».
  function punyDecode(input) {
    var base = 36, tMin = 1, tMax = 26, skew = 38, damp = 700, n = 128, i = 0, bias = 72;
    var out = [], b = input.lastIndexOf('-');
    if (b < 0) b = 0;
    for (var j = 0; j < b; j++) { if (input.charCodeAt(j) >= 0x80) return null; out.push(input.charCodeAt(j)); }
    function adapt(delta, num, first) {
      var k = 0; delta = first ? Math.floor(delta / damp) : delta >> 1; delta += Math.floor(delta / num);
      for (; delta > ((base - tMin) * tMax) >> 1; k += base) delta = Math.floor(delta / (base - tMin));
      return Math.floor(k + (base - tMin + 1) * delta / (delta + skew));
    }
    for (var idx = b > 0 ? b + 1 : 0; idx < input.length;) {
      var oldi = i, w = 1;
      for (var k = base; ; k += base) {
        if (idx >= input.length) return null;
        var c = input.charCodeAt(idx++);
        var digit = c - 48 < 10 ? c - 22 : c - 65 < 26 ? c - 65 : c - 97 < 26 ? c - 97 : base;
        if (digit >= base) return null;
        i += digit * w;
        var t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
        if (digit < t) break;
        w *= base - t;
      }
      bias = adapt(i - oldi, out.length + 1, oldi === 0);
      n += Math.floor(i / (out.length + 1));
      i %= out.length + 1;
      out.splice(i++, 0, n);
    }
    return String.fromCodePoint.apply(null, out);
  }

  function toUnicode(host) {
    return host.split('.').map(function (l) {
      if (l.slice(0, 4) !== 'xn--') return l;
      var d = punyDecode(l.slice(4));
      return d === null ? l : d;
    }).join('.');
  }

  function toAscii(host) {
    try { return new URL('http://' + host).hostname; } catch (e) { return null; }
  }

  /* Niveles de veredicto, de menos a más grave:
   *  ascii       solo a-z, 0-9 y guiones: no hay homógrafos Unicode
   *  idn-latin   letras latinas con tilde/ñ (dominio internacional normal)
   *  idn-other   otro alfabeto que no se hace pasar por latino (p. ej. .рф)
   *  mixed       mezcla latino con cirílico/griego/armenio en una etiqueta  → PELIGRO
   *  wholescript etiqueta entera en otro alfabeto que se lee como latina      → PELIGRO */
  var RANK = { ascii: 0, 'idn-latin': 1, 'idn-other': 2, mixed: 3, wholescript: 4 };

  function analyze(input) {
    var host = extractHost(input);
    var res = { input: input, host: host, ascii: null, verdict: 'ascii', danger: false,
      chars: [], skeleton: '', scripts: [], normalized: false, valid: true };
    if (!host) { res.valid = false; return res; }
    // Los caracteres de ancho completo (ｇ) los normaliza IDNA a ASCII: es mejor
    // analizar lo que de verdad resolverá el navegador, y avisar.
    var nfkc = host.normalize('NFKC');
    if (nfkc !== host) { res.normalized = true; host = nfkc; res.host = host; }
    var uni = toUnicode(host);
    if (uni !== host) { res.fromPunycode = true; host = uni; res.host = host; }
    res.ascii = toAscii(host);
    if (!res.ascii) res.valid = false;

    var allScripts = {};
    var labels = host.split('.');
    var worst = 'ascii';
    var skel = [];
    labels.forEach(function (label, li) {
      var scripts = {};
      var chars = Array.from(label);
      chars.forEach(function (ch) { var sc = scriptOf(ch); if (sc !== 'common') scripts[sc] = 1; allScripts[sc] = 1; });
      var names = Object.keys(scripts);
      var hasLatin = names.some(isLatin);
      var foreign = names.filter(function (n) { return n === 'greek' || n === 'cyrillic' || n === 'armenian'; });
      var lv = 'ascii';
      if (names.length && names.every(function (n) { return n === 'ascii'; })) lv = 'ascii';
      else if (hasLatin && foreign.length) lv = 'mixed';
      else if (!hasLatin && foreign.length) {
        var allConf = chars.every(function (ch) { return scriptOf(ch) === 'common' || CONFUSABLE[ch]; });
        lv = allConf ? 'wholescript' : 'idn-other';
      }
      else if (names.indexOf('other') > -1) lv = 'idn-other';
      else lv = 'idn-latin';
      // Una «ı» o «ɑ» entre latinas también se hace pasar por otra letra.
      if (lv === 'idn-latin' && chars.some(function (ch) { return scriptOf(ch) === 'latin' && CONFUSABLE[ch]; })) lv = 'mixed';
      if (RANK[lv] > RANK[worst]) worst = lv;
      var dangerLabel = lv === 'mixed' || lv === 'wholescript';
      chars.forEach(function (ch) {
        var sc = scriptOf(ch);
        res.chars.push({ ch: ch, code: hex(ch), script: sc, label: li,
          imitates: CONFUSABLE[ch] || null,
          suspicious: dangerLabel && sc !== 'ascii' && sc !== 'common' });
        skel.push(CONFUSABLE[ch] || ch);
      });
      if (li < labels.length - 1) { res.chars.push({ ch: '.', dot: true }); skel.push('.'); }
    });
    res.verdict = worst;
    res.danger = worst === 'mixed' || worst === 'wholescript';
    res.skeleton = skel.join('');
    res.scripts = Object.keys(allScripts).filter(function (s) { return s !== 'common'; });
    return res;
  }

  var api = { analyze: analyze, extractHost: extractHost, toAscii: toAscii, toUnicode: toUnicode, scriptOf: scriptOf, CONFUSABLE: CONFUSABLE };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Homoglyph = api;
})(typeof window !== 'undefined' ? window : this);
