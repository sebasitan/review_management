import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const { businessId, accountId, locationId, locationName, googleAccountId } = await req.json();

    try {
        await prisma.googleLocation.upsert({
            where: { businessId },
            update: {
                googleAccountId,
                locationId,
                locationName,
                accountId,
            },
            create: {
                businessId,
                googleAccountId,
                locationId,
                locationName,
                accountId,
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('CONNECT_LOCATION_ERROR', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
