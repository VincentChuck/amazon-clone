import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  await prisma.productItem.deleteMany();
  await prisma.variation.deleteMany();
  await prisma.variationOption.deleteMany();
  await prisma.productCategory.deleteMany();
  await prisma.product.deleteMany();

  // Create the root category
  const booksCategory = await prisma.productCategory.create({
    data: {
      categoryName: 'Books',
    },
  });

  // Create the child categories
  const selfHelpCategory = await prisma.productCategory.create({
    data: {
      categoryName: 'Self-help',
      parentCategoryId: booksCategory.id,
    },
  });

  const historyCategory = await prisma.productCategory.create({
    data: {
      categoryName: 'History',
      parentCategoryId: booksCategory.id,
    },
  });

  // Create the product
  const subtleArtProduct = await prisma.product.create({
    data: {
      name: 'The Subtle Art of Not Giving a F*ck',
      description: 'A counterintuitive approach to living a good life',
      category: { connect: { id: selfHelpCategory.id } },
    },
  });

  // Create the variation
  const formatVariation = await prisma.variation.create({
    data: {
      variationName: 'Format',
      ProductCategories: {
        connect: [{ id: selfHelpCategory.id }, { id: historyCategory.id }],
      },
      variationOptions: {
        create: [
          { value: 'Kindle' },
          { value: 'Audiobook' },
          { value: 'Hardcover' },
          { value: 'Paperback' },
        ],
      },
    },
    include: {
      variationOptions: true,
    },
  });

  // Create the product items with the variation options
  const productItems = await Promise.all(
    formatVariation.variationOptions.map(async (option) => {
      const productItem = await prisma.productItem.create({
        data: {
          product: { connect: { id: subtleArtProduct.id } },
          SKU: `SUBTLE-${option.value}`,
          quantityInStock: 100,
          price: 19.99,
          variationOptions: {
            connect: { id: option.id },
          },
        },
      });
      return productItem;
    })
  );

  console.log(productItems);
  console.log('Seed complete!');
}

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
