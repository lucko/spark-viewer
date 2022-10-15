import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import SparkLayout from '../components/SparkLayout';
import TextBox from '../components/TextBox';

const SparkViewer = dynamic(() => import('../SparkViewer'), { suspense: true });

export default function ViewerPage() {
    return (
        <Suspense
            fallback={
                <SparkLayout>
                    <TextBox>Loading...</TextBox>
                </SparkLayout>
            }
        >
            <SparkViewer />
        </Suspense>
    );
}

// Don't use app-level layout
ViewerPage.getLayout = page => page;
