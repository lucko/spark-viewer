import { NextPage } from 'next';
import TextBox from '../components/TextBox';

interface ErrorPageProps {
    statusCode?: number;
}

const Error: NextPage<ErrorPageProps> = ({ statusCode }) => {
    return (
        <TextBox>
            {statusCode
                ? `Server error ${statusCode}`
                : 'Uh oh. An unexpected error occurred with spark-viewer client.'}
        </TextBox>
    );
};

Error.getInitialProps = ({ res, err }) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
    return { statusCode };
};

export default Error;
