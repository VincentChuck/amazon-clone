import { type AppType } from 'next/app';
import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { api } from '~/utils/api';
import '~/styles/globals.css';
import Layout from '~/components/Layout';
import { Provider } from 'react-redux';
import store from '~/reducers/store';

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Provider store={store}>
        <ReactQueryDevtools initialIsOpen={false} />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Provider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
