import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnLogin = nextUrl.pathname.startsWith('/login');
      const isPublicApi = nextUrl.pathname.startsWith('/api/auth'); // Allow auth endpoints
      const isCron = nextUrl.pathname.startsWith('/api/cron'); // Handled by cron secret

      // 1. Allow login page and public APIs
      if (isOnLogin || isPublicApi || isCron) {
        if (isOnLogin && isLoggedIn) {
          return Response.redirect(new URL('/', nextUrl));
        }
        return true;
      }

      // 2. Protect ALL other routes
      if (!isLoggedIn) {
        return false; // Redirect to login
      }

      return true;
    },
    jwt({ token, user }) {
        if (user) {
            token.role = (user as any).role
        }
        return token
    },
    session({ session, token }) {
        if (session.user) {
            (session.user as any).role = token.role
        }
        return session
    }
  },
  providers: [], // Configured in auth.ts
} satisfies NextAuthConfig;
