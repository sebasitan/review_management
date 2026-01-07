import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const { recipient, method, content } = await req.json();

        if (!recipient || !content) {
            return new NextResponse("Missing fields", { status: 400 });
        }

        console.log(`Sending ${method} to ${recipient}: ${content}`);

        // In a real app, you would integrate Twilio for SMS or Resend/SendGrid for Email
        /*
        if (method === 'email') {
            await sendEmail(recipient, content);
        } else {
            await sendSMS(recipient, content);
        }
        */

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        return NextResponse.json({ success: true, message: `Request sent successfully via ${method}` });
    } catch (error) {
        console.error("[REQUEST_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
