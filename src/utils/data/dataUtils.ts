import fs from 'fs';
import categoryTreeRawJson from './categoryTreeRaw.json';

const categoryTreeRaw: CategoryTreeRaw = categoryTreeRawJson;

export type CategoryObject = {
  categoryName: string;
  id: number;
  parentCategoryId?: number;
  descendentIds?: number[];
};

export type CategoryTreeData = { [key: number]: CategoryObject };

type CategoryTreeRaw = {
  [key: string]: CategoryTreeRaw | null;
};

function flattenCategoryTree(categoryTreeRaw: CategoryTreeRaw) {
  let idCounter = 0;
  const queue: { parentId?: number; category: CategoryTreeRaw }[] = [
    { category: categoryTreeRaw },
  ];
  const categoryTree: CategoryTreeData = {};

  while (queue.length) {
    const currQueue = queue.shift() as (typeof queue)[0];
    const currCatRaw = currQueue.category;
    for (const categoryName in currCatRaw) {
      const category: CategoryObject = { categoryName, id: ++idCounter };

      let parentId: number | undefined = currQueue.parentId;
      if (parentId) category.parentCategoryId = parentId;

      while (parentId) {
        (categoryTree[parentId] as CategoryObject).descendentIds = [
          ...(categoryTree[parentId]?.descendentIds ?? []),
          idCounter,
        ];

        parentId = (categoryTree[parentId] as CategoryObject).parentCategoryId;
      }

      const children = currCatRaw[categoryName];
      if (children) {
        queue.push({ parentId: category.id, category: children });
      }

      categoryTree[category.id] = category;
    }
  }

  return categoryTree;
}

const categoryTree = flattenCategoryTree(categoryTreeRaw);

const jsonCategoryTree = JSON.stringify(categoryTree, null, 2);

fs.writeFile(
  './src/utils/data/categoryMap.json',
  jsonCategoryTree,
  'utf8',
  (err) => {
    if (err) {
      console.error('Error writing JSON file:', err);
    } else {
      console.log('JSON file saved successfully!');
    }
  }
);
