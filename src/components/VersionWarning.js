import { useState } from 'react';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TextBox from './TextBox';

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
        <TextBox extraClassName="version-warning">
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
