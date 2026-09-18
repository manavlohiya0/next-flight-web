import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "dummy_key_for_build";

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2024-12-18.acacia" as any,
  appInfo: {
    name: "NextFlight",
    version: "1.0.0",
  },
});

export interface CreateCheckoutOptions {
  customerEmail?: string;
  githubUsername?: string;
  successUrl?: string;
  cancelUrl?: string;
}

export async function createBoilerplateCheckoutSession(options: CreateCheckoutOptions = {}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const successUrl =
    options.successUrl ||
    `${appUrl}/claim?session_id={CHECKOUT_SESSION_ID}&success=true`;
  const cancelUrl = options.cancelUrl || `${appUrl}/#pricing`;

  const priceId = process.env.STRIPE_PRICE_ID;

  // Use existing price ID if provided, otherwise create an inline one-time product for $99.50
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = priceId
    ? [{ price: priceId, quantity: 1 }]
    : [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "NextFlight — Production Next.js 15.5 SaaS Starter",
              description:
                "Lifetime Access: Private GitHub Repository, Full Source Code, Multi-tenancy, Auth, Billing & AI Coding Agent Rules.",
              images: [
                `${appUrl}/og-image.png`,
              ],
            },
            unit_amount: 10000, // $100.00 USD
          },
          quantity: 1,
        },
      ];

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: lineItems,
    customer_email: options.customerEmail,
    // Add custom field to collect GitHub username directly in checkout
    custom_fields: [
      {
        key: "github_username",
        label: {
          type: "custom",
          custom: "GitHub Username (for instant repo invite)",
        },
        type: "text",
        optional: false, // Prompt them to enter it for 0-click delivery
      },
    ],
    metadata: {
      product: "nextflight_saas_boilerplate",
      intended_github_username: options.githubUsername || "",
    },
    allow_promotion_codes: true,
    billing_address_collection: "auto",
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  return session;
}
