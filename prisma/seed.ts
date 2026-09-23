import "dotenv/config";
import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD;
  const name = process.env.SEED_ADMIN_NAME?.trim() || "Admin";

  if (!email || !password) {
    throw new Error(
      "Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD before seeding the admin user.",
    );
  }

  if (password.length < 8) {
    throw new Error("SEED_ADMIN_PASSWORD must be at least 8 characters.");
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin user already exists (${existing.email}).`);
    return;
  }

  await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
    },
  });

  await prisma.user.update({
    where: { email },
    data: { emailVerified: true },
  });

  await prisma.session.deleteMany({
    where: { user: { email } },
  });

  console.log(`Created admin user ${email}.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
