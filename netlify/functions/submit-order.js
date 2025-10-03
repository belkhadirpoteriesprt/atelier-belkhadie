const { sendVendorNotification } = require('./util/whatsapp');

// Build a consistent, well-structured WhatsApp message. Supports both
// simple payloads and full cart payloads (items + customer + totals).
function buildWhatsAppMessage(body) {
  try {
    // Full order shape (mirrors server/services/whatsapp.ts)
    if (body && Array.isArray(body.items) && body.customer) {
      const orderId = body.orderId ? String(body.orderId) : '';
      const header = `Nouvelle commande${orderId ? ` ${orderId}` : ''}`;

      const customer = [
        `Client: ${[body.customer.name, body.customer.surname].filter(Boolean).join(' ').trim()}`,
        `Email: ${body.customer.email || ''}`,
        `Téléphone: ${body.customer.phone || ''}`,
        `Adresse: ${body.customer.address || ''}`,
      ].join('\n');

      const lines = body.items.map((item, idx) => {
        const vd = item.variantDetails || {};
        const colors = Array.isArray(vd.patternColors) ? vd.patternColors.join(', ') : '';
        const sizeName = vd.sizeName || '';
        const sizeDesc = vd.sizeDescription ? ` (${vd.sizeDescription})` : '';
        const name = (item.product && item.product.name) || 'Article';
        const qty = Number(item.quantity || 1);
        const lineTotal = Number(item.total || 0);
        return `${idx + 1}. ${name} x${qty} — ${lineTotal.toFixed(2)} MAD\n   Taille: ${sizeName}${sizeDesc}\n   Motif: ${vd.patternName || ''} [${colors}]`;
      });

      const total = Number(
        typeof body.orderTotal === 'number'
          ? body.orderTotal
          : lines.reduce((s, _l, i) => (s + (Number(body.items[i]?.total || 0))), 0)
      );

      return `${header}\n\n${customer}\n\nArticles:\n${lines.join('\n')}\n\nTotal: ${total.toFixed(2)} MAD`;
    }
  } catch (_) {
    // Fall through to summary mode
  }

  // Fallback compact summary (legacy simple payload)
  const summary = [
    body?.productName ? `Produit: ${body.productName}` : null,
    body?.quantity ? `Quantité: ${body.quantity}` : null,
    body?.customerName ? `Client: ${body.customerName}` : null,
    body?.phone ? `Téléphone: ${body.phone}` : null,
    body?.email ? `Email: ${body.email}` : null,
  ].filter(Boolean).join(' | ') || 'Nouvelle commande reçue.';

  return `Nouvelle commande — ${summary}`;
}

exports.handler = async function(event) {
  try {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
    const body = JSON.parse(event.body || '{}');

    // Vérifications d'environnement Twilio
    const required = ['TWILIO_ACCOUNT_SID','TWILIO_AUTH_TOKEN','TWILIO_FROM','TWILIO_TO'];
    const missing = required.filter(k => !process.env[k]);
    if (missing.length) {
      return { statusCode: 400, body: JSON.stringify({ ok: false, error: `Twilio non configuré: ${missing.join(', ')}` }) };
    }

    const message = buildWhatsAppMessage(body);

    // Envoi WhatsApp (échec => 502)
    try {
      const twRes = await sendVendorNotification(message);
      if (!(twRes && twRes.sid)) {
        return { statusCode: 502, body: JSON.stringify({ ok: false, error: 'Echec envoi WhatsApp' }) };
      }
    } catch (e) {
      console.error('Twilio error in function:', e && e.message ? e.message : e);
      return { statusCode: 502, body: JSON.stringify({ ok: false, error: e?.message || 'Twilio error' }) };
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error('submit-order error:', err && err.message ? err.message : err);
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: 'Internal Error' }) };
  }
};
