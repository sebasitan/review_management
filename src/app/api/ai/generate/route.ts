import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const { reviewContent, rating, authorName } = await req.json();

        if (!reviewContent) {
            return new NextResponse("Review content is required", { status: 400 });
        }

        // In a real production app, you would call OpenAI here:
        /*
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: "You are a professional reputation manager for a business. Write an empathetic, professional, and helpful response to a customer review." },
                { role: "user", content: `Review from ${authorName}: "${reviewContent}" (Rating: ${rating} stars)` }
            ]
        });
        const aiReply = response.choices[0].message.content;
        */

        // For now, we simulate a sophisticated AI response logic
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate AI processing

        let aiReply = "";
        if (rating >= 4) {
            const options = [
                `Dear ${authorName}, thank you so much for the glowing ${rating}-star review! We are thrilled to hear that you enjoyed your experience. Our team works hard to provide the best service possible, and your feedback is truly appreciated. We look forward to welcoming you back soon!`,
                `Hi ${authorName}, we're so glad you had a 5-star experience with us! Thank you for taking the time to share your feedback. We'll be sure to share your kind words with the entire team. See you again next time!`,
                `Thank you for the wonderful feedback, ${authorName}. It was a pleasure serving you, and we're happy we could meet your expectations. We appreciate your support and hope to see you again soon!`
            ];
            aiReply = options[Math.floor(Math.random() * options.length)];
        } else if (rating === 3) {
            aiReply = `Dear ${authorName}, thank you for sharing your feedback. We're glad you enjoyed some aspects of your visit, but we're sorry that we didn't fully meet your expectations this time. We'd love to learn more about how we can improve. Please feel free to reach out to us directly so we can make things right. Best regards.`;
        } else {
            aiReply = `Dear ${authorName}, we sincerely apologize for the experience you had. This is not the level of service we strive to provide. We values your feedback and would like to investigate this further to prevent it from happening again. Could you please contact us at support@reputaai.test so we can discuss this with you? We hope to have the chance to earn back your trust.`;
        }

        return NextResponse.json({ response: aiReply });
    } catch (error) {
        console.error("[AI_GENERATE_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
