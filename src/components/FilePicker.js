import { useDropzone } from 'react-dropzone';

export default function FilePicker({ callback }) {
    const { getRootProps, getInputProps } = useDropzone({
        accept: { '': ['.sparkprofile', '.sparkheap'] },
        multiple: false,
        onDropAccepted: files => {
            callback(files[0]);
        },
    });

    return (
        <div {...getRootProps({ className: 'text-box file-picker' })}>
            <input {...getInputProps()} />
            <p>Drag &amp; drop a profile/heap file here or click to select</p>
            <em>
                (only <code>.sparkprofile</code> or <code>.sparkheap</code>{' '}
                files are accepted)
            </em>
        </div>
    );
}
