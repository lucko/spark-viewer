import { ReactNode } from 'react';
import Footer from './Footer';
import Header from './Header';
import CosmicBackground from './CosmicBackground';

export interface SparkLayoutProps {
    children: ReactNode;
    header?: ReactNode;
}

export default function SparkLayout({
    children,
    header = <Header />,
}: SparkLayoutProps) {
    return (
        <>
            <CosmicBackground />
            {header}
            <main>{children}</main>
            <Footer />
        </>
    );
}
