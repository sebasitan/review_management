import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const { searchParams } = new URL(req.url);
    const businessId = searchParams.get('businessId');
    const filter = searchParams.get('filter') || 'all'; // all, unreplied, low_rating, recent
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 20;
    const skip = (page - 1) * limit;

    if (!businessId) return new NextResponse("Business ID required", { status: 400 });

    // Build Where Clause
    let where: any = { businessId };

    if (filter === 'unreplied') {
        where.replied = false;
    } else if (filter === 'low_rating') {
        where.rating = { lte: 3 };
    } else if (filter === 'recent') {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        where.createdAt = { gte: thirtyDaysAgo };
    }

    try {
        const [reviews, total] = await Promise.all([
            prisma.googleReview.findMany({
                where,
                orderBy: [
                    { replied: 'asc' }, // false (Needs Reply) first
                    { createdAt: 'desc' }
                ],
                skip,
                take: limit,
            }),
            prisma.googleReview.count({ where })
        ]);

        return NextResponse.json({
            reviews,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('FETCH_REVIEWS_ERROR', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
