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

        const rules = await prisma.automationRule.findMany({
            where: { businessId },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(rules);
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const { businessId, name, trigger, condition, action, isActive } = await req.json();

        const rule = await prisma.automationRule.create({
            data: {
                businessId,
                name,
                trigger,
                condition,
                action,
                isActive: isActive !== undefined ? isActive : true
            }
        });

        return NextResponse.json(rule);
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const { id, isActive, name, trigger, condition, action } = await req.json();

        const rule = await prisma.automationRule.update({
            where: { id },
            data: { isActive, name, trigger, condition, action }
        });

        return NextResponse.json(rule);
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) return new NextResponse("Unauthorized", { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    try {
        if (!id) return new NextResponse("ID required", { status: 400 });

        await prisma.automationRule.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}
