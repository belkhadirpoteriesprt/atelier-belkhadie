import twilio from "twilio";

// Prototype credentials embedded (per user request)
const ACCOUNT_SID = "AC46c15cc5db07935af2e72fa697f8c335";
const AUTH_TOKEN = "b6e105e3ed7e8e3b2023e9d9a4ba438c";
const FROM_NUMBER = "whatsapp:+14155238886";
const VENDOR_NUMBER = "whatsapp:+212661724956";

const client = twilio(ACCOUNT_SID, AUTH_TOKEN);

export async function sendVendorNotification(message: string) {
  if (!FROM_NUMBER || !VENDOR_NUMBER) {
    // minimal log
    console.error("Twilio not configured");
    return { skipped: true };
  }
  try {
    const res = await client.messages.create({ body: message, from: FROM_NUMBER, to: VENDOR_NUMBER });
    return res;
  } catch (err) {
    console.error("Twilio send error:", err && err.message ? err.message : err);
    throw err;
  }
}
