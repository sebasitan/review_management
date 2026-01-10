import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { decrypt, encrypt } from '@/lib/encryption';

async function refreshAccessToken(refreshToken: string) {
    const res = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            client_id: process.env.GOOGLE_CLIENT_ID!,
            client_secret: process.env.GOOGLE_CLIENT_SECRET!,
            refresh_token: refreshToken,
            grant_type: 'refresh_token',
        }),
    });
    const data = await res.json();
    return data.access_token;
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const { businessId } = await req.json();

    const gLoc = await prisma.googleLocation.findUnique({
        where: { businessId },
        include: { account: true }
    });

    if (!gLoc) return new NextResponse("Location not connected", { status: 400 });

    let token = decrypt(gLoc.account.accessToken);

    try {
        let res = await fetch(`https://mybusiness.googleapis.com/v4/accounts/${gLoc.googleAccountId}/locations/${gLoc.locationId}/reviews`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (res.status === 401) {
            // Token expired, refresh
            const newToken = await refreshAccessToken(decrypt(gLoc.account.refreshToken));
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
                    replied: !!rev.reviewReply?.comment,
                    createdAt: new Date(rev.createTime),
                },
                create: {
                    reviewId: rev.reviewId,
                    businessId,
                    reviewerName: rev.reviewer.displayName,
                    rating: mapRating(rev.starRating),
                    comment: rev.comment,
                    reply: rev.reviewReply?.comment,
                    replied: !!rev.reviewReply?.comment,
                    createdAt: new Date(rev.createTime),
                }
            });
        }

        return NextResponse.json({ success: true, count: reviews.length });
    } catch (error) {
        console.error('SYNC_REVIEWS_ERROR', error);
        return new NextResponse("Internal Error", { status: 500 });
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
