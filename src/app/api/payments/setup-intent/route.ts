import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2022-11-15",
});

export async function POST(req: Request) {
  try {
    // For production, ensure this route is protected and attaches the SetupIntent
    // to the authenticated user's Stripe customer on the server.
    const body = await req.json().catch(() => ({}));
    const params: Stripe.SetupIntentCreateParams = {
      payment_method_types: ["card"],
    };

    // Optionally allow server-side code to specify a customer id in the body.
    if ((body as any).customerId) {
      params.customer = (body as any).customerId;
    }

    const setupIntent = await stripe.setupIntents.create(params);

    return NextResponse.json({ clientSecret: setupIntent.client_secret });
  } catch (err: any) {
    console.error("Failed to create SetupIntent", err);
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}
