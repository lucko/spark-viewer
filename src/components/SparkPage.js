import Footer from './Footer';
import Header from './Header';

export default function SparkPage({ children, header = <Header /> }) {
    return (
        <>
            {header}
            <main>{children}</main>
            <Footer />
        </>
    );
}
