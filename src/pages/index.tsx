import { type NextPage } from 'next';
import { signIn, signOut, useSession } from 'next-auth/react';
import { api } from '~/utils/api';
import Image from 'next/image';
import Layout from '~/components/Layout';

import navLogo from 'public/amazon-logo.png';

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: 'from tRPC' });

  return (
    <Layout>
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
    </Layout>
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
