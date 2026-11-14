// Calculadora de la página de precios (es, en y pt-BR): ayuda para saber qué plan encaja. No cobra ni reserva nada.
// Los créditos son los de los planes y las recargas de la web; la app muestra siempre el saldo real.
(() => {
  'use strict';

  // Plan: [nombre por idioma..., créditos al mes, precio al mes]
  const PLANES = [
    { creditos: 1800, precio: 14.99 },
    { creditos: 3600, precio: 29.99 },
    { creditos: 7200, precio: 59.99 },
    { creditos: 20000, precio: 159.99 },
  ];
  // Recargas que se pueden comprar: [euros, créditos]
  const RECARGAS = [[10, 1000], [25, 2750], [50, 5750]];
  // Gasto estimado por directo = A × horas + B créditos, según la calidad elegida (lo mismo que enseña la app).
  const CALIDAD = { b: [51.03, 46.84], s: [65.55, 185.9], m: [65.55, 363.01] };
  const MAX_HORAS = 24;
  const MAX_DIRECTOS = 62;

  const TEXTOS = {
    es: {
      loc: 'es-ES', moneda: '{v} €', planes: ['Ligera', 'Estándar', 'Premium', 'Estudio'],
      res: 'Unas {h} h de directo al mes ≈ <strong>{c} créditos</strong> → <strong>plan {p}</strong> ({e} al mes).',
      over: 'Unas {h} h de directo al mes ≈ <strong>{c} créditos</strong> → <strong>plan {p} y alguna recarga</strong> (≈ {e} al mes).',
      uso: 'Usarías unos {c} de los {y} créditos del plan.',
      warn: 'Vas justo para este plan: si te quedas sin créditos puedes recargar o pasar al siguiente.',
      rest: 'En Ligera y Estándar los créditos que sobran no pasan al mes siguiente.',
      cap: 'Las horas son por cada directo (24 como mucho). Si son {r} h al mes en {n} directos, pon {s} h por directo.',
    },
    en: {
      loc: 'en-GB', moneda: '€{v}', planes: ['Light', 'Standard', 'Premium', 'Studio'],
      res: 'About {h} h of streaming a month ≈ <strong>{c} credits</strong> → <strong>{p} plan</strong> ({e} a month).',
      over: 'About {h} h of streaming a month ≈ <strong>{c} credits</strong> → <strong>{p} plan plus a top-up</strong> (≈ {e} a month).',
      uso: 'You would use about {c} of the plan\'s {y} credits.',
      warn: 'You\'re cutting it close for this plan: if you run out of credits you can top up or move up to the next plan.',
      rest: 'On Light and Standard, unused credits do not carry over to the next month.',
      cap: 'Hours are per stream (24 at most). If that\'s {r} h a month in {n} streams, enter {s} h per stream.',
    },
    pt: {
      loc: 'pt-BR', moneda: '€ {v}', planes: ['Leve', 'Padrão', 'Premium', 'Estúdio'],
      res: 'Cerca de {h} h de live por mês ≈ <strong>{c} créditos</strong> → <strong>plano {p}</strong> ({e} por mês).',
      over: 'Cerca de {h} h de live por mês ≈ <strong>{c} créditos</strong> → <strong>plano {p} e alguma recarga</strong> (≈ {e} por mês).',
      uso: 'Você usaria cerca de {c} dos {y} créditos do plano.',
      warn: 'Você está no limite deste plano: se ficar sem créditos, pode recarregar ou passar para o próximo.',
      rest: 'No Leve e no Padrão, os créditos que sobram não passam para o mês seguinte.',
      cap: 'As horas são por live (no máximo 24). Se forem {r} h por mês em {n} lives, informe {s} h por live.',
    },
  };

  const idioma = (document.documentElement.lang || 'es').slice(0, 2).toLowerCase();
  const t = TEXTOS[idioma] || TEXTOS.es;

  const horas = document.getElementById('calc-h');
  const directos = document.getElementById('calc-n');
  const salida = document.getElementById('calc-out');
  if (!horas || !directos || !salida) return;

  const fmt = (n, dec) => {
    const op = { useGrouping: 'always', minimumFractionDigits: dec || 0, maximumFractionDigits: dec === undefined ? 1 : dec };
    try { return new Intl.NumberFormat(t.loc, op).format(n); } catch (e) { return String(n); }
  };
  const dinero = (n) => t.moneda.replace('{v}', fmt(n, 2));
  const rellenar = (s, v) => s.replace(/\{(\w+)\}/g, (_, k) => v[k]);

  // Recargas más baratas (combinando las de 10, 25 y 50 €) que cubren `falta` créditos.
  const euros_de_recarga = (falta) => {
    let mejor = null;
    const m50 = Math.ceil(falta / RECARGAS[2][1]) + 1;
    for (let a = 0; a <= m50; a++) {
      for (let b = 0; b <= 3; b++) {
        for (let c = 0; c <= 5; c++) {
          const cred = a * RECARGAS[2][1] + b * RECARGAS[1][1] + c * RECARGAS[0][1];
          if (cred < falta) continue;
          const eur = a * RECARGAS[2][0] + b * RECARGAS[1][0] + c * RECARGAS[0][0];
          if (!mejor || eur < mejor.eur || (eur === mejor.eur && cred < mejor.cred)) mejor = { eur, cred };
        }
      }
    }
    return mejor ? mejor.eur : 0;
  };

  const calidad = () => {
    const sel = document.querySelector('input[name="calc-q"]:checked');
    return CALIDAD[sel && sel.value] || CALIDAD.b;
  };

  const calcular = () => {
    const crudas = Math.max(0, parseFloat(horas.value) || 0);
    const h = Math.min(MAX_HORAS, crudas);
    const n = Math.min(MAX_DIRECTOS, Math.max(0, parseInt(directos.value, 10) || 0));
    if (crudas > MAX_HORAS) {
      const por = Math.round((crudas / (n || 1)) * 10) / 10;
      salida.innerHTML = '<span class="calc-warn">' + rellenar(t.cap, { r: fmt(crudas), n: fmt(n || 1), s: fmt(por) }) + '</span>';
      return;
    }
    if (!(h > 0 && n > 0)) { salida.innerHTML = ''; return; }

    const [a, b] = calidad();
    const porDirecto = Math.ceil(+(a * h + b).toFixed(6));
    const total = porDirecto * n;
    const totalHoras = Math.round(h * n * 10) / 10;
    const idx = PLANES.findIndex((p) => p.creditos >= total);

    let html;
    if (idx >= 0) {
      const p = PLANES[idx];
      html = rellenar(t.res, { h: fmt(totalHoras), c: fmt(total), p: t.planes[idx], e: dinero(p.precio) });
      html += '<br>' + rellenar(t.uso, { c: fmt(total), y: fmt(p.creditos), p: t.planes[idx] });
      if (total > 0.9 * p.creditos) html += '<br><span class="calc-warn">' + t.warn + '</span>';
    } else {
      const ult = PLANES.length - 1;
      const extra = euros_de_recarga(total - PLANES[ult].creditos);
      const e = Math.round((PLANES[ult].precio + extra) * 100) / 100;
      html = rellenar(t.over, { h: fmt(totalHoras), c: fmt(total), p: t.planes[ult], e: dinero(e) });
    }
    html += '<br><span class="calc-total">' + t.rest + '</span>';
    salida.innerHTML = html;
  };

  horas.addEventListener('input', calcular);
  directos.addEventListener('input', calcular);
  document.querySelectorAll('input[name="calc-q"]').forEach((el) => el.addEventListener('change', calcular));
  calcular();
})();
