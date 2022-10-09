import React, { Suspense, useState } from 'react';
import SparkLayout from '../components/SparkLayout';
import TextBox from '../components/TextBox';
import { useRouter } from 'next/router';
import { LOADING_DATA } from '../status';
import dynamic from 'next/dynamic';

const SparkViewer = dynamic(() => import('../SparkViewer'), { suspense: true });

export default function ViewerPage() {
    const router = useRouter();
    const [status, setStatus] = useState(LOADING_DATA);

    return (
        <Suspense
            fallback={
                <SparkLayout>
                    <TextBox>Loading...</TextBox>
                </SparkLayout>
            }
        >
            <SparkViewer
                status={status}
                setStatus={setStatus}
                code={router.query['code']}
                selectedFile={undefined}
            />
        </Suspense>
    );
}

// Don't use app-level layout
ViewerPage.getLayout = page => page;
