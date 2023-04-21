import { Prisma, PrismaClient } from '@prisma/client';
import type { Product } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function seed() {
  const deleteProductItem = prisma.productItem.deleteMany();
  const deleteVariation = prisma.variation.deleteMany();
  const deleteVariationOption = prisma.variationOption.deleteMany();
  const deleteProduct = prisma.product.deleteMany();
  const deleteProductCategory = prisma.productCategory.deleteMany();

  await prisma.$transaction([
    deleteProductItem,
    deleteVariation,
    deleteVariationOption,
    deleteProduct,
    deleteProductCategory,
  ]);

  // Create the root category
  const booksCategory = await prisma.productCategory.create({
    data: {
      categoryName: 'Books',
    },
  });

  // Create the child categories
  const booksCatMap = new Map<string, number>();
  for (const cat of bookSubCategories) {
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
  await prisma.variation.create({
    data: {
      variationName: 'Format',
      variationOptions: {
        create: [
          { value: 'Kindle' },
          { value: 'Hardcover' },
          { value: 'Paperback' },
        ],
      },
      ProductCategories: {
        connect: booksCatIdArr.map((id) => {
          return { id };
        }),
      },
    },
  });

  // Create the products
  for (let i = 0; i < 1000; i++) {
    const randomBooksCat = faker.helpers.arrayElement(booksCatIdArr);
    const randomBookName = `The ${faker.word.adjective()} ${faker.word.noun()}`;

    const product: Omit<Product, 'id'> = {
      name: randomBookName,
      description: faker.commerce.productDescription(),
      categoryId: randomBooksCat,
      productImage: faker.helpers.arrayElement([
        '/product_images/sapiens.jpg',
        '/product_images/subtle-art.jpg',
        '/product_images/atomic-habits.jpg',
      ]),
    };

    const basePrice = Math.floor(Math.random() * 5) + 1.99;

    class ProductItem {
      SKU: string;
      quantityInStock: number;
      price: Prisma.Decimal;
      constructor(option: string) {
        this.SKU = `${randomBookName.toUpperCase()}-${option}`;
        this.quantityInStock = Math.floor(Math.random() * 1000);
        this.price = new Prisma.Decimal(formatPrice(basePrice, option));
      }
    }

    await prisma.product.create({
      data: {
        ...product,
        productItems: {
          create: [
            new ProductItem('Kindle'),
            new ProductItem('Hardcover'),
            new ProductItem('Paperback'),
          ],
        },
      },
    });
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

const bookSubCategories = [
  'Arts & Photography',
  'Biographies & Memoirs',
  'Business & Money',
  'Calendars',
  "Children's Books",
  'Christian Books & Bibles',
  'Comics & Graphic Novels',
  'Computers & Technology',
  'Cookbooks, Food & Wine',
  'Crafts, Hobbies & Home',
  'Education & Teaching',
  'Engineering & Transportation',
  'Health, Fitness & Dieting',
  'History',
  'Humor & Entertainment',
  'Law',
  'LGBTQ+ Books',
  'Literature & Fiction',
  'Medical Books',
  'Mystery, Thriller & Suspense',
  'Parenting & Relationships',
  'Politics & Social Sciences',
  'Reference',
  'Religion & Spirituality',
  'Romance',
  'Science & Math',
  'Science Fiction & Fantasy',
  'Self-Help',
  'Sports & Outdoors',
  'Teen & Young Adult',
  'Test Preparation',
  'Travel',
];
