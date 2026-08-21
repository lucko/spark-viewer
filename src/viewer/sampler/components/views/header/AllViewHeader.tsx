import { faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { HeaderProps } from './types';

export default function AllViewHeader({ children }: HeaderProps) {
    return (
        <div className="header">
            <h2>
                <FontAwesomeIcon icon={faEye} /> Profiler - All View
            </h2>
            <p>
                This is the default profiler view. It shows the entire profile
                as an expandable tree.
            </p>
            {children}
        </div>
    );
}
