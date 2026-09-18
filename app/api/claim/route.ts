import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { inviteGithubCollaborator } from "@/lib/github";

export async function POST(req: NextRequest) {
  try {
    const { sessionId, githubUsername } = await req.json();

    if (!githubUsername || typeof githubUsername !== "string") {
      return NextResponse.json(
        { error: "Please provide a valid GitHub username." },
        { status: 400 }
      );
    }

    const cleanUsername = githubUsername.trim().replace(/^@/, "");

    // If a session ID is provided, verify it with Stripe
    if (sessionId) {
      try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status !== "paid") {
          return NextResponse.json(
            { error: "This checkout session has not been marked as paid." },
            { status: 400 }
          );
        }
      } catch (stripeErr: any) {
        // If Stripe keys aren't configured in dev mode, allow testing
        if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY.startsWith("sk_")) {
          return NextResponse.json(
            { error: "Invalid checkout session ID. Please check your purchase link." },
            { status: 400 }
          );
        }
      }
    }

    const inviteResult = await inviteGithubCollaborator(cleanUsername);

    if (!inviteResult.success) {
      return NextResponse.json(
        { error: inviteResult.message, status: inviteResult.status },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      status: inviteResult.status,
      message: inviteResult.message,
      repoUrl: inviteResult.repoUrl,
    });
  } catch (error: any) {
    console.error("[Claim API Error]:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process repository claim." },
      { status: 500 }
    );
  }
}
