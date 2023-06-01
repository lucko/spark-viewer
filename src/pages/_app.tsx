import '../style/base.scss';

import { config } from '@fortawesome/fontawesome-svg-core';

config.autoAddCss = false;

import { NextPage } from 'next';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
    createContext,
    Dispatch,
    ReactElement,
    ReactNode,
    SetStateAction,
    useState,
} from 'react';
import SparkLayout from '../components/SparkLayout';
import { env } from '../env.mjs';

export interface SelectedFile {
    selectedFile?: File;
    setSelectedFile: Dispatch<SetStateAction<File | undefined>>;
}

export const SelectedFileContext = createContext<SelectedFile>({
    selectedFile: undefined,
    setSelectedFile: value => {},
});

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
    // Use the layout defined at the page level, if available
    const getLayout =
        Component.getLayout || (page => <SparkLayout>{page}</SparkLayout>);

    const [selectedFile, setSelectedFile] = useState<File>();

    const router = useRouter();
    const title =
        {
            '/download': 'spark | downloads',
            '/changelog': 'spark | changelog',
        }[router.pathname] || 'spark';

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
                    content={`${env.NEXT_PUBLIC_BASE_URL}/assets/logo-inverted-512.png`}
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
                    content={`${env.NEXT_PUBLIC_BASE_URL}/assets/logo-inverted-512.png`}
                    key="og-image"
                />
                <meta property="og:url" content={env.NEXT_PUBLIC_BASE_URL} />
                <title>{title}</title>
            </Head>
            <SelectedFileContext.Provider
                value={{ selectedFile, setSelectedFile }}
            >
                {getLayout(<Component {...pageProps} />)}
            </SelectedFileContext.Provider>
        </>
    );
}
