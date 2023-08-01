import { useRef, useContext } from 'react';
import Icon from './Icon';
import { useRouter } from 'next/router';
import { SearchTermCtx } from '~/components/Layout';

export default function Search() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTermObj = useContext(SearchTermCtx);
  if (!searchTermObj) throw new Error("Search term context isn't provided");
  const { searchTerm, setSearchTerm } = searchTermObj;

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    void e.preventDefault();
    const input = inputRef.current?.value || '';
    setSearchTerm(input);
    void router.push({ query: { k: input } }, undefined);
    inputRef.current?.blur();
  }

  return (
    <form
      className="flex h-full w-full items-center justify-between rounded-md bg-white pl-2"
      onSubmit={handleSearch}
    >
      <input
        id="searchInput"
        value={searchTerm}
        ref={inputRef}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex h-full flex-grow items-center text-gray-900 focus-visible:outline-none"
        placeholder="Search books"
      />
      <button
        type="submit"
        className="flex h-full w-12 items-center justify-center rounded-r-md bg-orange-300"
      >
        <Icon name="search" strokeWidth={2.5} className="h-6 w-6 text-black" />
      </button>
    </form>
  );
}
