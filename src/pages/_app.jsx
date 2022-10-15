// import App from 'next/app'
import '../style/base.scss';

import { config } from '@fortawesome/fontawesome-svg-core';

config.autoAddCss = false;

import Head from 'next/head';
import { createContext, useState } from 'react';
import SparkLayout from '../components/SparkLayout';

export const SelectedFileContext = createContext();

function MyApp({ Component, pageProps }) {
    // Use the layout defined at the page level, if available
    const getLayout =
        Component.getLayout || (page => <SparkLayout>{page}</SparkLayout>);

    const [selectedFile, setSelectedFile] = useState();

    return (
        <>
            <Head>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <meta
                    name="twitter:card"
                    content="summary"
                    key="twitter-card"
                />
                <meta name="twitter:title" content="spark" />
                <meta
                    name="twitter:description"
                    content="spark is a performance profiler for Minecraft clients, servers, and proxies."
                />
                <meta
                    name="twitter:image"
                    content="https://spark.lucko.me/assets/logo-inverted-512.png"
                    key="twitter-image"
                />

                <meta property="og:title" content="spark" />
                <meta
                    property="og:description"
                    content="spark is a performance profiler for Minecraft clients, servers, and proxies."
                />
                <meta property="og:type" content="product" />
                <meta
                    property="og:image"
                    content="https://spark.lucko.me/assets/logo-inverted-512.png"
                    key="og-image"
                />
                <meta property="og:url" content="https://spark.lucko.me/" />
                <title>spark</title>
            </Head>
            <SelectedFileContext.Provider
                value={{ selectedFile, setSelectedFile }}
            >
                {getLayout(<Component {...pageProps} />)}
            </SelectedFileContext.Provider>
        </>
    );
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);
//
//   return { ...appProps }
// }

export default MyApp;
