import React, { Suspense, useState } from 'react';
import {
    DOWNLOAD,
    HOMEPAGE,
    isViewerStatus,
    LOADING_DATA,
    LOADING_FILE,
    PAGE_NOT_FOUND,
} from './status';

import history from 'history/browser';
import SparkPage from './components/SparkPage';
import TextBox from './components/TextBox';
import SparkRouter from './SparkRouter';

const SparkViewer = React.lazy(() => import('./SparkViewer'));

export default function SparkRoot() {
    // the data code from the URL path
    const [code] = useState(getUrlCode);
    // the 'selected' file
    const [selectedFile, setSelectedFile] = useState();

    // the status of the application
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
                    <SparkPage>
                        <TextBox>Loading...</TextBox>
                    </SparkPage>
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
    } else {
        return <SparkRouter status={status} onFileSelected={onFileSelected} />;
    }
}

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
