import fs from 'fs';
import categoryTreeRawJson from './categoryTreeRaw.json';

const categoryTreeRaw: CategoryTreeRaw = categoryTreeRawJson;

export type CategoryObject = {
  categoryName: string;
  id: number;
  parentCategoryId?: number;
  descendentIds?: number[];
};

export type CategoryMap = { [key: number]: CategoryObject };

type CategoryTreeRaw = {
  [key: string]: CategoryTreeRaw | null;
};

function flattenCategoryTree(categoryTreeRaw: CategoryTreeRaw) {
  let idCounter = 0;
  const queue: { parentId?: number; category: CategoryTreeRaw }[] = [
    { category: categoryTreeRaw },
  ];
  const categoryMap: CategoryMap = {};

  while (queue.length) {
    const currQueue = queue.shift() as (typeof queue)[0];
    const currCatRaw = currQueue.category;
    for (const categoryName in currCatRaw) {
      const category: CategoryObject = { categoryName, id: ++idCounter };

      let parentId: number | undefined = currQueue.parentId;
      if (parentId) category.parentCategoryId = parentId;

      while (parentId) {
        (categoryMap[parentId] as CategoryObject).descendentIds = [
          ...(categoryMap[parentId]?.descendentIds ?? []),
          idCounter,
        ];

        parentId = (categoryMap[parentId] as CategoryObject).parentCategoryId;
      }

      const children = currCatRaw[categoryName];
      if (children) {
        queue.push({ parentId: category.id, category: children });
      }

      categoryMap[category.id] = category;
    }
  }

  return categoryMap;
}

const categoryMap = flattenCategoryTree(categoryTreeRaw);

const jsonCategoryMap = JSON.stringify(categoryMap, null, 2);

fs.writeFile(
  './src/utils/data/categoryMap.json',
  jsonCategoryMap,
  'utf8',
  (err) => {
    if (err) {
      console.error('Error writing JSON file:', err);
    } else {
      console.log('JSON file saved successfully!');
    }
  }
);

// import categoryMapJson from './categoryMap.json';
// const categoryMap: CategoryTreeData = categoryMapJson;
// const bottomCatNames = [...Object.values(categoryMap)]
//   .filter((cat) => {
//     return !Object.keys(cat).includes('descendentIds');
//   })
//   .map((cat) => {
//     return cat.categoryName;
//   });
//
// console.log(bottomCatNames);
