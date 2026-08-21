import { faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { HeaderProps } from './types';

export default function FlatViewHeader({ children }: HeaderProps) {
    return (
        <div className="header">
            <h2>
                <FontAwesomeIcon icon={faEye} /> Profiler - Flat View
            </h2>
            <p>
                This view shows a flattened representation of the profile, where
                the top 250 method calls are listed.
            </p>
            {children}
        </div>
    );
}
