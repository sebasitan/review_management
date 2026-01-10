import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { decrypt, encrypt } from '@/lib/encryption';

// This endpoint should be protected by a CRON secret in production
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');

    if (key !== process.env.CRON_SECRET) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const locations = await prisma.googleLocation.findMany({
            include: { account: true, business: true }
        });

        console.log(`[CRON] Starting sync for ${locations.length} locations`);

        for (const gLoc of locations) {
            try {
                await syncLocationReviews(gLoc);
            } catch (err) {
                console.error(`[CRON] Failed to sync ${gLoc.locationId}`, err);
            }
        }

        return NextResponse.json({ success: true, processed: locations.length });
    } catch (error) {
        console.error('[CRON_ERROR]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

async function syncLocationReviews(gLoc: any) {
    let token = decrypt(gLoc.account.accessToken);

    // Try fetch
    let res = await fetch(`https://mybusiness.googleapis.com/v4/accounts/${gLoc.googleAccountId}/locations/${gLoc.locationId}/reviews`, {
        headers: { Authorization: `Bearer ${token}` }
    });

    if (res.status === 401) {
        // Refresh token
        const refreshResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                client_id: process.env.GOOGLE_CLIENT_ID!,
                client_secret: process.env.GOOGLE_CLIENT_SECRET!,
                refresh_token: decrypt(gLoc.account.refreshToken),
                grant_type: 'refresh_token',
            }),
        });
        const refreshData = await refreshResponse.json();
        const newToken = refreshData.access_token;

        await prisma.googleAccount.update({
            where: { id: gLoc.accountId },
            data: { accessToken: encrypt(newToken) }
        });

        token = newToken;
        res = await fetch(`https://mybusiness.googleapis.com/v4/accounts/${gLoc.googleAccountId}/locations/${gLoc.locationId}/reviews`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }

    const data = await res.json();
    const reviews = data.reviews || [];

    for (const rev of reviews) {
        await prisma.googleReview.upsert({
            where: { reviewId: rev.reviewId },
            update: {
                rating: mapRating(rev.starRating),
                comment: rev.comment,
                reply: rev.reviewReply?.comment,
                createdAt: new Date(rev.createTime),
            },
            create: {
                reviewId: rev.reviewId,
                businessId: gLoc.businessId,
                reviewerName: rev.reviewer.displayName,
                rating: mapRating(rev.starRating),
                comment: rev.comment,
                reply: rev.reviewReply?.comment,
                createdAt: new Date(rev.createTime),
            }
        });
    }
}

function mapRating(star: string) {
    switch (star) {
        case 'FIVE': return 5;
        case 'FOUR': return 4;
        case 'THREE': return 3;
        case 'TWO': return 2;
        case 'ONE': return 1;
        default: return 0;
    }
}
