import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const businesses = await prisma.business.findMany({
            include: {
                owner: {
                    select: {
                        email: true,
                        name: true,
                    }
                },
                reviewRequests: true,
                analytics: true,
            },
            orderBy: { createdAt: 'desc' }
        });

        const tenants = businesses.map(b => ({
            id: b.id,
            name: b.name,
            owner: b.owner.email,
            ownerName: b.owner.name,
            plan: 'Pro', // Placeholder until subscription model is fully linked
            reviews: b.reviewRequests.length,
            status: 'Active',
            renewalDate: '2026-02-15',
            paymentMethod: 'Stripe',
            lastPaymentAmount: '$79.00',
            billingStatus: 'Paid',
            createdAt: b.createdAt
        }));

        return NextResponse.json(tenants);
    } catch (error) {
        console.error("[ADMIN_TENANTS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
