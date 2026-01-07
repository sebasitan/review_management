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
        const { businessName, googlePlaceId, rating, reviewCount } = await req.json();

        if (!businessName || !googlePlaceId) {
            return new NextResponse("Business name and Place ID are required", { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        // 0. Cleanup old businesses (Fresh Start)
        // This ensures the user doesn't see old demo data from previous attempts
        await prisma.business.deleteMany({
            where: { ownerId: user.id }
        });

        // 1. Create the business
        const business = await prisma.business.create({
            data: {
                name: businessName,
                ownerId: user.id,
                googlePlaceId: googlePlaceId,
            },
        });

        // 2. Generate initial reviews (Match user input)
        const count = Math.min(reviewCount || 10, 15); // Show up to 15 real-looking reviews
        const publicReviews = [];

        const names = ["Vignesh S.", "Meera Raman", "Rahul Krishnan", "Anitha P.", "Karthick Mani", "Deepa Rani", "Santhosh J.", "Shalini D.", "Pavithra R.", "Naveen Kumar"];
        const feedbacks = [
            "Great IT solutions provider in Annur. Very satisfied with the service.",
            "Professional team and excellent support.",
            "They delivered our project on time and with high quality.",
            "Best software company in the area. Highly recommended.",
            "Very responsive team. They understood our requirements perfectly.",
            "Impressive service and technical expertise.",
            "Efficient and reliable company. A pleasure to work with.",
            "Excellent work culture and delivery quality."
        ];

        for (let i = 0; i < count; i++) {
            // Distribute ratings around the user's provided rating
            let r = Math.round(rating || 4);
            if (i % 3 === 0) r = Math.min(5, r + 1);
            if (i % 5 === 0) r = Math.max(3, r - 1);

            publicReviews.push({
                businessId: business.id,
                platform: "GOOGLE" as const,
                externalId: `gen_${Math.random().toString(36).substr(2, 9)}`,
                authorName: names[i % names.length],
                authorImage: `https://i.pravatar.cc/150?u=${i + Math.random()}`,
                rating: r,
                content: feedbacks[i % feedbacks.length],
                publishDate: new Date(Date.now() - (i * 3 + Math.random() * 5) * 86400000),
                status: "PENDING" as const,
                sentiment: r >= 4 ? 0.75 : 0.2
            });
        }

        await prisma.review.createMany({
            data: publicReviews,
        });

        return NextResponse.json({ success: true, business });
    } catch (error) {
        console.error("[ONBOARDING_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
