import { type NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';
import { api } from '~/utils/api';
import Image from 'next/image';

import Icon from '~/components/Icon';
import navLogo from 'public/amazon-logo.png';
import cartIcon from '/public/cart.png';
import localFont from 'next/font/local';
import { SyntheticEvent } from 'react';

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

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: 'from tRPC' });
  function goTop(event: SyntheticEvent) {
    event.preventDefault();
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  return (
    <>
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
      <main className={`${emberFont.variable} font-ember`}>
        {/* navbar container */}
        <nav className=" bg-[#232f3e]">
          {/* logo bar */}
          <section className="flex h-12 w-full flex-row flex-nowrap items-center justify-between">
            {/* logo bar left */}
            <div className="flex w-auto items-center">
              <Icon
                name="hamburger"
                strokeWidth={1.5}
                className="m-2 h-8 w-8 text-white"
              />
              <Image
                alt="amazon-logo"
                priority
                className="mt-1.5 w-20"
                src={navLogo}
              />
            </div>

            {/* logo bar right */}
            <div className="flex w-auto items-center">
              <div className="text-white">Sign in ›</div>
              <Icon
                name="user"
                strokeWidth={2.5}
                className="h-6 w-6 text-white"
              />
              <div className="flex w-auto items-center justify-center px-2">
                <Image alt="amazon-cart" className="w-10" src={cartIcon} />
                <span className="text-md absolute -top-0 font-bold text-orange-300">
                  99
                </span>
              </div>
            </div>
          </section>

          {/* search bar */}
          <section className="h-12 px-2.5 pt-[2px] pb-[5px]">
            <div className="flex h-full w-full items-center justify-between rounded-l-lg rounded-r-xl bg-white pl-2">
              <div className="flex h-full flex-grow items-center">
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
          <section className="no-scrollbar flex h-11  items-center overflow-x-auto whitespace-nowrap pr-5">
            <a className="ml-5 text-white">Best Sellers</a>
            <a className="ml-5 text-white">Deals</a>
            <a className="ml-5 text-white">Amazon Basics</a>
            <a className="ml-5 text-white">Books</a>
            <a className="ml-5 text-white">Computers & Accessories</a>
          </section>
        </nav>

        {/* nav location bar */}
        <section className="flex h-10 items-center bg-[#37475A] pl-5">
          {
            <Icon
              name="location"
              strokeWidth={1.5}
              className="h-5 w-5 text-white"
            />
          }
          <span className="ml-1 text-sm text-white">
            Deliver to Seattle 98121
          </span>
        </section>

        {/* dummy section to test scrollTop */}
        <section>
          <Image
            alt="amazon-logo"
            className="mt-1.5 h-screen border border-black"
            src={navLogo}
          />
          <Image
            alt="amazon-logo"
            className="mt-1.5 h-screen border border-black"
            src={navLogo}
          />
          <Image
            alt="amazon-logo"
            className="mt-1.5 h-screen border border-black"
            src={navLogo}
          />
          <Image
            alt="amazon-logo"
            className="mt-1.5 h-screen border border-black"
            src={navLogo}
          />
        </section>

        {/* bottom nav */}
        <section className="flex flex-col">
          <a
            className="flex h-12 flex-col items-center justify-center bg-[#37475A] hover:bg-[#485769]"
            onClick={goTop}
          >
            <Icon
              name="chevron_up"
              strokeWidth={2.5}
              className="h-4 w-4 text-white"
            />
            <span className="text-xs text-white">TOP OF PAGE</span>
          </a>
        </section>
      </main>
    </>
  );
};

export default Home;

// const AuthShowcase: React.FC = () => {
//   const { data: sessionData } = useSession();
//
//   const { data: secretMessage } = api.example.getSecretMessage.useQuery(
//     undefined, // no input
//     { enabled: sessionData?.user !== undefined }
//   );
//
//   return (
//     <div className="flex flex-col items-center justify-center gap-4">
//       <p className="text-center text-2xl text-white">
//         {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
//         {secretMessage && <span> - {secretMessage}</span>}
//       </p>
//       <button
//         className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
//         onClick={sessionData ? () => void signOut() : () => void signIn()}
//       >
//         {sessionData ? 'Sign out' : 'Sign in'}
//       </button>
//     </div>
//   );
// };
