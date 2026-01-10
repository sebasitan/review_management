import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { encrypt } from '@/lib/encryption';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const session = await getServerSession(authOptions);

    if (!session || !code) {
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard?error=auth_failed`);
    }

    try {
        const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                code,
                client_id: process.env.GOOGLE_CLIENT_ID!,
                client_secret: process.env.GOOGLE_CLIENT_SECRET!,
                redirect_uri: `${process.env.NEXTAUTH_URL}/api/google/auth/callback`,
                grant_type: 'authorization_code',
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('TOKEN_EXCHANGE_ERROR', data);
            return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard?error=token_exchange`);
        }

        // Get Google Account Info (optional but good for identification)
        const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { Authorization: `Bearer ${data.access_token}` },
        });
        const googleUser = await userRes.json();

        // Store tokens securely
        await prisma.googleAccount.create({
            data: {
                userId: (session.user as any).id,
                googleAccountId: googleUser.id,
                accessToken: encrypt(data.access_token),
                refreshToken: encrypt(data.refresh_token),
            },
        });

        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard/settings?connected=true`);
    } catch (error) {
        console.error('OAUTH_CALLBACK_ERROR', error);
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard?error=server_error`);
    }
}
