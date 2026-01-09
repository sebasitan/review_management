import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) return new NextResponse("Unauthorized", { status: 401 });

    const { searchParams } = new URL(req.url);
    const businessId = searchParams.get('businessId');

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: {
                businesses: {
                    include: {
                        reviews: true,
                        reviewRequests: true,
                        analytics: true
                    }
                }
            }
        }) as any;

        if (!user || user.businesses.length === 0) {
            return NextResponse.json({ error: "No business found" }, { status: 404 });
        }

        const business = businessId
            ? user.businesses.find((b: any) => b.id === businessId) || user.businesses[0]
            : user.businesses[0];

        const reviews = business.reviews;
        const totalReviews = reviews.length;

        // Sentiment Breakdown
        const positive = reviews.filter((r: any) => r.rating >= 4).length;
        const negative = reviews.filter((r: any) => r.rating <= 2).length;
        const neutral = totalReviews - positive - negative;

        const sentimentBreakdown = {
            positive: totalReviews ? Math.round((positive / totalReviews) * 100) : 0,
            neutral: totalReviews ? Math.round((neutral / totalReviews) * 100) : 0,
            negative: totalReviews ? Math.round((negative / totalReviews) * 100) : 0,
        };

        // Monthly Trend (Simulated buckets for 6 months)
        const trend = [30, 45, 60, 55, 75, 85]; // Default trend

        // Real Reach Estimate
        const reach = (business.reviewRequests.length * 15) + (business.analytics.length * 5);

        return NextResponse.json({
            stats: {
                growth: "+24%", // Placeholder for now
                responseTime: "1.2 hrs",
                reach: reach.toLocaleString(),
            },
            sentiment: sentimentBreakdown,
            trend: trend,
            keywords: [
                { text: "Friendly Staff", type: "positive" },
                { text: "Fast Order", type: "positive" },
                { text: "Atmosphere", type: "neutral" },
                { text: "Waiting Time", type: "negative" }
            ]
        });

    } catch (error) {
        console.error(error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
