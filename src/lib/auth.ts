import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async signIn({ user, account }) {
            if (!user.email) return false;

            try {
                // Manually handle User and Account linkage
                const existingUser = await prisma.user.findUnique({
                    where: { email: user.email }
                });

                if (!existingUser) {
                    await prisma.user.create({
                        data: {
                            email: user.email,
                            name: user.name,
                            image: user.image,
                        }
                    });
                }

                console.log("MANUAL_SIGNIN_SUCCESS", user.email);
                return true;
            } catch (error) {
                console.error("MANUAL_SIGNIN_ERROR:", error);
                return false;
            }
        },
        async session({ token, session }) {
            if (token) {
                session.user.id = token.id;
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.image = token.picture;
            }
            return session;
        },
        async jwt({ token, user }) {
            try {
                const dbUser = await prisma.user.findFirst({
                    where: {
                        email: token.email,
                    },
                });

                if (!dbUser) {
                    if (user) {
                        token.id = user.id;
                    }
                    return token;
                }

                return {
                    id: dbUser.id,
                    name: dbUser.name,
                    email: dbUser.email,
                    picture: dbUser.image,
                };
            } catch (error) {
                console.error("NEXTAUTH_JWT_ERROR:", error);
                return token;
            }
        },
    },
    debug: process.env.NODE_ENV === "development",
    pages: {
        signIn: "/login",
        error: "/login", // Redirect back to login on error
    },
};
