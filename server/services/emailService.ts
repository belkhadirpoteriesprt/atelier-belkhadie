import nodemailer from "nodemailer";

// Prototype Gmail credentials embedded (per user request)
const EMAIL_USER = "belkhadirpoteriemessagerie@gmail.com";
const EMAIL_PASS = "aeqc rqtf jtkq ptzt";
const VENDOR_EMAIL = "belkhadirpoteriemessagerie@gmail.com";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: EMAIL_USER, pass: EMAIL_PASS }
});

export async function sendVendorEmail(subject: string, text: string) {
  const to = VENDOR_EMAIL || EMAIL_USER;
  if (!to) {
    console.error("Email recipient not set");
    return { skipped: true };
  }
  try {
    const info = await transporter.sendMail({ from: EMAIL_USER, to, subject, text });
    return info;
  } catch (err) {
    console.error("Email send error:", err && err.message ? err.message : err);
    throw err;
  }
}

export async function sendClientConfirmation(clientEmail: string, subject: string, text: string) {
  if (!clientEmail) {
    return { skipped: true };
  }
  try {
    const info = await transporter.sendMail({ from: EMAIL_USER, to: clientEmail, subject, text });
    return info;
  } catch (err) {
    console.error("Client email send error:", err && err.message ? err.message : err);
    throw err;
  }
}
