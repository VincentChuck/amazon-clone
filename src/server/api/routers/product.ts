import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { z } from 'zod';

export const productRouter = createTRPCRouter({
  products: publicProcedure
    .input(
      z.object({
        keyword: z.string().optional(),
        categoryId: z.number().optional(),
      })
    )

    .query(async ({ ctx, input: { keyword, categoryId } }) => {
      const productsRaw = await ctx.prisma.product.findMany({
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
            categoryId ? { categoryId: { equals: categoryId } } : {},
          ],
        },
        include: {
          productItems: {
            include: {
              variationOptions: {
                select: {
                  value: true,
                },
              },
            },
          },
          category: true,
        },
      });

      const categories = productsRaw.map((product) => product.category);

      // remove duplicate from categories
      const uniqueCategories = [...new Set(categories)];

      type CategoryTree = {
        id: number;
        name: string;
        children?: CategoryTree[];
      };

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
              (dst = { ...src, children: new Map<number, CategoryMapValue>() })
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

      const products = productsRaw.map(
        ({ id, name, productImage, productItems }) => {
          const cheapestItem = productItems.reduce((prev, curr) => {
            return prev.price.gt(curr.price) ? curr : prev;
          });
          const { price, variationOptions } = cheapestItem;
          const option = variationOptions[0]?.value || '';
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

      return { products, mergedCategoryTrees };
    }),
});
