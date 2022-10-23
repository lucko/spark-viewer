import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import TextBox from '../../../components/TextBox';

import styles from '../../../style/sampler.module.scss';

export default function VersionWarning() {
    const [show, setShow] = useState(true);

    if (!show) {
        return null;
    }

    function onClick() {
        setShow(false);
    }

    const warning = (
        <span role="img" aria-label="warning">
            ⚠️
        </span>
    );
    return (
        <TextBox extraClassName={styles['version-warning']}>
            {warning}
            <b> This profile was created using an old version of spark! </b>
            {warning}
            <FontAwesomeIcon icon={faTimes} onClick={onClick} />
            <br />
            Some viewer features cannot be supported. Please consider updating
            to a newer version.
        </TextBox>
    );
}
