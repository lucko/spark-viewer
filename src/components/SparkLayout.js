import Footer from './Footer';
import Header from './Header';

export default function SparkLayout({ children, header = <Header /> }) {
    return (
        <>
            {header}
            <main>{children}</main>
            <Footer />
        </>
    );
}
