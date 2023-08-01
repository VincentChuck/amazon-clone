export default function Home() {
  return <div></div>;
}

export function getServerSideProps() {
  return {
    redirect: {
      permanent: true,
      destination: '/products',
    },
  };
}
