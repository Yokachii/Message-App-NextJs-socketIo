import "@mantine/core/styles.css";
import Head from "next/head";
import { MantineProvider } from "@mantine/core";
import { theme } from "../../theme";
import "../styles/globals.scss";
import { Navbar } from "@/components/core/Navbar";
import { Footer } from "@/components/core/Footer";
import '@mantine/notifications/styles.css';

import { SessionProvider, useSession } from "next-auth/react"
import { Notifications } from "@mantine/notifications";
import { getServerSession } from "next-auth";
// import SocketContextt from "@/providers/SocketIoProvider";
import { authOptions } from "./api/auth/[...nextauth]";

import { TestWrapper } from '@/context/test/main'

const App = ({ Component, pageProps: { session, ...pageProps }, }: any) => {
  // const sessions = await getServerSession(authOptions)

  return (
    <SessionProvider session={session}>
      <MantineProvider theme={theme}>
        <Notifications />
        
        <TestWrapper>

          <Head>
            <title>Oxie</title>
            <meta
              name="viewport"
              content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
            />
            <link rel="shortcut icon" href="/favicon.svg" />
          </Head>
          <Navbar />
          <Component {...pageProps} />
          <Footer />
          
        </TestWrapper>

      </MantineProvider>
    </SessionProvider>
  );
}

export default App;