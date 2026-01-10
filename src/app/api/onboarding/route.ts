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
        const { businessName, address, city, country, lat, lng, placeId, source, googleMapUrl } = body;

        console.log("[ONBOARDING_DEBUG] Received payload:", { businessName, address, city, country, lat, lng, placeId, source });

        // STRICT VALIDATION: Enforce required fields
        if (!businessName || !address || lat == null || lng == null) {
            console.error("[ONBOARDING_ERROR] Missing required fields");
            return NextResponse.json(
                { error: "Required business details are missing (name, address, lat, lng)" },
                { status: 400 }
            );
        }

        // COMPLIANCE: Ensure data source is Geoapify (Google-safe)
        if (source !== 'geoapify') {
            console.error("[ONBOARDING_ERROR] Invalid data source:", source);
            return NextResponse.json(
                { error: "Business data must come from Geoapify autocomplete only" },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            console.error("[ONBOARDING_ERROR] User not found for email:", session.user.email);
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Check for duplicate business
        const existingBusiness = await prisma.business.findFirst({
            where: {
                ownerId: user.id,
                name: businessName,
                address: address,
            },
        });

        if (existingBusiness) {
            console.log("[ONBOARDING_WARNING] Business already exists:", existingBusiness.id);
            return NextResponse.json(
                { error: "This business already exists in your profile", business: existingBusiness },
                { status: 409 }
            );
        }

        // Create the business profile
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

        console.log("[ONBOARDING_SUCCESS] Business created:", business.id);

        return NextResponse.json({ success: true, business });
    } catch (error: any) {
        console.error("[ONBOARDING_POST_ERROR]", error.message || error);
        return NextResponse.json(
            { error: `Internal Error: ${error.message || 'Unknown issue'}` },
            { status: 500 }
        );
    }

}

