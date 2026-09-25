import { prisma } from "@/lib/prisma";
import { passkey } from "@better-auth/passkey";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { betterAuth } from "better-auth/minimal";

// const database = new Pool({
//   connectionString: process.env.DATABASE_URL!,
// });

export const auth = betterAuth({
  // database, // default better-auth adapter
  database: prismaAdapter(prisma, { provider: "postgresql" }), // prisma adapter
  baseURL: process.env.BETTER_AUTH_URL!,
  plugins: [
    passkey()
  ],
  advanced: {
    cookiePrefix: process.env.BETTER_AUTH_COOKIE_PREFIX!
  },
  emailAndPassword: { enabled: true },
  // socialProviders: {
  //   apple: {
  //     clientId: process.env.APPLE_CLIENT_ID!,
  //     clientSecret: process.env.APPLE_CLIENT_SECRET!,
  //   },
  //   github: {
  //     clientId: process.env.GITHUB_CLIENT_ID!,
  //     clientSecret: process.env.GITHUB_CLIENT_SECRET!,
  //   },
  //   google: {
  //     clientId: process.env.GOOGLE_CLIENT_ID!,
  //     clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  //   },
  // },
});
