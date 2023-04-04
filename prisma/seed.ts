import { PrismaClient, type ProductCategory } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const books = await prisma.productCategory.create({
    data: {
      categoryName: 'Books',
      childCategory: {
        create: [
          {
            categoryName: 'Self-Help',
          },
          {
            categoryName: 'History',
          },
        ],
      },
    },
  });
  console.log({ books });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
