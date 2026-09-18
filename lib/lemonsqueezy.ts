import crypto from "crypto";

const apiKey = process.env.LEMONSQUEEZY_API_KEY || "";
const storeId = process.env.LEMONSQUEEZY_STORE_ID || "";
const variantId = process.env.LEMONSQUEEZY_VARIANT_ID || "";
const webhookSecret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET || "";

export interface LemonCheckoutOptions {
  customerEmail?: string;
  githubUsername?: string;
  customPrice?: number;
}

export async function createLemonCheckoutSession(options: LemonCheckoutOptions = {}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // If Lemon Squeezy API keys are configured, call Lemon Squeezy API
  if (apiKey && storeId && variantId) {
    try {
      const response = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: "application/vnd.api+json",
          "Content-Type": "application/vnd.api+json",
        },
        body: JSON.stringify({
          data: {
            type: "checkouts",
            attributes: {
              checkout_data: {
                email: options.customerEmail || undefined,
                custom: {
                  github_username: options.githubUsername || "",
                },
              },
              product_options: {
                redirect_url: `${appUrl}/claim?success=true`,
              },
            },
            relationships: {
              store: {
                data: {
                  type: "stores",
                  id: storeId,
                },
              },
              variant: {
                data: {
                  type: "variants",
                  id: variantId,
                },
              },
            },
          },
        }),
      });

      const resData = await response.json();
      if (resData.data?.attributes?.url) {
        return { url: resData.data.attributes.url };
      }
    } catch (err) {
      console.error("[Lemon Squeezy API Error]:", err);
    }
  }

  // Fallback direct checkout link or test mode redirect
  const queryParams = new URLSearchParams();
  if (options.customerEmail) queryParams.set("checkout[email]", options.customerEmail);
  if (options.githubUsername) queryParams.set("checkout[custom][github_username]", options.githubUsername);

  // In test/dev mode or direct variant URL
  const checkoutUrl = process.env.LEMONSQUEEZY_DIRECT_CHECKOUT_URL || `${appUrl}/claim?demo_checkout=true`;
  return {
    url: `${checkoutUrl}${checkoutUrl.includes("?") ? "&" : "?"}${queryParams.toString()}`,
  };
}

export function verifyLemonWebhookSignature(rawBody: string, signature: string): boolean {
  if (!webhookSecret) {
    console.warn("[Lemon Squeezy Webhook] LEMONSQUEEZY_WEBHOOK_SECRET is not set. Skipping signature verification in dev.");
    return true;
  }

  const hmac = crypto.createHmac("sha256", webhookSecret);
  const digest = Buffer.from(hmac.update(rawBody).digest("hex"), "utf8");
  const signatureBuffer = Buffer.from(signature, "utf8");

  return crypto.timingSafeEqual(digest, signatureBuffer);
}
