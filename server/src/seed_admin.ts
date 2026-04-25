import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const username = 'admin';
  const password = 'adminpassword123';
  const email = 'admin@example.com';
  const role = 'ADMIN';

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { username },
    update: { role },
    create: {
      username,
      password: hashedPassword,
      email,
      role
    }
  });

  console.log('Admin account created/updated:');
  console.log(`Username: ${username}`);
  console.log(`Password: ${password}`);
  console.log(`Role: ${user.role}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
