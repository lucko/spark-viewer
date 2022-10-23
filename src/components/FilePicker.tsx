import classNames from 'classnames';
import { useDropzone } from 'react-dropzone';

import styles from '../style/homepage.module.scss';

export interface FilePickerProps {
    callback: (file: File) => void;
}

export default function FilePicker({ callback }: FilePickerProps) {
    const { getRootProps, getInputProps } = useDropzone({
        accept: { '': ['.sparkprofile', '.sparkheap'] },
        multiple: false,
        onDropAccepted: files => {
            callback(files[0]);
        },
    });

    return (
        <div
            {...getRootProps({
                className: classNames('textbox', styles['file-picker']),
            })}
        >
            <input {...getInputProps()} />
            <p>Drag &amp; drop a profile/heap file here or click to select</p>
            <em>
                (only <code>.sparkprofile</code> or <code>.sparkheap</code>{' '}
                files are accepted)
            </em>
        </div>
    );
}
