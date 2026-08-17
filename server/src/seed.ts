import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@civicres.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  const password = await bcrypt.hash(adminPassword, 10);
  const admin = await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, password, name: "Admin" },
  });
  console.log("Seeded admin:", admin.email);

  await prisma.authority.createMany({
    data: [
      { name: "Lagos Police Command", type: "Police", contact: "080-LASG-POLICE" },
      { name: "DSS Lagos", type: "DSS", contact: "09010001200" },
      { name: "Lagos State Emergency", type: "Emergency", contact: "112" },
    ],
    skipDuplicates: true,
  });
  console.log("Seeded authorities");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
