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
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        const businesses = await prisma.business.findMany({
            where: { ownerId: user.id },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(businesses);
    } catch (error) {
        console.error("[BUSINESSES_GET_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
