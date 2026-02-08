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
            let user = await prisma.user.findUnique({
                where: { username: credentials.username as string }
            });

            // --- AUTO-FIX: Create Admin if missing (for Vercel/New Deployments) ---
            if (!user && credentials.username === 'carem92' && credentials.password === '@') {
                console.log('User not found. Auto-creating default Admin account...');
                try {
                    user = await prisma.user.create({
                        data: {
                            username: 'carem92',
                            password: '@', // In real app, hash this!
                            name: 'Administrator',
                            role: 'ADMIN'
                        }
                    });
                    console.log('Default Admin created successfully.');
                } catch (createError) {
                    console.error('Failed to create admin:', createError);
                }
            }
            // ----------------------------------------------------------------------

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
