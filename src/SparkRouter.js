import React, { Suspense } from 'react';

import SparkPage from './components/SparkPage';
import BannerNotice from './components/BannerNotice';

import { HOMEPAGE, DOWNLOAD, PAGE_NOT_FOUND } from './status';

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
            contents = <BannerNotice>404 - Page Not Found</BannerNotice>;
            break;
        default:
            contents = (
                <BannerNotice>Unknown state - this is a bug.</BannerNotice>
            );
            break;
    }

    return <SparkPage>{contents}</SparkPage>;
}
