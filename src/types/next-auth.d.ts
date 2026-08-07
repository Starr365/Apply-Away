import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      timezone: string;
    } & DefaultSession["user"];
  }

  interface User {
    timezone?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    timezone?: string;
  }
}
