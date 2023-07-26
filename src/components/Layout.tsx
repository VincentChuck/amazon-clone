import Head from 'next/head';
import Image from 'next/image';
import Icon from '~/components/Icon';
import navLogo from 'public/amazon-logo.png';
import cartIcon from '/public/cart.png';
import localFont from 'next/font/local';
import {
  useState,
  createContext,
  type SetStateAction,
  type Dispatch,
} from 'react';
import Link from 'next/link';
import Search from './Search';
import { TRADEMARK } from '~/utils/constants';
import { scrollTop } from '~/utils/helpers';
import { useCartItems } from '~/utils/useCart';

const emberFont = localFont({
  variable: '--font-ember',
  src: [
    {
      path: '../../public/font/AmazonEmber_W_Rg.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/font/AmazonEmber_W_RgIt.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../../public/font/AmazonEmber_W_Bd.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/font/AmazonEmber_W_BdIt.woff2',
      weight: '700',
      style: 'italic',
    },
  ],
  fallback: ['arial', 'sans-serif'],
});

type Props = {
  children:
    | Array<JSX.Element[] | JSX.Element>
    | JSX.Element[]
    | JSX.Element
    | null;
};

export const SearchTermCtx = createContext<SearchTermObjectType | null>(null);

export type SearchTermObjectType = {
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
};

