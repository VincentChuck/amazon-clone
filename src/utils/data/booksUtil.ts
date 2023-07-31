import fs from 'fs';
import booksRawJson from './booksRaw.json';
type BooksRaw = { [key: string]: string[] };
const booksRaw: BooksRaw = booksRawJson;
import type { CategoryMap } from './categoryUtil';
import categoryMapJson from './categoryMap.json';
const categoryMap: CategoryMap = categoryMapJson;

export type BookObject = {
  id: number;
  name: string;
  categoryId: number;
};
export type BooksMap = {
  [key: number]: BookObject;
};

function mapBooks(booksRaw: BooksRaw) {
  let idCounter = 0;
  const booksMap: BooksMap = {};

  for (const key in booksRaw) {
    const arr = booksRaw[key];
    const categoryId = Object.values(categoryMap).find(
      (c) => c.categoryName === key
    )?.id;
    if (!arr || !arr.length || !categoryId) continue;

    for (let i = 0; i < arr.length; i++) {
      const name = arr[i];
      if (!name) continue;
      const book: BookObject = { id: ++idCounter, name, categoryId };
      booksMap[idCounter] = book;
    }
  }

  return booksMap;
}

const booksMap = mapBooks(booksRaw);
const jsonBooksMap = JSON.stringify(booksMap, null, 2);

fs.writeFile('./src/utils/data/booksMap.json', jsonBooksMap, 'utf8', (err) => {
  if (err) {
    console.error('Error writing JSON file:', err);
  } else {
    console.log('JSON file saved successfully!');
  }
});

// function removeDupBooks(booksRaw: BooksRaw) {
//   const visited: string[] = [];
//   for (const key in booksRaw) {
//     const arr = booksRaw[key];
//     if (!arr || !arr.length) continue;
//     for (let i = 0; i < arr.length; i++) {
//       if (visited.includes(arr[i] as string)) {
//         arr.splice(i, 1);
//         i--;
//       } else {
//         visited.push(arr[i] as string);
//       }
//     }
//   }
//   return booksRaw;
// }
