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
        console.log("FETCHING_GOOGLE_ACCOUNTS_FOR:", session.user.email);
        const accountsRes = await fetch("https://mybusinessaccountmanagement.googleapis.com/v1/accounts", {
            headers: {
                Authorization: `Bearer ${account.access_token}`
            }
        });

        const accountsData = await accountsRes.json();
        console.log("GOOGLE_ACCOUNTS_RESPONSE:", JSON.stringify(accountsData));

        if (accountsData.error) {
            console.error("Google API Error:", accountsData.error);
            return NextResponse.json({ error: accountsData.error.message }, { status: accountsData.error.code });
        }

        // 3. For each account, fetch locations
        const allLocations = [];
        const googleAccounts = accountsData.accounts || [];
        console.log(`FOUND_${googleAccounts.length}_GOOGLE_ACCOUNTS`);

        for (const gAccount of googleAccounts) {
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
