import { HeaderProps } from './types';

export default function FlatViewHeader({ children }: HeaderProps) {
    return (
        <div className="header">
            <h2>Flat View</h2>
            <p>
                This view shows a flattened representation of the profile, where
                the slowest 250 method calls are listed at the top level.
            </p>
            {children}
        </div>
    );
}
