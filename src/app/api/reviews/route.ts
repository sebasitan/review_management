import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user?.email! },
            include: {
                businesses: {
                    include: {
                        reviews: {
                            orderBy: {
                                publishDate: 'desc'
                            }
                        }
                    }
                }
            }
        });

        if (!user || user.businesses.length === 0) {
            return NextResponse.json([]);
        }

        // For now, return reviews from the first business
        return NextResponse.json(user.businesses[0].reviews);
    } catch (error) {
        console.error("[REVIEWS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
