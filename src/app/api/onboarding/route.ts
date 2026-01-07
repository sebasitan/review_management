import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const { businessName, googlePlaceId, address, rating } = await req.json();

        if (!businessName || !googlePlaceId) {
            return new NextResponse("Business name and Place ID are required", { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        // 1. Create or Update the business
        const business = await prisma.business.create({
            data: {
                name: businessName,
                ownerId: user.id,
                googlePlaceId: googlePlaceId,
            },
        });

        // 2. Fetch Latest 5 Reviews (Simulation / Public Places API)
        // In a real app, you would call: https://maps.googleapis.com/maps/api/place/details/json?place_id=...

        const publicReviews = [
            {
                businessId: business.id,
                platform: "GOOGLE" as const,
                externalId: `pub_g_${Math.random().toString(36).substr(2, 9)}`,
                authorName: "Alex Rivera",
                authorImage: "https://i.pravatar.cc/150?u=alex",
                rating: 5,
                content: `Just visited ${businessName} and it was incredible. Best in the city!`,
                publishDate: new Date(),
                status: "PENDING" as const,
                sentiment: 0.9
            },
            {
                businessId: business.id,
                platform: "GOOGLE" as const,
                externalId: `pub_g_${Math.random().toString(36).substr(2, 9)}`,
                authorName: "Maria Garcia",
                authorImage: "https://i.pravatar.cc/150?u=maria",
                rating: 4,
                content: "Good experience overall. Will be back.",
                publishDate: new Date(Date.now() - 86400000),
                status: "PENDING" as const,
                sentiment: 0.6
            }
        ];

        await prisma.review.createMany({
            data: publicReviews,
        });

        return NextResponse.json({ success: true, business });
    } catch (error) {
        console.error("[ONBOARDING_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
