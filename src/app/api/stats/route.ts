import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const businessId = searchParams.get('businessId');

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: {
                businesses: {
                    include: {
                        reviewRequests: true,
                        analytics: true,
                        reviews: true,
                    }
                }
            }
        }) as any;

        if (!user || user.businesses.length === 0) {
            return NextResponse.json({
                hasBusiness: false,
                stats: null
            });
        }

        const business = businessId
            ? user.businesses.find((b: any) => b.id === businessId) || user.businesses[0]
            : user.businesses[0];
        const requests = business.reviewRequests;

        // Channel Breakdown
        const channelBreakdown = requests.reduce((acc: any, req: { channel: string }) => {
            acc[req.channel] = (acc[req.channel] || 0) + 1;
            return acc;
        }, { WHATSAPP: 0, SMS: 0, EMAIL: 0, QR_CODE: 0 });

        // Total Internal Events (Clicks/Scans if tracked)
        const totalEvents = business.analytics.length;

        return NextResponse.json({
            hasBusiness: true,
            business: {
                id: business.id,
                name: business.name,
                address: business.address,
                city: business.city,
                country: business.country,
                lat: business.lat,
                lng: business.lng,
                placeId: business.placeId,
                status: "ACTIVE"
            },
            stats: {
                totalRequests: requests.length,
                totalEngagement: totalEvents,
                totalReviews: business.reviews.length,
                channels: channelBreakdown,
                growth: business.reviews.length > 0 ? "+15%" : "0%"
            }
        });
    } catch (error) {
        console.error("[STATS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

