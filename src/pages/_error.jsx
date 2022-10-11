import TextBox from '../components/TextBox';

function Error({ statusCode }) {
    return (
        <TextBox>
            {statusCode
                ? `Error ${statusCode}`
                : 'Uh oh. An unexpected error occurred with spark-viewer.'}
        </TextBox>
    );
}

Error.getInitialProps = ({ res, err }) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
    return { statusCode };
};

export default Error;
