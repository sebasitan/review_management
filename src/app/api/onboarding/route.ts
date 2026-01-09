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
        const body = await req.json();
        const { businessName, address, city, country, lat, lng, placeId } = body;

        console.log("[ONBOARDING_DEBUG] Received payload:", { businessName, address, city, country, lat, lng, placeId });

        if (!businessName || !address || lat == null || lng == null) {
            console.error("[ONBOARDING_ERROR] Missing required fields");
            return new NextResponse("Required business details are missing", { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            console.error("[ONBOARDING_ERROR] User not found for email:", session.user.email);
            return new NextResponse("User not found", { status: 404 });
        }

        // No longer cleaning up old businesses to allow multiple


        // 1. Create the business profile
        const business = await prisma.business.create({
            data: {
                name: businessName,
                ownerId: user.id,
                address,
                city: city || "Unknown",
                country: country || "Unknown",
                lat: parseFloat(lat.toString()),
                lng: parseFloat(lng.toString()),
                placeId: placeId?.toString() || null,
            },
        });

        return NextResponse.json({ success: true, business });
    } catch (error: any) {
        console.error("[ONBOARDING_POST_ERROR]", error.message || error);
        return new NextResponse(`Internal Error: ${error.message || 'Unknown issue'}`, { status: 500 });
    }

}

