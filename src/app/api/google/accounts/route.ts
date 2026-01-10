import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { decrypt } from '@/lib/encryption';

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const googleAccount = await prisma.googleAccount.findFirst({
        where: { userId: (session.user as any).id },
        orderBy: { connectedAt: 'desc' }
    });

    if (!googleAccount) return NextResponse.json({ accounts: [] });

    const token = decrypt(googleAccount.accessToken);

    const res = await fetch('https://mybusinessaccountmanagement.googleapis.com/v1/accounts', {
        headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    return NextResponse.json(data);
}
