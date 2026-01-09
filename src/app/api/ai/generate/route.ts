import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const { reviewContent, tone = "Professional", authorName = "Customer", businessId } = await req.json();

        if (!reviewContent) {
            return new NextResponse("Review content is required", { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { businesses: true }
        });

        if (!user || user.businesses.length === 0) {
            return new NextResponse("Business not found", { status: 404 });
        }

        const business = businessId
            ? user.businesses.find(b => b.id === businessId) || user.businesses[0]
            : user.businesses[0];

        // Simulate AI processing delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        let aiReply = "";
        const greetings: Record<string, string> = {
            Professional: "Dear",
            Friendly: "Hi",
            Empathetic: "Hello"
        };
        const greeting = greetings[tone] || "Dear";

        const signoffs: Record<string, string> = {
            Professional: "Best regards, The Management",
            Friendly: "Cheers! The Team",
            Empathetic: "Warmly, Customer Success Team"
        };
        const signoff = signoffs[tone] || "Regards";

        // Logic for mock responses (GPT-4 logic should be integrated here in prod)
        if (reviewContent.length > 50) {
            aiReply = `${greeting} ${authorName},\n\nThank you for sharing such detailed feedback. We truly appreciate you taking the time to describe your experience. Your insights are invaluable to our growth, and we're committed to using them to improve our services.\n\n${signoff}`;
        } else {
            aiReply = `${greeting} ${authorName},\n\nThank you for your feedback! We're glad we could serve you and hope to see you again soon.\n\n${signoff}`;
        }


        // Save to database
        const draft = await prisma.reviewDraft.create({
            data: {
                businessId: business.id,
                reviewText: reviewContent,
                tone: tone,
                aiResponse: aiReply
            }
        });

        return NextResponse.json({ response: aiReply, draftId: draft.id });
    } catch (error) {
        console.error("[AI_GENERATE_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

