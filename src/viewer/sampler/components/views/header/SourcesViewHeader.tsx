import { useContext } from 'react';
import { MetadataContext } from '../../SamplerContext';
import { HeaderProps } from './types';

export default function SourcesViewHeader({ children }: HeaderProps) {
    const metadata = useContext(MetadataContext)!;
    const sourceNoun = ['Fabric', 'Forge', 'NeoForge'].includes(
        metadata.platform?.name!
    )
        ? { singular: 'mod', plural: 'Mods' }
        : { singular: 'plugin', plural: 'Plugins' };

    return (
        <div className="header">
            <h2>{sourceNoun.plural} View</h2>
            <p>
                This view shows a filtered representation of the profile broken
                down by {sourceNoun.singular}.
            </p>
            {children}
        </div>
    );
}
