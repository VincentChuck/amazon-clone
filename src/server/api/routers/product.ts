import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { z } from 'zod';
import { type PrismaClient } from '@prisma/client';
import type { CategoryTree } from '~/types';
import { SORTOPTIONS } from '~/utils/constants';

async function getChildCategories(categoryId: number, prisma: PrismaClient) {
  if (categoryId === 0) return [];
  const childCategories = await prisma.productCategory.findMany({
    where: {
      parentCategoryId: categoryId,
    },
    select: {
      id: true,
    },
  });
  const childCategoriesId = childCategories.map(({ id }) => id);
  return [categoryId, ...childCategoriesId];
}

export const productRouter = createTRPCRouter({
  getBatch: publicProcedure
    .input(
      z.object({
        keyword: z.string().optional(),
        categoryId: z.number().optional().default(0),
        resultPerPage: z.number(),
        skip: z.number().optional(),
        sortBy: z.enum(SORTOPTIONS).optional(),
      })
    )
    .query(
      async ({
        ctx,
        input: { keyword, categoryId, resultPerPage, skip, sortBy },
      }) => {
        const childCategoriesId = await getChildCategories(
          categoryId,
          ctx.prisma
        );

        const productsRaw = await ctx.prisma.product.findMany({
          orderBy: { name: 'asc' },
          where: {
            AND: [
              keyword
                ? {
                    name: {
                      contains: keyword,
                      mode: 'insensitive',
                    },
                  }
                : {},
              categoryId ? { categoryId: { in: childCategoriesId } } : {},
            ],
          },
          include: {
            productItems: {
              take: 1,
              include: {
                variationOption: {
                  select: {
                    value: true,
                  },
                },
              },
              orderBy: {
                price: 'asc',
              },
            },
            category: true,
          },
        });

        const sortedProducts = sortBy
          ? productsRaw.sort((a, b) => {
              const cheapestPriceA = a.productItems[0]?.price.toNumber();
              const cheapestPriceB = b.productItems[0]?.price.toNumber();
              if (
                !cheapestPriceA ||
                typeof cheapestPriceA !== 'number' ||
                !cheapestPriceB ||
                typeof cheapestPriceB !== 'number'
              )
                return 0;
              if (sortBy === 'price-asc') {
                return cheapestPriceA - cheapestPriceB;
              } else if (sortBy === 'price-desc') {
                return cheapestPriceB - cheapestPriceA;
              }
              return 0;
            })
          : productsRaw;

        const firstItemIndex = skip ? skip : 0;
        const sliceEndIndex = firstItemIndex + resultPerPage;
        const pagedProducts = sortedProducts.slice(
          firstItemIndex,
          sliceEndIndex
        );

        const hasMore = sortedProducts.length >= firstItemIndex + resultPerPage;

        // if search filtered by category has no result
        if (categoryId && keyword && !productsRaw.length) {
          return {
            products: [],
            hasMore,
          };
        }

        const products = pagedProducts.map(
          ({ id, name, productImage, productItems }) => {
            const cheapestItem = productItems.reduce((prev, curr) => {
              return curr ? curr : prev;
            });
            const { price, variationOption } = cheapestItem;
            const option = variationOption.value;
            const product = {
              id,
              name,
              productImage,
              price: price.toNumber(),
              option,
            };
            return product;
          }
        );

        return { products, hasMore };
      }
    ),

  getBatchDetails: publicProcedure
    .input(
      z.object({
        keyword: z.string().optional(),
        categoryId: z.number().optional().default(0),
      })
    )
    .query(async ({ ctx, input: { keyword, categoryId } }) => {
      const childCategoriesId = await getChildCategories(
        categoryId,
        ctx.prisma
      );

      const products = await ctx.prisma.product.findMany({
        where: {
          AND: [
            keyword
              ? {
                  name: {
                    contains: keyword,
                    mode: 'insensitive',
                  },
                }
              : {},
            categoryId ? { categoryId: { in: childCategoriesId } } : {},
          ],
        },
        include: {
          category: true,
        },
      });

      const categories = products.map(({ category }) => category);
      const numberOfResults = products.length;

      // remove duplicate from categories
      const uniqueCategories = [...new Set(categories)];

      async function findAncestor(
        id: number,
        children: CategoryTree[] = []
      ): Promise<CategoryTree | void> {
        const curr = await ctx.prisma.productCategory.findUnique({
          where: { id },
        });

        if (!curr) {
          throw new Error(`Category ${id} not found`);
        }

        // if curr category is the highest level
        if (curr.parentCategoryId === null) {
          return {
            id,
            name: curr.categoryName,
            children,
          };
        }

        // if curr category is not the highest level
        const self: CategoryTree = { id, name: curr.categoryName };
        if (children.length !== 0) {
          self.children = children;
        }
        const parent = await findAncestor(curr.parentCategoryId, [self]);

        return parent;
      }

      // create an array of category trees
      const categoryTrees: CategoryTree[] = [];
      for (const category of uniqueCategories) {
        const curr = await findAncestor(category.id);
        if (curr) {
          categoryTrees.push(curr);
        }
      }

      type CategoryMapValue = Omit<CategoryTree, 'children'> & {
        children: Map<number, CategoryMapValue>;
      };

      function mergeTrees(trees: CategoryTree[]) {
        // merge into nested Map structure;
        const mergeTree = new Map<number, CategoryMapValue>();
        for (const tree of trees) fillMap(tree, mergeTree);

        function fillMap(
          src: CategoryTree,
          map: Map<number, CategoryMapValue>
        ) {
          let dst = map.get(src.id);
          if (!dst) {
            map.set(
              src.id,
              (dst = {
                ...src,
                children: new Map<number, CategoryMapValue>(),
              })
            );
          }
          for (const child of src.children ?? []) fillMap(child, dst.children);
        }

        // convert each map to array
        const toArrays = (map: Map<number, CategoryMapValue>): CategoryTree[] =>
          Array.from(map.values(), (node) =>
            Object.assign(node, { children: toArrays(node.children) })
          );

        const mergeTreeArrays = toArrays(mergeTree);

        return mergeTreeArrays;
      }

      // merge all category trees
      const mergedCategoryTrees = mergeTrees(categoryTrees);

      return { mergedCategoryTrees, numberOfResults };
    }),

  get: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input: { id } }) => {
      if (!id) return;
      const product = await ctx.prisma.product.findUniqueOrThrow({
        where: { id },
        include: {
          productItems: {
            orderBy: {
              price: 'desc',
            },
            include: {
              variationOption: {
                include: {
                  variations: true,
                },
              },
            },
          },
        },
      });

      return product;
    }),
});
