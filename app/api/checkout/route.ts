import { NextRequest, NextResponse } from "next/server";
import { createLemonCheckoutSession } from "@/lib/lemonsqueezy";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, githubUsername } = body;

    const session = await createLemonCheckoutSession({
      customerEmail: email,
      githubUsername,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Failed to generate Lemon Squeezy checkout link." },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("[Lemon Checkout API Error]:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to initialize Lemon Squeezy checkout." },
      { status: 500 }
    );
  }
}
