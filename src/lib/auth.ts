import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";
import * as bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET || "http://localhost:3000",
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth",
    error: "/auth",
  },
  providers: [
    Google({
      clientId: env.AUTH_GOOGLE_ID || process.env.AUTH_GOOGLE_ID || "",
      clientSecret: env.AUTH_GOOGLE_SECRET || process.env.AUTH_GOOGLE_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
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

        // Find user in Prisma DB
        let user = await prisma.user.findUnique({
          where: { email },
        });

        if (user) {
          if (user.passwordHash && password) {
            const isValid = await bcrypt.compare(password, user.passwordHash);
            if (!isValid) return null;
          } else if (user.passwordPlain) {
            if (password !== user.passwordPlain) return null;
          } else if (password) {
            // User exists but has neither passwordHash nor passwordPlain (e.g. seeded user@applyaway.app)
            const passwordHash = await bcrypt.hash(password, 12);
            user = await prisma.user.update({
              where: { id: user.id },
              data: { passwordHash },
            });
          }
        } else {
          // User does not exist, auto-create user with hashed password
          const passwordHash = password ? await bcrypt.hash(password, 12) : null;
          user = await prisma.user.create({
            data: {
              email,
              name: credentials.name ? String(credentials.name) : "Apply Away User",
              passwordHash,
              timezone: "Africa/Lagos",
            },
          });
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          timezone: user.timezone,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        // Fetch timezone from database if available
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { timezone: true },
        });
        token.timezone = dbUser?.timezone || "Africa/Lagos";
      }

      if (trigger === "update" && session?.user?.timezone) {
        token.timezone = session.user.timezone;
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.timezone = (token.timezone as string) || "Africa/Lagos";
      }
      return session;
    },
  },
});
