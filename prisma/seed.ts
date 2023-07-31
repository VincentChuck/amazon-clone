import { Prisma, PrismaClient } from '@prisma/client';
import type { Product } from '@prisma/client';
import { faker } from '@faker-js/faker';
import categoryMapJson from '../src/utils/data/categoryMap.json';
import { type CategoryMap } from '~/utils/data/categoryUtil';
const categoryMap: CategoryMap = categoryMapJson;
import booksMapJson from '../src/utils/data/booksMap.json';
import { type BooksMap } from '~/utils/data/booksUtil';
const booksMap: BooksMap = booksMapJson;

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

  const intermediateCatArr = [...Object.values(categoryMap)]
    .filter((cat) => {
      return cat.descendentIds && cat.descendentIds.length > 0;
    })
    .map((cat) => {
      return {
        id: cat.id,
        categoryName: cat.categoryName,
        ...(cat.parentCategoryId
          ? { parentCategoryId: cat.parentCategoryId }
          : {}),
      };
    });

  const bottomCatArr = [...Object.values(categoryMap)]
    .filter((cat) => {
      return !Object.keys(cat).includes('descendentIds');
    })
    .map((cat) => {
      return {
        id: cat.id,
        categoryName: cat.categoryName,
        ...(cat.parentCategoryId
          ? { parentCategoryId: cat.parentCategoryId }
          : {}),
      };
    });

  await prisma.productCategory.createMany({
    data: [...intermediateCatArr, ...bottomCatArr],
  });

  const bottomCatIdArr = bottomCatArr.map(({ id }) => id);

  // Create the variation and options
  const bookFormatOptions = await prisma.variation.create({
    data: {
      variationName: 'Format',
      variationOptions: {
        create: [
          { value: 'Kindle' },
          { value: 'Hardcover' },
          { value: 'Paperback' },
          { value: 'Audible Audiobook' },
          { value: 'Spiral-bound' },
        ],
      },
      ProductCategories: {
        connect: bottomCatIdArr.map((id) => {
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
  for (const key in booksMap) {
    const book = booksMap[key];
    if (!book) continue;

    const product: Omit<Product, 'id'> = {
      name: book.name,
      description: faker.lorem.paragraphs(5),
      categoryId: book.categoryId,
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
          SKU: `${book.name.toUpperCase()}-${bookFormat.value}`,
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
        return basePrice + 20;
      case 'Audible Audiobook':
        return basePrice + 5;
      case 'Spiral-bound':
        return basePrice + 30;
      default:
        return basePrice;
    }
  }

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
