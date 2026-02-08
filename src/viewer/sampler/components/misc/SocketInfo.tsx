import { faCloud } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TextBox from '../../../../components/TextBox';

import styles from '../../../../style/sampler.module.scss';
import { SocketBinding } from '../../hooks/useSocketBindings';

export interface SocketInfoProps {
    socket: SocketBinding;
}

export default function SocketInfo({ socket }: SocketInfoProps) {
    const { clientId, settings, latency } = socket.socket;

    return (
        <TextBox extraClassName={styles['socket-info']}>
            <h2>
                <FontAwesomeIcon icon={faCloud} />{' '}
                <b>Connected</b> via WebSocket
            </h2>
            <p>
                spark viewer is connected to the spark profiler using a socket
                connection. <br />
                The statistics will update every{' '}
                {settings?.statisticsInterval ?? '?'} seconds, and the profiler
                data will update every minute.
            </p>
            <p>
                <b>Latency</b>: {latency ?? '?'}ms
                <br />
                <b>Client ID</b>: {clientId}
            </p>
        </TextBox>
    );
}
