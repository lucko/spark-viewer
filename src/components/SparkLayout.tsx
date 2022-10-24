import { ReactNode } from 'react';
import Footer from './Footer';
import Header from './Header';

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
            {header}
            <main>{children}</main>
            <Footer />
        </>
    );
}
