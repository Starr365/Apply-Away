import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import * as bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 15 * 60, // 15 minutes lifetime
  },
  pages: {
    signIn: "/auth",
    error: "/auth",
  },
  // Google OAuth is not implemented yet. The provider previously registered
  // here was constructed with empty credentials, which advertised a sign-in
  // route that could never succeed. The /auth page shows a "coming soon"
  // notice instead. Re-add a Google provider here when real credentials exist.
  providers: [
    Credentials({
      name: "Simplified Development Login",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "user@applyaway.app" },
        name: { label: "Name", type: "text", placeholder: "Apply Away User" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;

        const email = String(credentials.email).toLowerCase().trim();
        const password = credentials.password ? String(credentials.password) : null;

        const user = await prisma.user.findUnique({
          where: { email },
        });

        // Strict check: User MUST exist in DB (signed up first)
        if (!user) {
          return null;
        }

        if (user.passwordHash && password) {
          const isValid = await bcrypt.compare(password, user.passwordHash);
          if (!isValid) return null;
        } else if (user.passwordPlain) {
          if (password !== user.passwordPlain) return null;
        } else {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  events: {
    /**
     * Fires only for adapter-created users, i.e. the OAuth path. The credentials
     * signup route creates its user directly via prisma.user.create and sends
     * its own welcome email, so there is no double-send.
     */
    async createUser({ user }) {
      if (!user?.email) return;

      try {
        const { EmailService } = await import("@/services/email.service");
        await new EmailService().sendWelcomeEmail({
          toEmail: user.email,
          userName: user.name || "Apply Away User",
        });
      } catch (err) {
        const { logger } = await import("@/lib/logger");
        logger.warn("[Auth] Failed to send welcome email to OAuth user:", err);
      }
    },
    async signIn({ user }) {
      if (user?.id) {
        const { trackEvent } = await import("@/lib/analytics");
        await trackEvent({
          eventName: "login",
          userId: user.id,
        });
      }
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;

        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { timezone: true },
        });

        session.user.timezone = dbUser?.timezone || "Africa/Lagos";
      }

      return session;
    },
  },


  // callbacks: {
  //   async jwt({ token, user, trigger, session }) {
  //     if (user) {
  //       token.id = user.id;
  //       token.accessTokenExpires = Date.now() + 5 * 60 * 1000;
  //       const dbUser = await prisma.user.findUnique({
  //         where: { id: user.id },
  //         select: { timezone: true },
  //       });
  //       token.timezone = dbUser?.timezone || "Africa/Lagos";
  //     }

  //     if (trigger === "update" && session?.user?.timezone) {
  //       token.timezone = session.user.timezone;
  //     }

  //     // Transparent refresh: If token is expiring or expired, verify user status against DB
  //     if (token.id && Date.now() > (token.accessTokenExpires as number || 0)) {
  //       const activeUser = await prisma.user.findUnique({
  //         where: { id: token.id as string },
  //         select: { id: true, timezone: true },
  //       });
  //       if (activeUser) {
  //         token.accessTokenExpires = Date.now() + 5 * 60 * 1000;
  //         token.timezone = activeUser.timezone || "Africa/Lagos";
  //       }
  //     }

  //     return token;
  //   },
  //   async session({ session, token }) {
  //     if (token && session.user) {
  //       session.user.id = token.id as string;
  //       session.user.timezone = (token.timezone as string) || "Africa/Lagos";
  //     }
  //     return session;
  //   },
  // },
});
