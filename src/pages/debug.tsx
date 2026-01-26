import { useEffect, useState } from 'react';

export default function DebugPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const testAPI = async () => {
            try {
                console.log('开始获取远程报告...');
                const response = await fetch('https://as-spark-monitor.arminosi.workers.dev/list');
                console.log('Response status:', response.status);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const responseData = await response.json();
                console.log('Response data:', responseData);
                
                // Check if response has 'value' property (array) or is directly an array
                const reports = responseData.value || responseData;
                console.log('Processed reports:', reports);
                
                setData(reports);
                setLoading(false);
            } catch (error) {
                console.error('API 调用失败:', error);
                setError(error instanceof Error ? error.message : 'Unknown error');
                setLoading(false);
            }
        };

        testAPI();
    }, []);

    return (
        <div style={{ padding: '20px', fontFamily: 'monospace' }}>
            <h1>API 调试页面</h1>
            
            {loading && <p>加载中...</p>}
            
            {error && (
                <div style={{ color: 'red' }}>
                    <h3>错误:</h3>
                    <p>{error}</p>
                </div>
            )}
            
            {data && (
                <div>
                    <h3>获取到的数据:</h3>
                    <pre>{JSON.stringify(data, null, 2)}</pre>
                    
                    <h3>报告列表:</h3>
                    {Array.isArray(data) ? (
                        <ul>
                            {data.map((report: any, index: number) => (
                                <li key={index}>
                                    <strong>{new Date(report.uploaded).toLocaleString('zh-CN')}</strong> 
                                    - {report.sizeMB} 
                                    - <code>{report.downloadPath}</code>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>数据不是数组格式</p>
                    )}
                </div>
            )}
        </div>
    );
}