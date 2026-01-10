import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) return new NextResponse("Unauthorized", { status: 401 });

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            googleAccounts: { orderBy: { connectedAt: 'desc' }, take: 1 },
            businesses: { include: { googleLocation: true }, take: 1 }
        }
    });

    if (!user) return new NextResponse("User not found", { status: 404 });

    const business = user.businesses[0];
    const googleAccount = user.googleAccounts[0];

    return NextResponse.json({
        plan: user.plan,
        isGoogleConnected: !!googleAccount,
        isLocationConnected: !!business?.googleLocation,
        businessId: business?.id,
        googleAccountId: googleAccount?.id
    });
}
