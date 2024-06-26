import { faSliders } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TextBox from '../../../../components/TextBox';

import { ReactNode } from 'react';
import styles from '../../../../style/sampler.module.scss';
import Switch from '../../../common/components/Switch';
import { MappingsMetadata } from '../../mappings/fetch';
import MappingsSelector from './MappingsSelector';

export interface SettingsMenuProps {
    mappingsMetadata?: MappingsMetadata;
    mappings: string;
    setMappings: (type: string) => void;
    infoPoints: boolean;
    toggleInfoPoints: () => void;
}

export default function SettingsMenu({
    mappingsMetadata,
    mappings,
    setMappings,
    infoPoints,
    toggleInfoPoints,
}: SettingsMenuProps) {
    return (
        <TextBox extraClassName={styles['settings-menu']}>
            {mappingsMetadata && (
                <Setting
                    name="Mappings"
                    desc="Select which deobfuscation mappings the viewer should
                        use when displaying profiler frames."
                >
                    <MappingsSelector
                        mappingsMetadata={mappingsMetadata}
                        mappings={mappings}
                        setMappings={setMappings}
                    />
                </Setting>
            )}
            <Setting
                name="Info Points"
                desc="Select whether info points should be shown."
            >
                <Switch value={infoPoints} toggle={toggleInfoPoints} />
            </Setting>
        </TextBox>
    );
}

interface SettingProps {
    name: string;
    desc: string;
    children: ReactNode;
}

const Setting = ({ name, desc, children }: SettingProps) => {
    return (
        <div className="setting">
            <div className="setting-control">
                <FontAwesomeIcon icon={faSliders} /> <span>{name}:</span>{' '}
                {children}
            </div>
            <p>{desc}</p>
        </div>
    );
};
