import { faEye } from '@fortawesome/free-solid-svg-icons';
import { Dispatch, SetStateAction } from 'react';
import FaButton from '../../../../components/FaButton';
import { SamplerData } from '../../../proto/spark_pb';
import { View, VIEW_ALL, VIEW_FLAT, VIEW_SOURCES } from '../views/types';

export interface ToggleViewButtonProps {
    data: SamplerData;
    view: View;
    setView: Dispatch<SetStateAction<View>>;
}

export default function ToggleViewButton({
    data,
    view,
    setView,
}: ToggleViewButtonProps) {
    const sourcesViewSupported =
        Object.keys(data.classSources).length ||
        Object.keys(data.methodSources).length ||
        Object.keys(data.lineSources).length;

    const supportedViews: View[] = [
        VIEW_ALL,
        VIEW_FLAT,
        ...(sourcesViewSupported ? [VIEW_SOURCES] : []),
    ];

    return (
        <>
            {supportedViews.map(v => {
                function onClick() {
                    setView(v);
                }

                let label;
                if (v === VIEW_ALL) {
                    label = 'all';
                } else if (v === VIEW_FLAT) {
                    label = 'flat';
                } else {
                    label = ['Fabric', 'Forge'].includes(
                        data?.metadata?.platform?.name || ''
                    )
                        ? 'mods'
                        : 'plugins';
                }

                return (
                    <FaButton
                        key={label}
                        icon={faEye}
                        onClick={onClick}
                        title="Toggle the view"
                        extraClassName={
                            view === v
                                ? 'sources-view-button toggled'
                                : 'sources-view-button'
                        }
                    >
                        <span>{label}</span>
                    </FaButton>
                );
            })}
        </>
    );
}
