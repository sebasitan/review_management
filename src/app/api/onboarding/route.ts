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
        const { businessName, address, city, country, lat, lng, placeId } = await req.json();

        if (!businessName || !address || lat === undefined || lng === undefined) {
            return new NextResponse("Required business details are missing", { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        // 0. Cleanup old businesses (Fresh Start - following existing pattern)
        const existingBusinesses = await prisma.business.findMany({
            where: { ownerId: user.id },
            select: { id: true }
        });

        if (existingBusinesses.length > 0) {
            const businessIds = existingBusinesses.map((b: { id: string }) => b.id);

            // Delete related internal data only
            await prisma.reviewRequest.deleteMany({ where: { businessId: { in: businessIds } } });
            await prisma.analyticsEvent.deleteMany({ where: { businessId: { in: businessIds } } });
            await prisma.reviewDraft.deleteMany({ where: { businessId: { in: businessIds } } });

            await prisma.business.deleteMany({
                where: { id: { in: businessIds } }
            });
        }

        // 1. Create the business profile
        const business = await prisma.business.create({
            data: {
                name: businessName,
                ownerId: user.id,
                address,
                city,
                country,
                lat,
                lng,
                placeId,
            },
        });

        return NextResponse.json({ success: true, business });
    } catch (error) {
        console.error("[ONBOARDING_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

