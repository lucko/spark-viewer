import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import TextBox from '../components/TextBox';
import { fetchFromRemote } from '../viewer/common/logic/fetch';
import { parse } from '../viewer/common/logic/parse';
import {
    FAILED_DATA,
    LOADED_HEALTH_DATA,
    LOADED_HEAP_DATA,
    LOADED_PROFILE_DATA,
    LOADING_DATA,
} from '../viewer/common/logic/status';
import { NextPageWithLayout } from './_app';

const RemoteViewer: NextPageWithLayout = () => {
    const router = useRouter();
    const [status, setStatus] = useState(LOADING_DATA);

    useEffect(() => {
        const downloadPath = router.query.path as string;
        if (!downloadPath) return;

        (async () => {
            try {
                // Load remote file
                const result = await fetchFromRemote(downloadPath);
                const [data, newStatus] = parse(result.type, result.buf);

                // Generate a pseudo-code for the URL and redirect to the normal viewer
                const pseudoCode = `remote_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                
                // Store the data in sessionStorage temporarily
                const sessionData = {
                    data: Array.from(new Uint8Array(result.buf)),
                    type: result.type,
                    metadata: data.metadata,
                };
                sessionStorage.setItem(`remote_${pseudoCode}`, JSON.stringify(sessionData));
                
                // Redirect to the normal viewer with the pseudo-code
                router.replace(`/${pseudoCode}?remote=true`);
            } catch (error) {
                console.error('Failed to load remote file:', error);
                setStatus(FAILED_DATA);
            }
        })();
    }, [router.query.path, router]);

    if (status === LOADING_DATA) {
        return <TextBox>正在加载远程报告...</TextBox>;
    }

    if (status === FAILED_DATA) {
        return (
            <TextBox extraClassName="loading-error">
                无法加载远程报告。请检查网络连接或联系管理员。
            </TextBox>
        );
    }

    return null;
};

export default RemoteViewer;