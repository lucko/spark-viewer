import { HeaderProps } from './types';

export default function AllViewHeader({ children }: HeaderProps) {
    return (
        <div className="header">
            <h2>All View</h2>
            <p>
                This is the default profiler view. It shows the entire profile
                as an expandable tree.
            </p>
            {children}
        </div>
    );
}
