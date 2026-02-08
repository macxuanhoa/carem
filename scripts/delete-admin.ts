
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const deletedUser = await prisma.user.deleteMany({
      where: {
        username: 'admin',
      },
    });
    console.log(`Deleted ${deletedUser.count} user(s) with username 'admin'.`);
  } catch (error) {
    console.error('Error deleting user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
