import { useEffect } from 'react';
import { useRouter } from 'next/router';
// import { signIn, signOut, useSession } from 'next-auth/react';
// import { api } from '~/utils/api';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    void router.push({ pathname: '/products', query: { cid: 1 } }, undefined, {
      shallow: true,
    });
  });

  return <div>Nothing to see here yet...</div>;
}

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
