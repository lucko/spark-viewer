import classNames from 'classnames';

export default function TextBox({ children, extraClassName }) {
    const className = classNames('textbox', extraClassName);
    return <div className={className}>{children}</div>;
}
