import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        // 1. Get the account with the access token
        const account = await prisma.account.findFirst({
            where: {
                user: { email: session.user.email },
                provider: "google"
            }
        });

        if (!account?.access_token) {
            return new NextResponse("No Google account connected", { status: 400 });
        }

        // 2. Call Google My Business API (Account List)
        // Note: The structure of Google Business Profile API is accounts/{accountId}/locations
        const accountsRes = await fetch("https://mybusinessaccountmanagement.googleapis.com/v1/accounts", {
            headers: {
                Authorization: `Bearer ${account.access_token}`
            }
        });

        const accountsData = await accountsRes.json();

        if (accountsData.error) {
            console.error("Google API Error:", accountsData.error);
            return NextResponse.json({ error: accountsData.error.message }, { status: accountsData.error.code });
        }

        // 3. For each account, fetch locations
        const allLocations = [];
        for (const gAccount of (accountsData.accounts || [])) {
            const locationsRes = await fetch(`https://mybusinessbusinessinformation.googleapis.com/v1/${gAccount.name}/locations?readMask=name,title,storeCode,regularHours`, {
                headers: {
                    Authorization: `Bearer ${account.access_token}`
                }
            });
            const locationsData = await locationsRes.json();
            if (locationsData.locations) {
                allLocations.push(...locationsData.locations.map((loc: any) => ({
                    id: loc.name, // This is the location resource name (e.g. locations/123)
                    name: loc.title,
                    address: loc.storeCode || "Standard Location"
                })));
            }
        }

        return NextResponse.json(allLocations);
    } catch (error) {
        console.error("[GOOGLE_LOCATIONS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
