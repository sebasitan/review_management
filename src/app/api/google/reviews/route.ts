import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const { searchParams } = new URL(req.url);
    const businessId = searchParams.get('businessId');

    if (!businessId) return new NextResponse("Business ID required", { status: 400 });

    const reviews = await prisma.googleReview.findMany({
        where: { businessId },
        orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(reviews);
}
