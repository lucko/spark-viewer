import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { SparkContentType } from '../viewer/common/logic/contentType';
import { fetchFromBytebin } from '../viewer/common/logic/fetch';
import {
    HealthDataLite,
    HeapDataLite,
    SamplerDataLite,
} from '../viewer/proto/spark_pb';
import { NextPageWithLayout } from './_app';

const Thumbnail = dynamic(
    () => import('../viewer/common/components/Thumbnail'),
    {
        suspense: true,
    }
);

const RenderThumbnail: NextPageWithLayout = () => {
    const router = useRouter();

    const code = useMemo(() => {
        return router.query['code'] as string;
    }, [router]);

    const [data, setData] = useState<
        SamplerDataLite | HeapDataLite | HealthDataLite
    >();
    const [type, setType] = useState<SparkContentType>();
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        if (!code) return;
        (async () => {
            try {
                const result = await fetchFromBytebin(code, router, true);
                const data = parse(result.type, result.buf);
                setData(data);
                setType(result.type);
            } catch (e) {
                console.log(e);
                setError(true);
            }
        })();
    }, [code, router]);

    if (error) {
        return <p className="loading-error">:(</p>;
    }

    if (data && type) {
        return (
            <Suspense fallback={null}>
                <Thumbnail code={code} metadata={data.metadata!} type={type} />
            </Suspense>
        );
    }

    return <p>loading</p>;
};

export function parse(
    type: SparkContentType,
    buf: ArrayBuffer
): SamplerDataLite | HeapDataLite | HealthDataLite {
    if (type === 'application/x-spark-sampler') {
        return SamplerDataLite.fromBinary(new Uint8Array(buf));
    } else if (type === 'application/x-spark-heap') {
        return HeapDataLite.fromBinary(new Uint8Array(buf));
    } else if (type === 'application/x-spark-health') {
        return HealthDataLite.fromBinary(new Uint8Array(buf));
    } else {
        throw new Error('Unknown content type: ' + type);
    }
}

// Don't use app-level layout
RenderThumbnail.getLayout = page => page;
export default RenderThumbnail;
