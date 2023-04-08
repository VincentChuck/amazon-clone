import { PrismaClient, type ProductItem } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();
async function main() {
  const booksCatName = ['Self-Help', 'History'];
  const booksCategory = {
    categoryName: 'Books',
    childCategory: {
      create: [
        ...[...booksCatName].map((name) => {
          return {
            categoryName: name,
            variations: {
              create: {
                variationName: 'Formats',
                variationOptions: {
                  create: [
                    { value: 'Kindle' },
                    { value: 'Audiobook' },
                    { value: 'Hardcover' },
                    { value: 'Paperback' },
                  ],
                },
              },
            },
          };
        }),
      ],
    },
  };

  const books = await prisma.productCategory.upsert({
    where: { categoryName: 'Books' },
    update: {},
    create: booksCategory,
  });

  // function randomBook(): ProductItem {
  //   const name = `The ${faker.word.noun()} of ${faker.word.noun()}`;
  //   const description = faker.lorem.paragraphs(2);
  //   const category = Math.floor(Math.random() * booksCatName.length);
  //   return {
  //     name,
  //     description,
  //     category,
  //     productItems: {
  //       create: {},
  //     },
  //   };
  // }

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
