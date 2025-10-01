import twilio from "twilio";

// Config via variables d'environnement (production Netlify)
const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || "";
const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || "";
const FROM_NUMBER = process.env.TWILIO_FROM || ""; // ex: whatsapp:+14155238886
const VENDOR_NUMBER = process.env.TWILIO_TO || ""; // ex: whatsapp:+2126...

const client = (() => {
  if (!ACCOUNT_SID || !AUTH_TOKEN) {
    return null as any;
  }
  return twilio(ACCOUNT_SID, AUTH_TOKEN);
})();

const PACKAGING_LABELS: Record<string, string> = {
  none: "Sans emballage",
  normal: "Emballage normal",
  special: "Emballage cadeau",
};

const DELIVERY_LABELS: Record<string, string> = {
  none: "Retrait atelier",
  relais: "Point relais Ozon Express",
  domicile: "Livraison à domicile",
  programme: "Livraison programmée",
};

const PAYMENT_LABELS: Record<string, string> = {
  livraison: "Paiement à la livraison",
  en_ligne: "Paiement en ligne",
  virement: "Virement / Cash Plus",
};

export async function sendVendorNotification(message: string) {
  if (!client) {
    throw new Error("Twilio non configuré (SID/TOKEN manquants)");
  }
  if (!FROM_NUMBER || !VENDOR_NUMBER) {
    throw new Error("Paramètres WhatsApp manquants: FROM/TO");
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
    orderId: string; // same as code
    code?: string;
    totals?: {
      productsSubtotal: number;
      packaging?: { option: string; fee: number };
      delivery?: { option: string; fee: number };
      payment?: { mode: string; fee: number };
      extrasTotal?: number;
      grandTotal?: number;
    };
    customer: { name: string; surname: string; phone: string; email: string; address: string };
    items: Array<{
      product: { name: string; price: number; baseProduct: string; category: string };
      quantity: number;
      total: number;
      variantDetails: { sizeVariantId: string; sizeName: string; sizeDescription?: string; patternId: string; patternName: string; patternColors: string[] };
    }>;
  }) {
    const code = order.code || order.orderId;
    const header = `Nouvelle commande ${code}`;
    const customer = `Client: ${order.customer.name} ${order.customer.surname}\nEmail: ${order.customer.email}\nTéléphone: ${order.customer.phone}\nAdresse: ${order.customer.address}`;

    const lines = order.items.map((item, idx) => {
      const vd = item.variantDetails;
      const colors = vd.patternColors.join(", ");
      return `${idx + 1}. ${item.product.name} x${item.quantity} — ${item.total.toFixed(2)} MAD\n   Taille: ${vd.sizeName}${vd.sizeDescription ? ` (${vd.sizeDescription})` : ""}\n   Motif: ${vd.patternName} [${colors}]`;
    });

    const totals = order.totals;
    const totalsSection = totals
      ? (() => {
          const packagingLabel = totals.packaging ? PACKAGING_LABELS[totals.packaging.option] ?? totals.packaging.option : "-";
          const deliveryLabel = totals.delivery ? DELIVERY_LABELS[totals.delivery.option] ?? totals.delivery.option : "-";
          const paymentLabel = totals.payment ? PAYMENT_LABELS[totals.payment.mode] ?? totals.payment.mode : null;
          const extrasLine = totals.extrasTotal && totals.extrasTotal > 0 ? `\nExtras: ${totals.extrasTotal.toFixed(2)} MAD` : "";
          return (
            `\n\nSous-total produits: ${totals.productsSubtotal.toFixed(2)} MAD` +
            `\nEmballage: ${(totals.packaging?.fee ?? 0).toFixed(2)} MAD (${packagingLabel})` +
            `\nLivraison: ${(totals.delivery?.fee ?? 0).toFixed(2)} MAD (${deliveryLabel})` +
            (paymentLabel ? `\nMode de paiement: ${(totals.payment?.fee ?? 0).toFixed(2)} MAD (${paymentLabel})` : "") +
            `${extrasLine}` +
            `\nTotal estimé: ${(totals.grandTotal ?? totals.productsSubtotal + (totals.extrasTotal ?? 0)).toFixed(2)} MAD`
          );
        })()
      : "";

    const body = `${header}\n\n${customer}\n\nArticles:\n${lines.join("\n")}${totalsSection}`;

    try {
      await sendVendorNotification(body);
      return { success: true, message: "Notification WhatsApp envoyée" } as const;
    } catch (error: any) {
      return { success: false, error: error?.message ?? String(error) } as const;
    }
  }
}
