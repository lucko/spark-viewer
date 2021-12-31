import { DOWNLOAD, HOMEPAGE, PAGE_NOT_FOUND } from './status';
import React, { Suspense } from 'react';

import SparkPage from './components/SparkPage';
import TextBox from './components/TextBox';

const Homepage = React.lazy(() => import('./pages/Homepage'));
const Download = React.lazy(() => import('./pages/Download'));

export default function SparkRouter({ status, onFileSelected }) {
    let contents;
    switch (status) {
        case HOMEPAGE:
            contents = (
                <Suspense fallback={null}>
                    <Homepage onFileSelected={onFileSelected} />
                </Suspense>
            );
            break;
        case DOWNLOAD:
            contents = (
                <Suspense fallback={null}>
                    <Download />
                </Suspense>
            );
            break;
        case PAGE_NOT_FOUND:
            contents = <TextBox>404 - Page Not Found</TextBox>;
            break;
        default:
            contents = (
                <TextBox>Unknown state - this is a bug.</TextBox>
            );
            break;
    }

    return <SparkPage>{contents}</SparkPage>;
}
