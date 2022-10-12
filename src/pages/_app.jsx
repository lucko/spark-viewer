// import App from 'next/app'
import '../style/base.scss';
import '../style/page.scss';

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
