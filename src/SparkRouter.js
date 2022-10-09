import React, { Suspense } from 'react';
import Header, { HomepageHeader } from './components/Header';
import { DOWNLOAD, HOMEPAGE, PAGE_NOT_FOUND } from './status';

import SparkLayout from './components/SparkLayout';
import TextBox from './components/TextBox';

const Homepage = React.lazy(() => import('./pages'));
const Download = React.lazy(() => import('./pages/Download'));

export default function SparkRouter({ status, onFileSelected }) {
    let header = <Header />;

    let contents;
    switch (status) {
        case HOMEPAGE:
            header = <HomepageHeader />;
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
            contents = <TextBox>Unknown state - this is a bug.</TextBox>;
            break;
    }

    return <SparkLayout header={header}>{contents}</SparkLayout>;
}
