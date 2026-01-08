import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    // Google-Safe: We no longer fetch or store external reviews. 
    // This endpoint returns an empty list to ensure compliance.
    return NextResponse.json([]);
}

