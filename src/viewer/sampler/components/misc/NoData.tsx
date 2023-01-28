import { faWarning } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TextBox from '../../../../components/TextBox';

import styles from '../../../../style/sampler.module.scss';

export interface NoDataProps {
    isConnectedToSocket: boolean;
}

export default function NoData({ isConnectedToSocket }: NoDataProps) {
    return (
        <TextBox extraClassName={styles['no-data']}>
            <h2>
                <FontAwesomeIcon icon={faWarning} /> <b>No Data</b>
            </h2>
            {isConnectedToSocket ? (
                <p>
                    This profile doesn&apos;t contain any data yet! The viewer
                    will refresh shortly.
                </p>
            ) : (
                <p>This profile doesn&apos;t contain any data!</p>
            )}
        </TextBox>
    );
}
