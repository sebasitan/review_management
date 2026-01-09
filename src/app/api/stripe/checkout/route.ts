import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    return new NextResponse("Stripe is currently disabled", { status: 503 });
    /*
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const { planId } = await req.json();

        const plans: Record<string, { priceId: string, name: string }> = {
            starter: { priceId: process.env.STRIPE_PRICE_STARTER!, name: 'Starter Plan' },
            professional: { priceId: process.env.STRIPE_PRICE_PROFESSIONAL!, name: 'Professional Plan' },
        };

        const plan = plans[planId];
        if (!plan) {
            return new NextResponse("Invalid Plan", { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        const checkoutSession = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: plan.priceId,
                    quantity: 1,
                },
            ],
            success_url: `${process.env.NEXTAUTH_URL}/dashboard?checkout=success`,
            cancel_url: `${process.env.NEXTAUTH_URL}/dashboard/settings?checkout=cancelled`,
            metadata: {
                userId: user.id,
                planId: planId,
            },
            customer_email: user.email!,
        });

        return NextResponse.json({ url: checkoutSession.url });
    } catch (error: any) {
        console.error("[STRIPE_CHECKOUT_ERROR]", error);
        return new NextResponse(error.message || "Internal Error", { status: 500 });
    }
    */
}
