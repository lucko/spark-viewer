import { faCloud } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TextBox from '../../../components/TextBox';

import styles from '../../../style/sampler.module.scss';

export interface SocketInfoProps {
    socketLatency?: number;
}

export default function SocketInfo({ socketLatency }: SocketInfoProps) {
    return (
        <TextBox extraClassName={styles['socket-info']}>
            <h2>
                <FontAwesomeIcon icon={faCloud} color="#89d753" />{' '}
                <b>Connected</b> via WebSocket
            </h2>
            <p>
                spark viewer is connected to the spark profiler using a socket
                connection. <br />
                The statistics will update every 10 seconds, and the profiler
                data will update every minute.
            </p>
            <p>
                <b>Latency</b>: {socketLatency ?? '?'}ms
            </p>
        </TextBox>
    );
}
