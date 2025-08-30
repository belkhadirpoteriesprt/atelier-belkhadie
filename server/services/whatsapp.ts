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
    return { skipped: true } as const;
  }
  try {
    const res = await client.messages.create({ body: message, from: FROM_NUMBER, to: VENDOR_NUMBER });
    return res;
  } catch (err: any) {
    console.error("Twilio send error:", err && err.message ? err.message : err);
    throw err;
  }
}

export class WhatsAppService {
  async sendOrderNotification(order: {
    orderId: string;
    orderTotal: number;
    customer: { name: string; surname: string; phone: string; email: string; address: string };
    items: Array<{
      product: { name: string; price: number; baseProduct: string; category: string };
      quantity: number;
      total: number;
      variantDetails: { sizeVariantId: string; sizeName: string; sizeDescription?: string; patternId: string; patternName: string; patternColors: string[] };
    }>;
  }) {
    const header = `Nouvelle commande ${order.orderId}`;
    const customer = `Client: ${order.customer.name} ${order.customer.surname}\nEmail: ${order.customer.email}\nTéléphone: ${order.customer.phone}\nAdresse: ${order.customer.address}`;

    const lines = order.items.map((item, idx) => {
      const vd = item.variantDetails;
      const colors = vd.patternColors.join(", ");
      return `${idx + 1}. ${item.product.name} x${item.quantity} — ${item.total.toFixed(2)} MAD\n   Taille: ${vd.sizeName}${vd.sizeDescription ? ` (${vd.sizeDescription})` : ""}\n   Motif: ${vd.patternName} [${colors}]`;
    });

    const body = `${header}\n\n${customer}\n\nArticles:\n${lines.join("\n")}\n\nTotal: ${order.orderTotal.toFixed(2)} MAD`;

    try {
      await sendVendorNotification(body);
      return { success: true, message: "Notification WhatsApp envoyée" } as const;
    } catch (error: any) {
      return { success: false, error: error?.message ?? String(error) } as const;
    }
  }
}
