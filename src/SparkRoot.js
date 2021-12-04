import React, { Suspense, useState } from 'react';
import history from 'history/browser';

import Header from './components/Header';
import Footer from './components/Footer';
import BannerNotice from './components/BannerNotice';

import {
    HOMEPAGE,
    DOWNLOAD,
    LOADING_DATA,
    LOADING_FILE,
    PAGE_NOT_FOUND,
    isViewerStatus,
} from './statuses';

const Homepage = React.lazy(() => import('./Homepage'));
const Download = React.lazy(() => import('./Download'));
const SparkViewer = React.lazy(() => import('./SparkViewer'));

/**
 * Gets the payload code from the URL.
 * @returns the code, or undefined
 */
function getUrlCode() {
    const path = window.location.pathname;
    const hash = window.location.hash;

    let code;
    if (path === '/' && /^#[a-zA-Z0-9]+$/.test(hash)) {
        code = hash.substring(1);
        // change URL to remove the hash
        history.replace({
            pathname: code,
            hash: '',
        });
    } else if (/^\/[a-zA-Z0-9]+$/.test(path)) {
        code = path.substring(1);
    }
    return code;
}

export default function SparkRoot() {
    // the data code from the URL path
    const [code] = useState(getUrlCode);
    // the 'selected' file
    const [selectedFile, setSelectedFile] = useState();

    // the status of this component
    const [status, setStatus] = useState(() => {
        if (code && code === 'download') {
            return DOWNLOAD;
        } else if (code) {
            return LOADING_DATA;
        } else if (window.location.pathname === '/') {
            return HOMEPAGE;
        } else {
            return PAGE_NOT_FOUND;
        }
    });

    const onFileSelected = file => {
        setSelectedFile(file);
        setStatus(LOADING_FILE);
    };

    if (isViewerStatus(status)) {
        return (
            <Suspense
                fallback={
                    <Page>
                        <BannerNotice>Loading...</BannerNotice>
                    </Page>
                }
            >
                <SparkViewer
                    status={status}
                    setStatus={setStatus}
                    code={code}
                    selectedFile={selectedFile}
                />
            </Suspense>
        );
    }

    let contents;
    switch (status) {
        case HOMEPAGE:
            contents = (
                <Suspense fallback={<BannerNotice>Loading...</BannerNotice>}>
                    <Homepage onFileSelected={onFileSelected} />
                </Suspense>
            );
            break;
        case DOWNLOAD:
            contents = (
                <Suspense fallback={<BannerNotice>Loading...</BannerNotice>}>
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

    return <Page>{contents}</Page>;
}

function Page({ children }) {
    return (
        <>
            <Header />
            <main>{children}</main>
            <Footer />
        </>
    );
}
