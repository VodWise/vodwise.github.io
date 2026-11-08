// 11-10 (idiomas): la app abre la página con &idioma=es|en|pt; sin él, el del navegador. Stripe, en el mismo idioma.
// 26-10 (revisión de seguridad): sin número de cuenta en la dirección. El permiso va en el fragmento; de él solo se lee aquí
// el producto para enseñarlo (quien decide qué se cobra y a qué cuenta es el servidor, que comprueba su firma).
const q = new URLSearchParams(location.search), permiso = new URLSearchParams(location.hash.slice(1)).get('permiso') ?? '';
const leido = (() => { try { const m = /^([A-Za-z0-9_-]{20,300})\.[0-9a-f]{64}$/.exec(permiso); return m ? JSON.parse(atob(m[1].replaceAll('-', '+').replaceAll('_', '/'))) : null; } catch { return null; } })();
const product = leido?.p ?? q.get('producto');
if (permiso) history.replaceState(null, '', location.pathname + location.search);   // fuera de la barra de direcciones y del historial
const LANG = ['es','en','pt'].includes(q.get('idioma')) ? q.get('idioma') : (navigator.language || 'es').slice(0, 2) === 'en' ? 'en' : (navigator.language || '').startsWith('pt') ? 'pt' : 'es';
document.documentElement.lang = LANG === 'pt' ? 'pt-BR' : LANG;
document.title = (LANG === 'en' ? 'Buy' : 'Comprar') + ' · Vodwise';
const TEXT = {
  es: {loading:'Cargando…', pay:'Pagar', note:'Pago seguro con Link (Stripe), que te envía el recibo y la factura con el IVA de tu país.',
    invalid:'Enlace no válido', invalidWhat:'Abre esta página desde Vodwise: Ajustes → Cuenta.', soon:'El pago todavía no está disponible. Vuelve a intentarlo más tarde.',
    failed:'No se ha podido preparar el pago. Vuelve a intentarlo en un momento.', expired:'Este enlace de pago ha caducado. Vuelve a pulsar «Comprar» en Vodwise.', cancelledTitle:'Pago cancelado', cancelled:'No se ha cobrado nada. Si quieres comprar, vuelve a pulsar «Comprar» en Vodwise.', planActive:'Ya tienes un plan activo. Para cambiarlo, escríbenos a soporte@vodwise.com.', tooMany:'Has intentado pagar muchas veces seguidas. Espera unos minutos y vuelve a pulsar «Comprar» en Vodwise.', badLink:'Este enlace de pago no es válido. Vuelve a pulsar «Comprar» en Vodwise.', noAccount:'No encontramos tu cuenta. Comprueba en Vodwise (Ajustes → Cuenta) que has iniciado sesión y vuelve a pulsar «Comprar».',
    topup:'Recarga', month:'/ mes',
    plans:{basico:['Plan Ligera','1.800 créditos al mes.'],creador:['Plan Estándar','3.600 créditos al mes.'],
      pro:['Plan Premium','7.200 créditos al mes. Acumula hasta 2 meses.'],elite:['Plan Estudio','20.000 créditos al mes y soporte prioritario. Acumula hasta 3 meses.']},
    topups:{topup10:'1.000 créditos que no caducan nunca.',topup25:'2.750 créditos (10 % extra) que no caducan nunca.',topup50:'5.750 créditos (15 % extra) que no caducan nunca.'},
    offerGone:'La oferta de bienvenida ya no está disponible en esta cuenta.', firstMonth:'el primer mes',
    offers:{ofertaBasico:['Plan Ligera · oferta de bienvenida','1.800 créditos al mes. El primer mes cuesta 9,99 €; después, 14,99 € al mes hasta que lo canceles.'],ofertaRecarga:['Recarga de bienvenida','850 créditos que no caducan nunca. Solo una vez.']}},
  en: {loading:'Loading…', pay:'Pay', note:'Secure payment with Link (Stripe), which emails you the receipt and the invoice with your country\'s VAT.',
    invalid:'Invalid link', invalidWhat:'Open this page from Vodwise: Settings → Account.', soon:'Payment isn\'t available yet. Try again later.',
    failed:'The payment couldn\'t be prepared. Try again in a moment.', expired:'This payment link has expired. Click «Buy» in Vodwise again.', cancelledTitle:'Payment cancelled', cancelled:'Nothing was charged. To buy, click «Buy» in Vodwise again.', planActive:'You already have an active plan. To change it, email us at soporte@vodwise.com.', tooMany:'You\'ve tried to pay many times in a row. Wait a few minutes and click «Buy» in Vodwise again.', badLink:'This payment link isn\'t valid. Click «Buy» in Vodwise again.', noAccount:'We couldn\'t find your account. Check in Vodwise (Settings → Account) that you\'re signed in and click «Buy» again.',
    topup:'Top-up', month:'/ month',
    plans:{basico:['Light plan','1,800 credits a month.'],creador:['Standard plan','3,600 credits a month.'],
      pro:['Premium plan','7,200 credits a month. Rolls over up to 2 months.'],elite:['Studio plan','20,000 credits a month and priority support. Rolls over up to 3 months.']},
    topups:{topup10:'1,000 credits that never expire.',topup25:'2,750 credits (10% extra) that never expire.',topup50:'5,750 credits (15% extra) that never expire.'},
    offerGone:'The welcome offer is no longer available on this account.', firstMonth:'the first month',
    offers:{ofertaBasico:['Light plan · welcome offer','1,800 credits a month. The first month costs €9.99; then €14.99 a month until you cancel.'],ofertaRecarga:['Welcome top-up','850 credits that never expire. One time only.']}},
  pt: {loading:'Carregando…', pay:'Pagar', note:'Pagamento seguro com a Link (Stripe), que envia o recibo e a nota com o imposto do seu país.',
    invalid:'Link inválido', invalidWhat:'Abra esta página pelo Vodwise: Configurações → Conta.', soon:'O pagamento ainda não está disponível. Tente mais tarde.',
    failed:'Não foi possível preparar o pagamento. Tente de novo daqui a pouco.', expired:'Este link de pagamento expirou. Clique de novo em «Comprar» no Vodwise.', cancelledTitle:'Pagamento cancelado', cancelled:'Nada foi cobrado. Para comprar, clique de novo em «Comprar» no Vodwise.', planActive:'Você já tem um plano ativo. Para mudar, escreva para soporte@vodwise.com.', tooMany:'Você tentou pagar muitas vezes seguidas. Espere alguns minutos e clique de novo em «Comprar» no Vodwise.', badLink:'Este link de pagamento não é válido. Clique de novo em «Comprar» no Vodwise.', noAccount:'Não encontramos a sua conta. Confira no Vodwise (Configurações → Conta) se você entrou e clique de novo em «Comprar».',
    topup:'Recarga', month:'/ mês',
    plans:{basico:['Plano Leve','1.800 créditos por mês.'],creador:['Plano Padrão','3.600 créditos por mês.'],
      pro:['Plano Premium','7.200 créditos por mês. Acumula até 2 meses.'],elite:['Plano Estúdio','20.000 créditos por mês e suporte prioritário. Acumula até 3 meses.']},
    topups:{topup10:'1.000 créditos que não expiram.',topup25:'2.750 créditos (10% a mais) que não expiram.',topup50:'5.750 créditos (15% a mais) que não expiram.'},
    offerGone:'A oferta de boas-vindas não está mais disponível nesta conta.', firstMonth:'o primeiro mês',
    offers:{ofertaBasico:['Plano Leve · oferta de boas-vindas','1.800 créditos por mês. O primeiro mês custa 9,99 €; depois, 14,99 € por mês até você cancelar.'],ofertaRecarga:['Recarga de boas-vindas','850 créditos que não expiram. Só uma vez.']}}
}[LANG];
const money = eur => new Intl.NumberFormat(LANG === 'en' ? 'en-IE' : LANG === 'pt' ? 'pt-BR' : 'es-ES', {style:'currency', currency:'EUR', minimumFractionDigits: eur % 1 ? 2 : 0}).format(eur);
// Solo los créditos de cada plan, como vodwise.com/precios (07-11); la cifra de directos queda en la app (src/costs/consumo.js).
const EUR = {basico:14.99, creador:29.99, pro:59.99, elite:159.99, topup10:10, topup25:25, topup50:50, ofertaBasico:9.99, ofertaRecarga:5};
const PRODUCTS = Object.fromEntries([
  ...Object.entries(TEXT.plans).map(([k,[name,what]]) => [k, {name, price:`${money(EUR[k])} ${TEXT.month}`, what}]),
  ...Object.entries(TEXT.topups).map(([k,what]) => [k, {name:TEXT.topup, price:money(EUR[k]), what}]),
  ...Object.entries(TEXT.offers).map(([k,[name,what]]) => [k, {name, price:k === 'ofertaBasico' ? `${money(EUR[k])} ${TEXT.firstMonth}` : money(EUR[k]), what}])]);
