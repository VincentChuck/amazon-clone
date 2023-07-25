export const categoryTree = {
  Books: {
    Fiction: {
      'Mystery & Thrillers': {
        'Detective Fiction': null,
        'Psychological Thrillers': null,
        'Crime Fiction': null,
      },
      Romance: {
        'Contemporary Romance': null,
        'Historical Romance': null,
        'Paranormal Romance': null,
      },
      'Science Fiction & Fantasy': {
        'Hard Science Fiction': null,
        Fantasy: {
          'Epic Fantasy': null,
          'Urban Fantasy': null,
        },
      },
      'Historical Fiction': null,
    },
    'Non-Fiction': {
      'Self-Help & Personal Development': null,
      'Biographies & Memoirs': {
        Autobiographies: null,
        'Political Figures': null,
      },
      'Travel & Adventure': {
        'Travel Guides': null,
        'Adventure Stories': null,
      },
      'Health & Wellness': {
        'Fitness & Exercise': null,
        'Mental Health & Psychology': null,
        'Nutrition & Dieting': null,
      },
    },
    "Children's Books": {
      'Picture Books': {
        'Bedtime Stories': null,
        'ABC & Counting Books': null,
      },
      'Early Readers': {
        'Learn-to-Read Books': null,
        'Phonics & Sight Words': null,
      },
      'Middle Grade': {
        'Adventure & Mystery': null,
        'Fantasy & Magic': null,
        'Friendship & School Life': null,
      },
      'Young Adult': {
        'Contemporary YA': null,
        'Dystopian & Sci-Fi YA': null,
        'Fantasy & Paranormal YA': null,
      },
    },
  },
};

interface CategoryObject {
  categoryName: string;
  id: number;
  parentCategoryId?: number;
}

type CategoryTree = {
  [key: string]: CategoryTree | null;
};

let idCounter = 0;

function flattenCategoryTree(
  categoryTree: CategoryTree,
  parentCategoryId?: number
) {
  const intermediateCatArr: CategoryObject[] = [];
  const bottomCatArr: CategoryObject[] = [];

  for (const categoryName in categoryTree) {
    const category: CategoryObject = { categoryName, id: ++idCounter };

    if (parentCategoryId) {
      category.parentCategoryId = parentCategoryId;
    }

    if (categoryTree[categoryName] === null) {
      bottomCatArr.push(category);
    } else {
      intermediateCatArr.push(category);
      const childCategories = flattenCategoryTree(
        categoryTree[categoryName] as CategoryTree,
        category.id
      );
      intermediateCatArr.push(...childCategories.intermediateCatArr);
      bottomCatArr.push(...childCategories.bottomCatArr);
    }
  }

  return { intermediateCatArr, bottomCatArr };
}

export const { intermediateCatArr, bottomCatArr } =
  flattenCategoryTree(categoryTree);
