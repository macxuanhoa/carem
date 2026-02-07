import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname === '/'; // Protect home
      const isOnCars = nextUrl.pathname.startsWith('/cars'); // Protect cars
      const isOnLogin = nextUrl.pathname.startsWith('/login');

      // 1. Redirect to /login if not logged in and trying to access protected routes
      if ((isOnDashboard || isOnCars) && !isLoggedIn) {
        return false; // Redirect to login
      }

      // 2. Redirect to / if logged in and trying to access login
      if (isOnLogin && isLoggedIn) {
        return Response.redirect(new URL('/', nextUrl));
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
