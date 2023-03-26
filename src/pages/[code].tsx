import { GetServerSidePropsContext } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { Suspense } from 'react';
import SparkLayout from '../components/SparkLayout';
import TextBox from '../components/TextBox';

const SparkViewer = dynamic(() => import('../viewer/SparkViewer'), {
    suspense: true,
});

interface ViewerPageProps {
    code: string;
}

export default function ViewerPage({ code }: ViewerPageProps) {
    return (
        <>
            {code !== '_' && <ThumbnailMetaTags code={code} />}
            <Suspense
                fallback={
                    <SparkLayout>
                        <TextBox>Loading...</TextBox>
                    </SparkLayout>
                }
            >
                <SparkViewer />
            </Suspense>
        </>
    );
}

const ThumbnailMetaTags = ({ code }: ViewerPageProps) => {
    return (
        <Head>
            <title>{`spark | ${code}`}</title>
            <meta
                property="og:image"
                content={`https://spark.lucko.me/thumb/${code}.png`}
                key="og-image"
            />
            <meta
                name="twitter:image"
                content={`https://spark.lucko.me/thumb/${code}.png`}
                key="twitter-image"
            />
            <meta
                name="twitter:card"
                content="summary_large_image"
                key="twitter-card"
            />
        </Head>
    );
};

// Just pass the query parameter to the component during SSR
// (seems like a bit of a waste, but it's the only way as this page is a dynamic route)
export async function getServerSideProps({
    query,
    res,
}: GetServerSidePropsContext) {
    res.setHeader('Cache-Control', 'public, maxage=31536000');
    return { props: { code: query.code } };
}
