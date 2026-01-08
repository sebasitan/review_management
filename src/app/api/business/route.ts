
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
            include: {
                businesses: true
            }
        });

        if (!user || user.businesses.length === 0) {
            return NextResponse.json({ business: null });
        }

        // Assuming single business for now as per current architecture
        return NextResponse.json({ business: user.businesses[0] });

    } catch (error) {
        console.error("[BUSINESS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const body = await req.json();
        const { name, id } = body;

        if (!id || !name) {
            return new NextResponse("Missing fields", { status: 400 });
        }

        const business = await prisma.business.update({
            where: { id },
            data: { name },
        });

        return NextResponse.json(business);

    } catch (error) {
        console.error("[BUSINESS_PUT]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return new NextResponse("Missing ID", { status: 400 });
        }

        // Verify ownership
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { businesses: true }
        });

        const ownsBusiness = user?.businesses.some((b: { id: string }) => b.id === id);
        if (!ownsBusiness) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        // Delete dependencies first (Google-safe compliant relations)
        await prisma.reviewRequest.deleteMany({
            where: { businessId: id }
        });

        await prisma.analyticsEvent.deleteMany({
            where: { businessId: id }
        });

        await prisma.reviewDraft.deleteMany({
            where: { businessId: id }
        });

        await prisma.business.delete({
            where: { id }
        });


        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("[BUSINESS_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
