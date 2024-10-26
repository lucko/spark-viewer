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
                    name="robots"
                    content="noindex, nofollow"
                />
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
