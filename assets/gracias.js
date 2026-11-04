
const q = new URLSearchParams(location.search), lang = ['es','en','pt'].includes(q.get('idioma')) ? q.get('idioma') : 'es';
const T = {en:['Thank you!','Your payment is done. Your credits will show up in Vodwise (Settings → Account) within a minute. You can close this page now.','Link (Stripe) emails you the receipt and the invoice.','Thank you · Vodwise'],
           pt:['Obrigado!','O pagamento foi feito. Seus créditos vão aparecer no Vodwise (Configurações → Conta) em um minuto. Você já pode fechar esta página.','A Link (Stripe) envia o recibo e a nota por e-mail.','Obrigado · Vodwise']}[lang];
if (T) { document.documentElement.lang = lang === 'pt' ? 'pt-BR' : lang; [document.getElementById('title').textContent, document.getElementById('what').textContent, document.getElementById('mail').textContent, document.title] = T; }
