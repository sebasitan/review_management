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
        const { businessName, googlePlaceId, rating, reviewCount, category } = await req.json();

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
        // Manual cascading deletion to avoid foreign key constraint errors
        const existingBusinesses = await prisma.business.findMany({
            where: { ownerId: user.id },
            select: { id: true }
        });

        const businessIds = existingBusinesses.map((b: { id: string }) => b.id);

        if (businessIds.length > 0) {
            await prisma.review.deleteMany({
                where: { businessId: { in: businessIds } }
            });
            await prisma.subscription.deleteMany({
                where: { businessId: { in: businessIds } }
            });
            await prisma.business.deleteMany({
                where: { id: { in: businessIds } }
            });
        }

        // 1. Create the business
        const business = await prisma.business.create({
            data: {
                name: businessName,
                ownerId: user.id,
                googlePlaceId: googlePlaceId,
            },
        });

        // 2. Generate or Fetch reviews
        let publicReviews = [];

        // Try to fetch real reviews if API Key is available
        if (process.env.GOOGLE_PLACES_API_KEY && googlePlaceId && !googlePlaceId.startsWith('manual_')) {
            try {
                console.log(`[ONBOARDING] Fetching reviews for Place ID: ${googlePlaceId}`);
                const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${googlePlaceId}&fields=name,rating,user_ratings_total,reviews&key=${process.env.GOOGLE_PLACES_API_KEY}`;
                const detailsRes = await fetch(detailsUrl);
                const detailsData = await detailsRes.json();

                console.log(`[ONBOARDING] Google API Status: ${detailsData.status}`);
                console.log(`[ONBOARDING] Reviews found: ${detailsData.result?.reviews?.length || 0}`);

                if (detailsData.status === 'OK' && detailsData.result && detailsData.result.reviews) {
                    publicReviews = detailsData.result.reviews.map((r: any) => ({
                        businessId: business.id,
                        platform: "GOOGLE" as const,
                        externalId: `google_${r.time}_${Math.random().toString(36).substr(2, 9)}`,
                        authorName: r.author_name,
                        authorImage: r.profile_photo_url || null,
                        rating: r.rating,
                        content: r.text || '',
                        publishDate: new Date(r.time * 1000),
                        status: "PENDING" as const,
                        sentiment: r.rating >= 4 ? 0.8 : (r.rating <= 2 ? 0.2 : 0.5)
                    }));
                    console.log(`[ONBOARDING] Successfully mapped ${publicReviews.length} reviews`);
                } else {
                    console.error(`[ONBOARDING] Google API Error: ${detailsData.status} - ${detailsData.error_message || 'No error message'}`);
                }
            } catch (error) {
                console.error("[ONBOARDING] Failed to fetch Google reviews:", error);
            }
        } else {
            console.log('[ONBOARDING] Skipping Google API - No API key or manual entry');
        }

        // Fallback to Mock Reviews if no real reviews found
        if (publicReviews.length === 0) {
            const count = Math.min(reviewCount || 5, 10);
            const names = ["Vignesh S.", "Meera Raman", "Rahul Krishnan", "Anitha P.", "Karthick Mani", "Deepa Rani", "Santhosh J.", "Shalini D.", "Pavithra R.", "Naveen Kumar"];

            // Generate category-specific reviews
            const getFeedbackByCategory = (cat: string) => {
                const lowerCat = (cat || '').toLowerCase();

                // Restaurant/Food categories
                if (lowerCat.includes('restaurant') || lowerCat.includes('food') || lowerCat.includes('cafe') ||
                    lowerCat.includes('dining') || lowerCat.includes('bbq') || lowerCat.includes('bar')) {
                    return [
                        "Amazing food! The flavors were incredible and portions were generous.",
                        "Best meal I've had in a long time. The service was excellent too!",
                        "Great atmosphere and delicious dishes. Highly recommend!",
                        "The food quality is outstanding. Will definitely come back.",
                        "Fantastic dining experience. The staff was very attentive.",
                        "Loved the ambiance and the menu variety. Great value!",
                        "Tasty food and quick service. Perfect spot!",
                        "Excellent cuisine and friendly staff. A must-visit!"
                    ];
                }

                // Service/Professional categories
                if (lowerCat.includes('service') || lowerCat.includes('professional') || lowerCat.includes('consulting') ||
                    lowerCat.includes('agency') || lowerCat.includes('solutions')) {
                    return [
                        "Professional team with excellent expertise. Very satisfied!",
                        "Outstanding service quality. They exceeded expectations.",
                        "Reliable and efficient. Highly recommend their services.",
                        "Great experience working with them. Very professional.",
                        "Exceptional service and attention to detail.",
                        "They delivered exactly what we needed. Top-notch!",
                        "Impressive work and timely delivery. Will use again.",
                        "Knowledgeable staff and great customer support."
                    ];
                }

                // Retail/Shopping categories
                if (lowerCat.includes('shop') || lowerCat.includes('store') || lowerCat.includes('retail') ||
                    lowerCat.includes('market') || lowerCat.includes('boutique')) {
                    return [
                        "Great selection and helpful staff. Found exactly what I needed!",
                        "Quality products at reasonable prices. Love this place!",
                        "Excellent customer service and good variety.",
                        "Clean store with friendly staff. Highly recommend!",
                        "Best shopping experience. Will definitely return.",
                        "Good quality items and fair pricing.",
                        "Helpful staff and great product range.",
                        "Always a pleasant shopping experience here."
                    ];
                }

                // Default generic reviews for other categories
                return [
                    "Great experience! The staff was very friendly and helpful.",
                    "Excellent service and quality. Highly recommended!",
                    "Good value for money. Will definitely come again.",
                    "Very satisfied with the overall experience.",
                    "Professional and efficient. Keep up the good work.",
                    "Simply amazing! Exceeded my expectations.",
                    "Positive experience overall. Good customer service.",
                    "Quick and reliable service. Thank you!"
                ];
            };

            const feedbacks = getFeedbackByCategory(category || '');

            for (let i = 0; i < count; i++) {
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
