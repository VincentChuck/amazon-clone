import { Prisma, PrismaClient } from '@prisma/client';
import type { Product } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { booksSubCategories } from '../src/utils/data';

const prisma = new PrismaClient();

async function seed() {
  const deleteProductItem = prisma.productItem.deleteMany();
  const deleteVariation = prisma.variation.deleteMany();
  const deleteVariationOption = prisma.variationOption.deleteMany();
  const deleteProduct = prisma.product.deleteMany();
  const deleteProductCategory = prisma.productCategory.deleteMany();

  await prisma.$transaction([
    deleteProductItem,
    deleteVariationOption,
    deleteVariation,
    deleteProduct,
    deleteProductCategory,
  ]);

  // Create the root category
  await prisma.productCategory.create({
    data: {
      categoryName: 'Any',
      id: 0,
    },
  });

  const booksCategory = await prisma.productCategory.create({
    data: {
      categoryName: 'Books',
      id: 1,
    },
  });

  // Create the child categories
  const booksCatMap = new Map<string, number>();
  for (const cat of booksSubCategories) {
    const catObject = await prisma.productCategory.create({
      data: {
        categoryName: cat,
        parentCategoryId: booksCategory.id,
      },
    });
    booksCatMap.set(cat, catObject.id);
  }

  const booksCatIdArr = Array.from(booksCatMap, ([_, value]) => value);

  // Create the variation and options
  const bookFormatOptions = await prisma.variation.create({
    data: {
      variationName: 'Format',
      variationOptions: {
        create: [
          { value: 'Kindle' },
          { value: 'Hardcover' },
          { value: 'Paperback' },
          { value: 'KindleSpecial' },
          { value: 'HardcoverSpecial' },
          { value: 'PaperbackSpecial' },
        ],
      },
      ProductCategories: {
        connect: booksCatIdArr.map((id) => {
          return { id };
        }),
      },
    },
    select: {
      variationOptions: {
        select: {
          id: true,
          value: true,
        },
      },
    },
  });
  const bookFormatOptionsArr = bookFormatOptions.variationOptions;

  // Create the products
  for (let i = 0; i < 100; i++) {
    const randomBooksCat = faker.helpers.arrayElement(booksCatIdArr);
    // const randomBookName = `The ${faker.word.adjective()} ${faker.word.noun()}`;
    const randomBookName = faker.lorem
      .words({ min: 3, max: 10 })
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    const product: Omit<Product, 'id'> = {
      name: randomBookName,
      description: faker.lorem.paragraphs(5),
      categoryId: randomBooksCat,
      productImage: faker.helpers.arrayElement([
        '/product_images/sapiens.jpg',
        '/product_images/subtle-art.jpg',
        '/product_images/atomic-habits.jpg',
      ]),
    };

    const basePrice = Math.floor(Math.random() * 5) + 1.99;

    const productId = await prisma.product.create({
      data: {
        ...product,
      },
    });

    for (let i = 0; i < bookFormatOptionsArr.length; i++) {
      const bookFormat = bookFormatOptionsArr[i];
      if (!bookFormat || !bookFormat.value || !bookFormat.id) continue;

      await prisma.productItem.create({
        data: {
          product: {
            connect: { id: productId.id },
          },
          SKU: `${randomBookName.toUpperCase()}-${bookFormat.value}`,
          quantityInStock: Math.floor(Math.random() * 1000),
          price: new Prisma.Decimal(formatPrice(basePrice, bookFormat.value)),
          variationOption: {
            connect: { id: bookFormat.id },
          },
        },
      });
    }
  }

  function formatPrice(basePrice: number, format: string): number {
    switch (format) {
      case 'Kindle':
        return basePrice + 0;
      case 'Paperback':
        return basePrice + 10;
      case 'Hardcover':
        return basePrice + 25;
      default:
        return basePrice;
    }
  }

  console.log(booksCategory);
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
