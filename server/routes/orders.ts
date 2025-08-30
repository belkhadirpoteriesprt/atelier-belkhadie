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

const OrderSchema = z.object({
  items: z.array(OrderItemSchema).min(1, "Au moins un article est requis"),
  orderTotal: z.number().min(0),
  customer: CustomerSchema,
});

const whatsAppService = new WhatsAppService();

// Générer un ID de commande unique
const generateOrderId = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `BPK-${timestamp}-${random}`.toUpperCase();
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

    const orderData = validationResult.data;

    // Verify total calculation
    const calculatedTotal = orderData.items.reduce(
      (sum, item) => sum + item.total,
      0,
    );

    if (Math.abs(calculatedTotal - orderData.orderTotal) > 0.01) {
      console.error("❌ Total mismatch:", {
        calculated: calculatedTotal,
        provided: orderData.orderTotal,
      });
      return res.status(400).json({
        success: false,
        error: "Erreur de calcul du total",
      });
    }

    // Générer un ID de commande unique
    const orderId = generateOrderId();

    // Préparer les données enrichies pour WhatsApp
    const enrichedOrderData = {
      ...orderData,
      orderId,
    };

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

    // Email service disabled - will be handled manually
    console.log("📧 Email service disabled - handled manually");
    const emailResult = { success: true, message: "Email service disabled" };

    if (whatsAppResult.success) {
      console.log("✅ Order processed successfully");

      console.log("📧 Email notifications handled manually");

      res.status(200).json({
        success: true,
        message: "Commande reçue avec succès ! Vous serez contacté bientôt.",
        orderId,
        whatsAppStatus: whatsAppResult.message,
        emailStatus: emailResult.message
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
