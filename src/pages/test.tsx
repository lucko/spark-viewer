import { useEffect, useState } from 'react';
import Header from '../components/Header';

export default function TestPage() {
    const [apiStatus, setApiStatus] = useState<string>('检查中...');

    useEffect(() => {
        const testApi = async () => {
            try {
                const response = await fetch('https://as-spark-monitor.arminosi.workers.dev/list');
                if (response.ok) {
                    const data = await response.json();
                    setApiStatus(`API 正常，获取到 ${data.value?.length || 0} 个报告`);
                } else {
                    setApiStatus(`API 错误: ${response.status}`);
                }
            } catch (error) {
                setApiStatus(`API 连接失败: ${error}`);
            }
        };
        testApi();
    }, []);

    return (
        <div>
            <Header />
            <div style={{ padding: '20px' }}>
                <h1>测试页面</h1>
                <p>这是一个测试页面，用于检查 Header 中的远程报告选择器是否正常工作。</p>
                <p>请查看页面顶部的 Header，应该能看到一个下拉菜单用于选择历史报告。</p>
                <p><strong>API 状态:</strong> {apiStatus}</p>
            </div>
        </div>
    );
}