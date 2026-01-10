import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST() {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const userId = (session.user as any).id;

    try {
        // Find the Google Account
        const googleAccount = await prisma.googleAccount.findFirst({
            where: { userId }
        });

        if (googleAccount) {
            // Revoke tokens if possible (Best practice)
            // But for simplicity in this MVP, we just delete the link

            // Delete Google Reviews, Locations, and Account for this user
            await prisma.googleAccount.deleteMany({
                where: { userId }
            });

            // Note: cascading deletes in schema handle Review and Location deletions
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('DISCONNECT_ERROR', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
