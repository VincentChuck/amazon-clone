import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Icon from '~/components/Icon';
import navLogo from 'public/amazon-logo.png';
import cartIcon from '/public/cart.png';
import localFont from 'next/font/local';
import { type SyntheticEvent } from 'react';
import Link from 'next/link';

const TRADEMARK = '© 1996-2023, (Not) Amazon.com, Inc. or its affiliates';

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

function scrollTop(event: SyntheticEvent) {
  event.preventDefault();
  const duration = 300; // arbitrary number for smooth and noticeable animation
  const initY = window.scrollY;

  //ease in and ease out function
  function timingFunc(t: number) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  let startTime: number;

  const step = (timeStamp: number) => {
    startTime = startTime || timeStamp;
    const progress = Math.min(1, (timeStamp - startTime) / duration); // in percentage

    window.scrollTo(0, initY - timingFunc(progress) * initY);
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };

  window.requestAnimationFrame(step);
}

function Layout({ children }: Props) {
  return (
    <div>
      <Head>
        <title>Amazon.com. Spend less. Smile more.</title>
        <meta
          name="description"
          content="Free shipping on millions of items. Get the best of Shopping and Entertainment with Prime. Enjoy low prices and great deals on the largest selection of everyday essentials and other products, including fashion, home, beauty, electronics, Alexa Devices, sporting goods, toys, automotive, pets, baby, books, video games, musical instruments, office supplies, and more."
        />
        <meta
          name="keywords"
          content="Amazon, Amazon.com, Books, Online Shopping, Book Store, Magazine, Subscription, Music, CDs, DVDs, Videos, Electronics, Video Games, Computers, Cell Phones, Toys, Games, Apparel, Accessories, Shoes, Jewelry, Watches, Office Products, Sports & Outdoors, Sporting Goods, Baby Products, Health, Personal Care, Beauty, Home, Garden, Bed & Bath, Furniture, Tools, Hardware, Vacuums, Outdoor Living, Automotive Parts, Pet Supplies, Broadband, DSL"
        />
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
              <Icon
                name="hamburger"
                strokeWidth={1.5}
                className="m-2 h-8 w-8 md:hidden"
              />
              <Link href="/">
                <Image
                  alt="amazon-logo"
                  priority
                  className="ml-2 mt-1.5 w-20 md:w-24"
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
              <div className="ml-2 flex h-full w-full items-center justify-between whitespace-nowrap rounded-md bg-white pl-2">
                <div className="flex h-full flex-grow items-center text-lg text-gray-900">
                  Search Amazon
                </div>
                <div className="flex h-full w-12 items-center justify-center rounded-r-md bg-orange-300">
                  <Icon
                    name="search"
                    strokeWidth={2.5}
                    className="h-6 w-6 text-black"
                  />
                </div>
              </div>
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
              <div className="ml-4 flex w-auto items-center justify-center">
                <Image alt="amazon-cart" className="w-10" src={cartIcon} />
                <span className="text-md absolute -top-0 font-bold text-orange-300 md:top-2">
                  99
                </span>
              </div>
              <span className="relative -bottom-2 right-2 hidden text-sm font-bold lg:flex">
                Cart
              </span>
            </div>
          </section>

          {/* search bar */}
          <section className="h-12 px-2.5 pb-[5px] pt-[2px] md:hidden">
            <div className="flex h-full w-full items-center justify-between rounded-l-lg rounded-r-xl bg-white pl-2">
              <div className="flex h-full flex-grow items-center text-gray-900">
                Search Amazon
              </div>
              <div className="flex h-full w-12 items-center justify-center rounded-lg bg-orange-300">
                <Icon
                  name="search"
                  strokeWidth={2.5}
                  className="h-6 w-6 text-black"
                />
              </div>
            </div>
          </section>

          {/* nav links bar */}
          <nav className="no-scrollbar flex h-11  items-center overflow-x-auto whitespace-nowrap pr-5 md:h-9 md:bg-slate-800 md:text-sm">
            <div className="hidden items-center font-bold md:flex">
              <Icon
                name="hamburger"
                strokeWidth={1.5}
                className="ml-2 h-7 w-7"
              />
              <span>All</span>
            </div>
            <a className="ml-5">Best Sellers</a>
            <a className="ml-5">Deals</a>
            <a className="ml-5">Amazon Basics</a>
            <Link className="ml-5" href="/products?cid=1">
              Books
            </Link>
            <a className="ml-5">Computers & Accessories</a>
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
              <a className="my-1">Your Cart</a>
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
  );
}

export default Layout;
