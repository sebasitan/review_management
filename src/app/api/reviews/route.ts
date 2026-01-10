import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendAlert } from "@/lib/notifications";

/**
 * GOOGLE-SAFE COMPLIANCE: Reviews API
 * This endpoint DOES NOT fetch external reviews from Google or any platform.
 * It only returns an empty array to maintain compliance with Google's policies.
 * Reviews are managed directly on Google Maps.
 */
export async function GET(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    // COMPLIANCE: Return empty array - no external review fetching
    // Reviews are managed on Google Maps, not fetched or displayed here
    return NextResponse.json([]);
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const { businessId } = await req.json();
        if (!businessId) return new NextResponse("Business ID required", { status: 400 });

        const demoReviews = [
            { author: "John Doe", rating: 5, content: "Amazing service! The AI responses are so helpful.", platform: "GOOGLE" },
            { author: "Jane Smith", rating: 4, content: "Great experience, but a bit slow on weekends.", platform: "GOOGLE" },
            { author: "Mike Ross", rating: 2, content: "Not what I expected. The place was crowded.", platform: "INTERNAL" },
        ];

        // Fetch active automation rules for this business
        const activeRules = await prisma.automationRule.findMany({
            where: { businessId, isActive: true }
        });

        for (const rev of demoReviews) {
            let aiReply = null;

            // Check if any rule matches (Simulated logic)
            const autoReplyRule = activeRules.find(r =>
                r.action === 'Post AI Response' &&
                (r.condition === 'Rating equals 5 Stars' ? rev.rating === 5 : true)
            );

            if (autoReplyRule) {
                aiReply = `[Auto-Reply]: Thank you ${rev.author} for the ${rev.rating}-star review! We appreciate your business.`;
            }

            // Alert logic for negative reviews
            const alertRule = activeRules.find(r =>
                r.action === 'Send Email Alert' &&
                r.condition === 'Rating is below 3 Stars' &&
                rev.rating <= 2
            );

            if (alertRule && (session.user as any)?.email) {
                await sendAlert({
                    type: 'EMAIL',
                    recipient: (session.user as any).email,
                    content: `Negative review received from ${rev.author} (${rev.rating} stars): "${rev.content}"`
                });
            }

            await (prisma as any).review.create({
                data: {
                    businessId,
                    ...rev,
                    date: new Date(),
                    reply: aiReply
                }
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

