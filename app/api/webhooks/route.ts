import { NextRequest, NextResponse } from "next/server";
import { verifyLemonWebhookSignature } from "@/lib/lemonsqueezy";
import { inviteGithubCollaborator } from "@/lib/github";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const lemonSignature = req.headers.get("x-signature");

  // 1. Handle Lemon Squeezy Webhook
  if (lemonSignature || req.headers.get("user-agent")?.includes("LemonSqueezy")) {
    if (lemonSignature && !verifyLemonWebhookSignature(rawBody, lemonSignature)) {
      console.error("[Lemon Squeezy Webhook] Invalid HMAC signature.");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    try {
      const payload = JSON.parse(rawBody);
      const eventName = payload.meta?.event_name;
      const customData = payload.meta?.custom_data;
      const userEmail = payload.data?.attributes?.user_email;

      console.log(`[Lemon Squeezy Webhook] Received event: ${eventName} for ${userEmail}`);

      if (eventName === "order_created" || eventName === "subscription_created") {
        const githubUsername = customData?.github_username;

        if (githubUsername) {
          console.log(`[Lemon Squeezy Webhook] Automated GitHub invite triggering for @${githubUsername}`);
          const invite = await inviteGithubCollaborator(githubUsername);
          console.log(`[Lemon Squeezy Webhook] Invite result:`, invite.status, invite.message);
        } else {
          console.log(`[Lemon Squeezy Webhook] Order created without GitHub handle. User can claim via /claim`);
        }
      }

      return NextResponse.json({ received: true, provider: "lemonsqueezy" });
    } catch (err: any) {
      console.error("[Lemon Squeezy Webhook Error]:", err);
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
  }

  // 2. Fallback / Test Webhook Handler
  try {
    const payload = JSON.parse(rawBody);
    return NextResponse.json({ received: true, data: payload });
  } catch {
    return NextResponse.json({ received: true });
  }
}
