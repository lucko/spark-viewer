import { faFileExport } from '@fortawesome/free-solid-svg-icons';
import FaButton from '../../../../components/FaButton';
import { ExportCallback } from '../../logic/export';

export interface ExportButtonProps {
    exportCallback: ExportCallback;
}

export default function ExportButton({ exportCallback }: ExportButtonProps) {
    if (!exportCallback) {
        return null;
    }
    return (
        <FaButton
            icon={faFileExport}
            onClick={exportCallback}
            title="Export this profile to a local file"
        />
    );
}
