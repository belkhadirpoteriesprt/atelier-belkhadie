const { sendVendorNotification } = require('./util/whatsapp');
const nodemailer = require('nodemailer');

// Embedded creds used by services; services may also be invoked directly.
// This function expects a POST with JSON body containing productName, quantity, customerName, phone, email.

exports.handler = async function(event) {
  try {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
    const body = JSON.parse(event.body || '{}');
    const summary = [
      body?.productName ? `Produit: ${body.productName}` : null,
      body?.quantity ? `Quantité: ${body.quantity}` : null,
      body?.customerName ? `Client: ${body.customerName}` : null,
      body?.phone ? `Téléphone: ${body.phone}` : null,
      body?.email ? `Email: ${body.email}` : null,
    ].filter(Boolean).join(' | ') || 'Nouvelle commande reçue.';

    // Send WhatsApp via service
    try {
      const twRes = await require('../../server/services/whatsapp').sendVendorNotification(`Nouvelle commande — ${summary}`);
      // minimal success log
      if (twRes && twRes.sid) {
        // no-op
      }
    } catch (e) {
      console.error('Twilio error in function:', e && e.message ? e.message : e);
    }

    // Send client confirmation email (if provided)
    if (body?.email) {
      try {
        await require('../../server/services/emailService').sendClientConfirmation(body.email, 'Confirmation de commande - Atelier', `Merci pour votre commande. Détails: ${summary}`);
      } catch (e) {
        console.error('Client email error:', e && e.message ? e.message : e);
      }
    }

    // Send vendor copy via email
    try {
      await require('../../server/services/emailService').sendVendorEmail('Nouvelle commande (copie)', `Nouvelle commande reçue — ${summary}`);
    } catch (e) {
      console.error('Vendor email error:', e && e.message ? e.message : e);
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error('submit-order error:', err && err.message ? err.message : err);
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: 'Internal Error' }) };
  }
};
