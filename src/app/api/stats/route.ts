import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user?.email! },
            include: {
                businesses: {
                    include: {
                        reviews: true
                    }
                }
            }
        });

        if (!user || user.businesses.length === 0) {
            return NextResponse.json({
                avgRating: 0,
                totalReviews: 0,
                responseRate: 0,
                sentimentScore: 0
            });
        }

        const business = user.businesses[0];
        const reviews = business.reviews;
        const totalReviews = reviews.length;

        // Check if there is an official account linked
        const googleAccount = await prisma.account.findFirst({
            where: { userId: user.id, provider: 'google' }
        });

        // It's official if we have a refresh token (meaning we can sync/reply)
        const isOfficial = !!googleAccount?.refresh_token;

        if (totalReviews === 0) {
            return NextResponse.json({
                avgRating: 0,
                totalReviews: 0,
                responseRate: 0,
                sentimentScore: 0,
                isOfficial
            });
        }

        const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews;
        const repliedReviews = reviews.filter(r => r.status === 'REPLIED').length;
        const responseRate = (repliedReviews / totalReviews) * 100;

        const avgSentiment = reviews.reduce((acc, r) => acc + (r.sentiment || 0), 0) / totalReviews;
        const sentimentScore = ((avgSentiment + 1) / 2) * 100;

        return NextResponse.json({
            avgRating: avgRating.toFixed(1),
            totalReviews: totalReviews.toLocaleString(),
            responseRate: responseRate.toFixed(1) + "%",
            sentimentScore: Math.round(sentimentScore) + "/100",
            businessName: business.name,
            isOfficial
        });
    } catch (error) {
        console.error("[STATS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
