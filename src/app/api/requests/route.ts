import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Channel } from "@prisma/client";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const { recipient, method, content, businessId } = await req.json();

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { businesses: true }
        });

        if (!user || user.businesses.length === 0) {
            return new NextResponse("Business profile not found", { status: 404 });
        }

        const business = businessId
            ? user.businesses.find(b => b.id === businessId) || user.businesses[0]
            : user.businesses[0];

        // Map method string to Channel enum
        let channel: Channel = Channel.EMAIL;
        if (method === 'whatsapp') channel = Channel.WHATSAPP;
        else if (method === 'sms') channel = Channel.SMS;
        else if (method === 'qr') channel = Channel.QR_CODE;

        // Log the request
        await prisma.reviewRequest.create({
            data: {
                businessId: business.id,
                channel: channel,
                recipient: recipient // Optional
            }
        });

        console.log(`[REQUEST] Logged ${channel} request for ${business.name}`);

        return NextResponse.json({ success: true, message: `Request logged successfully via ${method}` });
    } catch (error) {
        console.error("[REQUEST_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

