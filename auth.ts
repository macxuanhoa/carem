import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import { authConfig } from "./auth.config"
import bcrypt from "bcryptjs"

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
        if (!credentials?.username || !credentials?.password) return null;

        try {
            const user = await prisma.user.findUnique({
                where: { username: credentials.username as string }
            });

            if (!user) return null;

            // Check if password is hashed (starts with $2a$ or $2b$)
            const isHashed = user.password.startsWith('$2a$') || user.password.startsWith('$2b$');

            let isValid = false;
            
            if (isHashed) {
                // Compare with hash
                isValid = await bcrypt.compare(credentials.password as string, user.password);
            } else {
                // Fallback for old plain text passwords (and auto-migrate)
                if (user.password === credentials.password) {
                    isValid = true;
                    // Auto-hash password for next time
                    const hashedPassword = await bcrypt.hash(credentials.password as string, 10);
                    await prisma.user.update({
                        where: { id: user.id },
                        data: { password: hashedPassword }
                    });
                }
            }

            if (isValid) {
                return { 
                    id: user.id, 
                    name: user.name, 
                    role: user.role
                }
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
