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

    const { reviewId, comment } = await req.json();

    const gReview = await prisma.googleReview.findUnique({
        where: { reviewId },
        include: { business: { include: { googleLocation: { include: { account: true } } } } }
    });

    if (!gReview || !gReview.business.googleLocation) {
        return new NextResponse("Review or Location record not found", { status: 404 });
    }

    const gLoc = gReview.business.googleLocation;
    let token = decrypt(gLoc.account.accessToken);

    try {
        let res = await fetch(`https://mybusiness.googleapis.com/v4/accounts/${gLoc.googleAccountId}/locations/${gLoc.locationId}/reviews/${reviewId}/reply`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ comment })
        });

        if (res.status === 401) {
            const newToken = await refreshAccessToken(decrypt(gLoc.account.refreshToken));
            await prisma.googleAccount.update({
                where: { id: gLoc.accountId },
                data: { accessToken: encrypt(newToken) }
            });
            token = newToken;
            res = await fetch(`https://mybusiness.googleapis.com/v4/accounts/${gLoc.googleAccountId}/locations/${gLoc.locationId}/reviews/${reviewId}/reply`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ comment })
            });
        }

        if (!res.ok) {
            const err = await res.json();
            console.error('GOOGLE_REPLY_ERROR', err);
            return NextResponse.json({ success: false, error: err }, { status: res.status });
        }

        // Update local DB
        await prisma.googleReview.update({
            where: { reviewId },
            data: {
                reply: comment,
                replied: true,
                repliedAt: new Date()
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('REPLY_ERROR', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