const CLOUD = 'https://cloud.vodwise.com';
const show = (title, text) => { document.getElementById('name').textContent = title; document.getElementById('what').textContent = text; };
document.getElementById('pay').textContent = TEXT.pay;
document.getElementById('note').textContent = TEXT.note;
// Solo productos conocidos y con un permiso de compra (lo que no encaja no se cobra). La recarga con cantidad elegida y la
// oferta de bienvenida de las apps de antes (?txn=, Paddle) todavía no van con Stripe: «aún no disponible». Vuelta de Stripe tras cancelar: ?cancelado=1.
if (q.get('cancelado') === '1' && !permiso) {
  show(TEXT.cancelledTitle, TEXT.cancelled);
} else if (product === 'topupCustom' || q.has('txn')) {
  show(TEXT.loading, TEXT.soon);
} else if (!leido || !Object.hasOwn(PRODUCTS, product)) {
  show(TEXT.invalid, TEXT.invalidWhat);
} else {
  const p = PRODUCTS[product], pay = document.getElementById('pay');
  show(p.name, p.what); document.getElementById('price').textContent = p.price;
  pay.disabled = false;
  pay.addEventListener('click', async () => {
    pay.disabled = true;
    try {
      // Texto plano: el navegador lo envía sin preguntar antes al servidor.
      const r = await fetch(CLOUD + '/v1/payments/stripe/checkout', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ permiso, idioma: LANG }) });
      const v = await r.json().catch(() => ({}));
      if (r.ok && typeof v.url === 'string' && /^https:\/\/checkout\.stripe\.com\//.test(v.url)) { location.href = v.url; return; }
      document.getElementById('what').textContent = v.error === 'CHECKOUT_PLAN_ACTIVE' ? TEXT.planActive : v.error === 'CHECKOUT_UNAVAILABLE' ? TEXT.soon : v.error === 'CHECKOUT_PERMISO_EXPIRED' || v.error === 'CHECKOUT_PERMISO_USED' ? TEXT.expired : v.error === 'CHECKOUT_PERMISO_INVALID' ? TEXT.badLink : v.error === 'CHECKOUT_TOO_MANY' ? TEXT.tooMany : v.error === 'CHECKOUT_ACCOUNT_UNKNOWN' ? TEXT.noAccount : v.error === 'OFFER_NOT_AVAILABLE' ? TEXT.offerGone : TEXT.failed;
    } catch { document.getElementById('what').textContent = TEXT.failed; }
    pay.disabled = false;
  });
}
