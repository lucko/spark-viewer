import { useEffect, useState } from 'react';
import { env } from '../env';

export interface RemoteReport {
    key: string;
    name: string;
    size: number;
    sizeMB: string; // This comes as "0.60 MB" format
    uploaded: string; // ISO date string
    downloadPath: string;
}

export enum RemoteReportsStatus {
    IDLE = 'idle',
    LOADING = 'loading',
    SUCCESS = 'success',
    ERROR = 'error',
}

export default function useRemoteReports() {
    const [reports, setReports] = useState<RemoteReport[]>([]);
    const [status, setStatus] = useState<RemoteReportsStatus>(RemoteReportsStatus.IDLE);

    const loadReports = async () => {
        setStatus(RemoteReportsStatus.LOADING);
        try {
            const response = await fetch(`${env.NEXT_PUBLIC_SPARK_MONITOR_URL}/list`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const responseData = await response.json();
            // Check if response has 'value' property (array) or is directly an array
            const data: RemoteReport[] = responseData.value || responseData;
            setReports(data);
            setStatus(RemoteReportsStatus.SUCCESS);
        } catch (error) {
            console.error('Failed to load remote reports:', error);
            setReports([]);
            setStatus(RemoteReportsStatus.ERROR);
        }
    };

    // Auto-load reports on mount
    useEffect(() => {
        loadReports();
    }, []);

    return {
        reports,
        status,
        loadReports,
        isLoading: status === RemoteReportsStatus.LOADING,
        isError: status === RemoteReportsStatus.ERROR,
    };
}