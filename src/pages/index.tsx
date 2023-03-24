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
        <nav className="bg-[#232f3e] text-white">
          {/* logo bar */}
          <section className="flex h-12 w-full flex-row flex-nowrap items-center justify-between">
            {/* logo bar left */}
            <div className="flex w-auto items-center">
              <Icon
                name="hamburger"
                strokeWidth={1.5}
                className="m-2 h-8 w-8"
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
              <div>Sign in ›</div>
              <Icon name="user" strokeWidth={2.5} className="h-6 w-6" />
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
          <section className="no-scrollbar flex h-11  items-center overflow-x-auto whitespace-nowrap pr-5">
            <a className="ml-5">Best Sellers</a>
            <a className="ml-5">Deals</a>
            <a className="ml-5">Amazon Basics</a>
            <a className="ml-5">Books</a>
            <a className="ml-5">Computers & Accessories</a>
          </section>

          {/* nav location bar */}
          <section className="flex h-10 items-center bg-[#37475A] pl-5">
            {<Icon name="location" strokeWidth={1.5} className="h-5 w-5" />}
            <span className="ml-1 text-sm">Deliver to Seattle 98121</span>
          </section>
        </nav>

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
        </section>

        {/* bottom nav */}
        <section className=" flex flex-col text-white">
          <a
            className="flex h-12 flex-col items-center justify-center bg-[#37475A] hover:bg-[#485769]"
            onClick={goTop}
          >
            <Icon
              name="chevron_up"
              strokeWidth={2.5}
              className="h-4 w-4 sm:hidden"
            />
            <span className="text-xs sm:hidden">TOP OF PAGE</span>
            <span className="hidden text-sm sm:flex">Back to top</span>
          </a>

          <div className="flex items-center justify-center bg-[#232f3e] p-4 sm:border-b sm:border-gray-600">
            <nav className="grid grid-flow-col grid-rows-2 gap-x-24 sm:flex sm:items-center sm:justify-center sm:gap-12">
              <a className="my-1">Your orders</a>
              <a className="my-1">Your account</a>
              <a className="my-1">Browsing History</a>
              <a className="my-1">Your Cart</a>
            </nav>
          </div>

          <div className="flex h-44 flex-col items-center justify-around bg-[#0F1111] p-6 text-gray-300 sm:h-20 sm:flex-row sm:justify-center sm:gap-20 sm:bg-[#232f3e]">
            <Image
              alt="amazon-logo"
              priority
              className="mt-1.5 hidden w-20 sm:flex"
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
            <div className="font-bold text-white sm:hidden">
              <span>Already a customer? </span>
              <a>Sign in</a>
            </div>
            <div className="text-xs sm:hidden">
              © 1996-2023, Amazon.com, Inc. or its affiliates
            </div>
          </div>
          <div className="hidden h-12 items-center justify-center bg-gray-900 text-xs sm:flex">
            © 1996-2023, Amazon.com, Inc. or its affiliates
          </div>
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
