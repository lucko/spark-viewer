import { HeaderProps } from './types';

export default function FlatViewHeader({ children }: HeaderProps) {
    return (
        <div className="header">
            <h2>Flat View</h2>
            <p>
                This view shows a flattened representation of the profile, where
                the top 250 method calls are listed.
            </p>
            {children}
        </div>
    );
}
