import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import { authConfig } from "./auth.config"

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Account Access",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        console.log('Authorizing user:', credentials?.username);
        if (!credentials?.username || !credentials?.password) return null;

        try {
            const user = await prisma.user.findUnique({
                where: { username: credentials.username as string }
            });

            console.log('User found:', user ? 'Yes' : 'No');

            if (!user) return null;

            // In production, compare hashed password!
            if (user.password === credentials.password) {
                console.log('Password match!');
                return { 
                    id: user.id, 
                    name: user.name, 
                    role: user.role
                }
            } else {
                console.log('Password mismatch');
            }
        } catch (error) {
            console.error('Auth Error:', error);
            return null;
        }
        
        return null
      },
    }),
  ],
})
