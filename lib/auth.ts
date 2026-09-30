import { prisma } from "@/lib/prisma";
import { passkey } from "@better-auth/passkey";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { betterAuth } from "better-auth/minimal";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  baseURL: process.env.BETTER_AUTH_URL || process.env.APP_URL || "http://localhost:3000",
  plugins: [
    passkey()
  ],
  advanced: {
    cookiePrefix: process.env.BETTER_AUTH_COOKIE_PREFIX || "portfolio_auth"
  },
  emailAndPassword: { enabled: true },
});
