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
        const { locationName, businessId } = await req.json();

        if (!locationName || !businessId) {
            return new NextResponse("Missing locationName or businessId", { status: 400 });
        }

        // 1. Get the account with the access token
        const account = await prisma.account.findFirst({
            where: {
                user: { email: session.user.email },
                provider: "google"
            }
        });

        if (!account?.access_token) {
            return new NextResponse("No Google account connected", { status: 400 });
        }

        // 2. Fetch reviews from Google My Business API
        // https://mybusinessreviews.googleapis.com/v1/{locationName}/reviews
        const reviewsRes = await fetch(`https://mybusinessreviews.googleapis.com/v1/${locationName}/reviews`, {
            headers: {
                Authorization: `Bearer ${account.access_token}`
            }
        });

        const reviewsData = await reviewsRes.json();

        if (reviewsData.error) {
            console.error("Google Reviews API Error:", reviewsData.error);
            return NextResponse.json({ error: reviewsData.error.message }, { status: reviewsData.error.code });
        }

        const googleReviews = reviewsData.reviews || [];

        // 3. Save reviews to database
        const savedReviews = [];
        for (const gReview of googleReviews) {
            const starMap: Record<string, number> = { 'ONE': 1, 'TWO': 2, 'THREE': 3, 'FOUR': 4, 'FIVE': 5 };
            const rating = starMap[gReview.starRating] || 5;

            const saved = await prisma.review.upsert({
                where: { externalId: gReview.reviewId },
                update: {
                    content: gReview.comment || "",
                    rating: rating,
                    status: gReview.reviewReply ? 'REPLIED' : 'PENDING',
                },
                create: {
                    businessId: businessId,
                    platform: 'GOOGLE',
                    externalId: gReview.reviewId,
                    authorName: gReview.reviewer.displayName,
                    authorImage: gReview.reviewer.profilePhotoUrl,
                    rating: rating,
                    content: gReview.comment || "",
                    publishDate: new Date(gReview.createTime),
                    status: gReview.reviewReply ? 'REPLIED' : 'PENDING',
                    sentiment: rating >= 4 ? 0.8 : rating <= 2 ? -0.8 : 0, // Quick sentiment estimation
                }
            });
            savedReviews.push(saved);
        }

        return NextResponse.json({
            success: true,
            count: savedReviews.length,
            message: `Successfully synced ${savedReviews.length} reviews from Google.`
        });

    } catch (error) {
        console.error("[GOOGLE_SYNC_REVIEWS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
