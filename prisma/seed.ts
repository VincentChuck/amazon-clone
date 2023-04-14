import { PrismaClient, type Product } from '@prisma/client';

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

  // Create the variation
  const formatVariation = await prisma.variation.create({
    data: {
      variationName: 'Format',
      ProductCategories: {
        connect: [{ id: selfHelpCategory.id }, { id: historyCategory.id }],
      },
    },
  });

  // Create the variation options
  const formatOptions = await Promise.all(
    ['Kindle', 'Hardcover', 'Paperback'].map(async (option) => {
      const formatOption = await prisma.variationOption.create({
        data: {
          value: option,
          variations: {
            connect: { id: formatVariation.id },
          },
        },
      });
      return formatOption;
    })
  );

  // Create the product
  const subtleArtProduct = await prisma.product.create({
    data: {
      name: 'The Subtle Art of Not Giving a F*ck',
      description: 'A counterintuitive approach to living a good life',
      category: { connect: { id: selfHelpCategory.id } },
      productImage: '/product_images/subtle-art.jpg',
    },
  });

  const sapiensProduct = await prisma.product.create({
    data: {
      name: 'Sapiens',
      description: 'A Brief History of Humankind',
      category: { connect: { id: historyCategory.id } },
      productImage: '/product_images/sapiens.jpg',
    },
  });

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

  // Create the product items with the variation options
  function createProductItem(name: string, product: Product) {
    const basePrice = Math.floor(Math.random() * 5) + 1.99;
    return Promise.all(
      formatOptions.map(async (option) => {
        const productItem = await prisma.productItem.create({
          data: {
            product: { connect: { id: product.id } },
            SKU: `${name.toUpperCase()}-${option.value}`,
            quantityInStock: Math.floor(Math.random() * 1000),
            price: formatPrice(basePrice, option.value),
            variationOptions: {
              connect: { id: option.id },
            },
          },
        });
        return productItem;
      })
    );
  }

  const subtleArtItems = await createProductItem('Subtle', subtleArtProduct);
  const sapiensItems = await createProductItem('Sapiens', sapiensProduct);

  console.log('subtle', subtleArtProduct, subtleArtItems);
  console.log('sapiens', sapiensProduct, sapiensItems);
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
