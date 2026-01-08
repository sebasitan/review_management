import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    // Google-Safe Compliance: External review syncing is explicitly disabled.
    // Future upgrades might support Google Business Profile OAuth, but for now, 
    // we only support internal engagement and manual reply drafting.
    return NextResponse.json({
        success: false,
        message: "External review synchronization is not supported in this version to ensure strict compliance with Google-safe rules."
    }, { status: 403 });
}