function Layout({ children }: Props) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { cartCount } = useCartItems();

  return (
    <SearchTermCtx.Provider value={{ searchTerm, setSearchTerm }}>
      <div>
        <Head>
          <title>Amazon Clone</title>
          <meta
            name="description"
            content="Amazon clone. This is not the real Amazon website."
          />
          <meta name="keywords" content="Amazon Clone" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div
          className={`${emberFont.variable} flex min-h-screen flex-col font-ember`}
        >
          {/* navbar container */}
          <header className="bg-slate-800 text-white md:bg-slate-900">
            {/* logo bar */}
            <section className="flex h-12 w-full flex-row flex-nowrap items-center justify-between md:h-16 md:px-2">
              {/* logo bar left */}
              <div className="flex w-auto flex-shrink-0 items-center">
                <Link href="/">
                  <Image
                    alt="amazon-logo"
                    priority
                    className="ml-4 mt-1.5 w-20 md:w-24"
                    src={navLogo}
                  />
                </Link>
              </div>

              {/* logo bar centre for larger screen */}
              <div className="mx-4 hidden h-full w-full items-center gap-4 py-3 md:flex">
                {/* deliver to */}
                <div className="flex items-end">
                  <Icon name="location" strokeWidth={1.5} className="h-6 w-6" />
                  <div className="flex flex-col whitespace-nowrap">
                    <span className="text-xs text-gray-300">Deliver to</span>
                    <span className="text-sm font-bold">Seattle 98121</span>
                  </div>
                </div>

                {/* search bar for larger screen */}
                <Search />
                <div className="ml-2 flex items-center whitespace-nowrap font-bold">
                  <span>🇺🇸 EN</span>
                  <Icon
                    name="chevron_down"
                    strokeWidth={2.5}
                    className="ml-1 h-3 w-3 text-gray-300"
                  />
                </div>
              </div>

              {/* logo bar right */}
              <div className="ml-2 flex w-auto flex-shrink-0 items-center whitespace-nowrap">
                {/* mobile login button */}
                <div className="flex items-center md:hidden">
                  <div className="max-[290px]:hidden">Sign in ›</div>
                  <Icon
                    name="user"
                    strokeWidth={2.5}
                    className="h-6 w-6 max-[240px]:hidden"
                  />
                </div>

                {/* larger screen login button */}
                <div className="hidden flex-col items-start md:flex ">
                  <span className="text-xs">Hello, sign in</span>
                  <div className="flex items-center">
                    <span className="text-sm font-bold">Account & Orders</span>
                    <Icon
                      name="chevron_down"
                      strokeWidth={2.5}
                      className="ml-1 h-3 w-3 text-gray-300"
                    />
                  </div>
                </div>
                <Link href="/cart" className="flex items-center">
                  <div className="ml-4 flex w-auto items-center justify-center">
                    <Image alt="amazon-cart" className="w-10" src={cartIcon} />
                    <div className="text-md absolute -top-0 flex w-[30px] justify-center font-bold text-orange-300 md:top-2">
                      <span>{cartCount > 99 ? '99+' : cartCount}</span>
                    </div>
                  </div>
                  <span className="relative -bottom-2 right-2 hidden text-sm font-bold lg:flex">
                    Cart
                  </span>
                </Link>
              </div>
            </section>

            {/* search bar */}
            <section className="h-12 px-2.5 pb-[5px] pt-[2px] md:hidden">
              <Search />
            </section>

            {/* nav links bar */}
            <nav className="no-scrollbar flex h-11  items-center overflow-x-auto whitespace-nowrap pr-5 md:h-9 md:bg-slate-800 md:text-sm">
              <Link href="/products" className="ml-4">
                All Books
              </Link>
              <Link href="/products?cid=1" className="ml-5">
                Fiction
              </Link>
              <Link href="/products?cid=2" className="ml-5">
                Non-Fiction
              </Link>
              <Link href="/products?cid=3" className="ml-5">
                Children&apos;s Books
              </Link>
            </nav>

            {/* nav location bar */}
            <section className="flex h-10 items-center bg-[#37475A] pl-5 md:hidden">
              <Icon name="location" strokeWidth={1.5} className="h-5 w-5" />
              <span className="ml-1 text-sm">Deliver to Seattle 98121</span>
            </section>
          </header>

          <main className="flex flex-grow">{children}</main>

          {/* bottom nav */}
          <section className="flex flex-col text-white">
            <a
              className="flex h-12 cursor-pointer flex-col items-center justify-center bg-[#37475A] hover:bg-[#485769]"
              onClick={scrollTop}
            >
              <Icon
                name="chevron_up"
                strokeWidth={2.5}
                className="h-4 w-4 md:hidden"
              />
              <span className="text-xs md:hidden">TOP OF PAGE</span>
              <span className="hidden text-sm md:flex">Back to top</span>
            </a>

            {/* bottom links */}
            <div className="flex items-center justify-center bg-slate-800 p-4 md:border-b md:border-gray-600">
              <nav className="grid grid-flow-col grid-rows-2 gap-x-24 md:flex md:items-center md:justify-center md:gap-12">
                <a className="my-1">Your orders</a>
                <a className="my-1">Your account</a>
                <a className="my-1">Browsing History</a>
                <Link href="/cart" className="my-1">
                  Your Cart
                </Link>
              </nav>
            </div>

            {/* bottom region and language selection */}
            <div className="flex h-44 flex-col items-center justify-around bg-[#0F1111] p-6 text-gray-300 md:h-20 md:flex-row md:justify-center md:gap-20 md:bg-slate-800">
              <Image
                alt="amazon-logo"
                priority
                className="mt-1.5 hidden w-20 md:flex"
                src={navLogo}
              />
              <div className="flex gap-8">
                <div>
                  <Icon
                    name="globe"
                    strokeWidth={1.5}
                    className="mr-1 inline h-5 w-5"
                  />
                  <span>English</span>
                </div>
                <span>🇺🇸 United States</span>
              </div>
              <div className="md:hidden">
                <span>Already a customer? </span>
                <a className="font-bold text-white">Sign in</a>
              </div>
              <div className="text-xs md:hidden">{TRADEMARK}</div>
            </div>

            {/* bottom copyright notice */}
            <div className="hidden h-12 items-center justify-center bg-gray-900 text-xs md:flex">
              {TRADEMARK}
            </div>
          </section>
        </div>
      </div>
    </SearchTermCtx.Provider>
  );
}

export default Layout;
