// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('admin', 10);
  const staffPassword = await bcrypt.hash('staff', 10);

  await prisma.staff.create({
    data: {
      username: 'admin',
      password: adminPassword,
      role: 'admin',
    },
  });

  await prisma.staff.create({
    data: {
      username: 'staff',
      password: staffPassword,
      role: 'staff',
    },
  });

  console.log('Default admin and staff accounts created');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
