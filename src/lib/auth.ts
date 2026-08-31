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
    maxAge: 30 * 60, // 30 minutes lifetime
  },
  pages: {
    signIn: "/auth",
    error: "/auth",
  },

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


});
