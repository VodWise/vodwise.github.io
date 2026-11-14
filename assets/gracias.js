const q = new URLSearchParams(location.search), lang = ['es','en','pt'].includes(q.get('idioma')) ? q.get('idioma') : 'es';
// Tres casos: créditos pagados (lo que trae la página), pack 3D pagado y pack 3D cancelado (Stripe vuelve aquí con cancelado=1).
const caso = q.get('pack3d') === '1' ? (q.get('cancelado') === '1' ? 'cancelado' : 'pack') : 'creditos';
const T = {
  es:{pack:['¡Gracias!','El pago está hecho. Vodwise ya está preparando tu pack 3D; lo verás en Packs cuando esté listo. Ya puedes cerrar esta página.','Link (Stripe) te envía el recibo y la factura por correo.','Gracias · Vodwise'],
      cancelado:['Pago cancelado','No se ha cobrado nada. Puedes volver a Vodwise y pedir el pack cuando quieras.','','Pago cancelado · Vodwise']},
  en:{creditos:['Thank you!','Your payment is done. Your credits will show up in Vodwise (Settings → Account) within a minute. You can close this page now.','Link (Stripe) emails you the receipt and the invoice.','Thank you · Vodwise'],
      pack:['Thank you!','Your payment is done. Vodwise is already making your 3D pack; you will see it in Packs when it is ready. You can close this page now.','Link (Stripe) emails you the receipt and the invoice.','Thank you · Vodwise'],
      cancelado:['Payment cancelled','Nothing has been charged. You can go back to Vodwise and order the pack whenever you like.','','Payment cancelled · Vodwise']},
  pt:{creditos:['Obrigado!','O pagamento foi feito. Seus créditos vão aparecer no Vodwise (Configurações → Conta) em um minuto. Você já pode fechar esta página.','A Link (Stripe) envia o recibo e a nota por e-mail.','Obrigado · Vodwise'],
      pack:['Obrigado!','O pagamento foi feito. O Vodwise já está preparando seu pack 3D; você vai vê-lo em Packs quando estiver pronto. Você já pode fechar esta página.','A Link (Stripe) envia o recibo e a nota por e-mail.','Obrigado · Vodwise'],
      cancelado:['Pagamento cancelado','Nada foi cobrado. Você pode voltar ao Vodwise e pedir o pack quando quiser.','','Pagamento cancelado · Vodwise']}
}[lang][caso];
if (lang !== 'es') document.documentElement.lang = lang === 'pt' ? 'pt-BR' : lang;
if (T) {
  const [titulo, que, correo, pestana] = T, mail = document.getElementById('mail');
  document.getElementById('title').textContent = titulo; document.getElementById('what').textContent = que; document.title = pestana;
  if (correo) mail.textContent = correo; else mail.hidden = true;
}
// Un pago cancelado no lleva la marca de hecho.
if (caso === 'cancelado') document.querySelector('.tick').hidden = true;
