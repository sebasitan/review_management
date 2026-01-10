
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const email = 'seba@stallioni.com';
    try {
        const deletedUser = await prisma.user.delete({
            where: { email },
        });
        console.log(`Successfully deleted user: ${deletedUser.email}`);
    } catch (error) {
        if (error.code === 'P2025') {
            console.log(`User with email ${email} not found.`);
        } else {
            console.error('Error deleting user:', error);
        }
    } finally {
        await prisma.$disconnect();
    }
}

main();
