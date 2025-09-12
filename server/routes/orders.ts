import { RequestHandler } from "express";
import { z } from "zod";
import { WhatsAppService } from "../services/whatsapp";

// Validation schema for variant details
const VariantDetailsSchema = z.object({
  sizeVariantId: z.string(),
  sizeName: z.string(),
  sizeDescription: z.string().optional(),
  patternId: z.string(),
  patternName: z.string(),
  patternColors: z.array(z.string()),
});

// Validation schema for order item with variants
const OrderItemSchema = z.object({
  product: z.object({
    name: z.string(),
    price: z.number(),
    baseProduct: z.string(),
    category: z.string(),
  }),
  quantity: z.number().min(1),
  variantDetails: VariantDetailsSchema,
  total: z.number(),
});

const CustomerSchema = z.object({
  name: z.string().min(1, "Le prénom est requis"),
  surname: z.string().min(1, "Le nom est requis"),
  phone: z.string().min(10, "Le numéro de téléphone est requis"),
  email: z.string().email("Email invalide"),
  address: z.string().min(10, "L'adresse compl��te est requise"),
});

const TotalsSchema = z.object({
  productsSubtotal: z.number().min(0),
  packaging: z.object({ option: z.string(), fee: z.number().min(0) }),
  delivery: z.object({ option: z.string(), fee: z.number().min(0) }),
  payment: z.object({ mode: z.string(), fee: z.number().min(0) }).optional(),
  extrasTotal: z.number().min(0),
  grandTotal: z.number().min(0),
});

const OrderSchema = z.object({
  items: z.array(OrderItemSchema).min(1, "Au moins un article est requis"),
  totals: TotalsSchema,
  customer: CustomerSchema,
});

const whatsAppService = new WhatsAppService();

// Générateur de code commande mensuel: 0001-MMYY
const sequenceByPeriod: Record<string, number> = {};
const generateOrderCode = (): string => {
  const now = new Date();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yy = String(now.getFullYear()).slice(-2);
  const period = `${mm}${yy}`; // e.g. 0925
  const next = (sequenceByPeriod[period] ?? 0) + 1;
  sequenceByPeriod[period] = next;
  const seq = String(next).padStart(4, "0");
  return `${seq}-${period}`; // 0001-0925
};

export const submitOrder: RequestHandler = async (req, res) => {
  try {
    console.log("📦 Received order submission with variants:", req.body);

    // Validate the request data
    const validationResult = OrderSchema.safeParse(req.body);

    if (!validationResult.success) {
      console.error("❌ Validation errors:", validationResult.error.issues);
      return res.status(400).json({
        success: false,
        error: "Données de commande invalides",
        details: validationResult.error.issues,
      });
    }

    const orderData = validationResult.data as any;

    // Vérification basique des totaux
    const itemsTotal = orderData.items.reduce((sum: number, it: any) => sum + it.total, 0);
    const recomputedGrand = itemsTotal + (orderData.totals?.extrasTotal ?? 0);
    if (Math.abs(recomputedGrand - orderData.totals?.grandTotal) > 0.01) {
      console.warn("⚠️ Grand total discrepancy", { recomputedGrand, provided: orderData.totals?.grandTotal });
    }

    // Générer un code commande lisible (mensuel)
    const orderCode = generateOrderCode();

    // Préparer les données enrichies pour WhatsApp
    const enrichedOrderData = {
      ...orderData,
      orderId: orderCode,
      code: orderCode,
    } as any;

    // Debug env presence (without secrets)
    console.log("🔐 Twilio env present:", {
      FROM: Boolean(process.env.TWILIO_FROM),
      TO: Boolean(process.env.TWILIO_TO),
      SID: Boolean(process.env.TWILIO_ACCOUNT_SID),
      TOKEN: Boolean(process.env.TWILIO_AUTH_TOKEN),
    });

    // Send WhatsApp notification to vendor
    console.log("📱 Sending WhatsApp notification to vendor...");
    const whatsAppResult = await whatsAppService.sendOrderNotification(enrichedOrderData as any);

    // Notifications email désactivées

    if (whatsAppResult.success) {
      console.log("✅ Order processed successfully");

      console.log("📧 Email notifications handled manually");

      res.status(200).json({
        success: true,
        message: "Commande reçue avec succès ! Vous serez contacté bientôt.",
        orderId: orderCode,
        code: orderCode,
        whatsAppStatus: whatsAppResult.message,
      });
    } else {
      console.error("❌ WhatsApp notification failed:", whatsAppResult.error);
      res.status(500).json({
        success: false,
        error: "Commande reçue mais erreur lors de l'envoi de la notification",
        details: whatsAppResult.error,
      });
    }
  } catch (error) {
    console.error("❌ Server error:", error);
    res.status(500).json({
      success: false,
      error: "Erreur serveur lors du traitement de la commande",
    });
  }
};
