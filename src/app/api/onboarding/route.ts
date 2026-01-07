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
        const { businessName, googlePlaceId } = await req.json();

        if (!businessName) {
            return new NextResponse("Business name is required", { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        // Create the business
        const business = await prisma.business.create({
            data: {
                name: businessName,
                ownerId: user.id,
                googlePlaceId: googlePlaceId || `mock_${Math.random().toString(36).substr(2, 9)}`,
            },
        });

        // Only create mock reviews if NO googlePlaceId was provided (Standard integration)
        if (!googlePlaceId) {
            const mockReviews = [
                {
                    businessId: business.id,
                    platform: "GOOGLE" as const,
                    externalId: `ext_g_${Math.random().toString(36).substr(2, 9)}`,
                    authorName: "Sarah Miller",
                    authorImage: "https://i.pravatar.cc/150?u=sarah",
                    rating: 5,
                    content: "We had a wonderful experience here. The service was impeccable and the atmosphere was very welcoming. Highly recommend!",
                    publishDate: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
                    status: "PENDING" as const,
                },
                {
                    businessId: business.id,
                    platform: "YELP" as const,
                    externalId: `ext_y_${Math.random().toString(36).substr(2, 9)}`,
                    authorName: "John Thompson",
                    authorImage: "https://i.pravatar.cc/150?u=john",
                    rating: 4,
                    content: "Really good food, although it took a bit long to get a table. Once seated, everything was great.",
                    publishDate: new Date(Date.now() - 1000 * 60 * 60 * 24), // yesterday
                    status: "PENDING" as const,
                }
            ];

            await prisma.review.createMany({
                data: mockReviews,
            });
        }

        return NextResponse.json({ business });
    } catch (error) {
        console.error("[ONBOARDING_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
