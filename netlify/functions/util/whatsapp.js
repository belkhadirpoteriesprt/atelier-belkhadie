const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const FROM = process.env.TWILIO_FROM; // ex: whatsapp:+14155238886
const TO   = process.env.TWILIO_TO;   // ex: whatsapp:+2126...

async function sendVendorNotification(message) {
  if (!message) return;
  if (!client) throw new Error("Twilio non configuré (SID/TOKEN manquants)");
  if (!FROM || !TO) throw new Error("Paramètres WhatsApp manquants: FROM/TO");
  try {
    const result = await client.messages.create({
      body: message,
      from: FROM,
      to: TO,
    });
    console.log("Twilio msg sid:", result.sid);
    return result;
  } catch (err) {
    console.error("sendVendorNotification error:", err);
    throw err;
  }
}

module.exports = { sendVendorNotification };
