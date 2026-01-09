import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) return new NextResponse("Unauthorized", { status: 401 });

    const { searchParams } = new URL(req.url);
    const businessId = searchParams.get('businessId');

    try {
        if (!businessId) return new NextResponse("Business ID required", { status: 400 });

        const templates = await prisma.reviewTemplate.findMany({
            where: { businessId },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(templates);
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const { businessId, name, content, isDefault } = await req.json();

        const template = await prisma.reviewTemplate.create({
            data: { businessId, name, content, isDefault: !!isDefault }
        });

        return NextResponse.json(template);
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}
