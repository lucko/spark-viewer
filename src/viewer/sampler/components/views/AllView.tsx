import { Dispatch, SetStateAction, useContext } from 'react';
import BasicVirtualNode from '../../node/BasicVirtualNode';
import SamplerData from '../../SamplerData';
import { LabelModeContext } from '../SamplerContext';
import BaseNode from '../tree/BaseNode';
import LabelModeButton from './button/LabelModeButton';
import AllViewHeader from './header/AllViewHeader';

export interface AllViewProps {
    data: SamplerData;
    setLabelMode: Dispatch<SetStateAction<boolean>>;
}

// The sampler view in which all data is shown in one, single stack.
export default function AllView({ data, setLabelMode }: AllViewProps) {
    const labelMode = useContext(LabelModeContext);

    return (
        <div className="allview">
            <AllViewHeader>
                <LabelModeButton
                    labelMode={labelMode}
                    setLabelMode={setLabelMode}
                />
            </AllViewHeader>
            <hr />
            <div className="stack">
                {data.threads.map(thread => (
                    <BaseNode
                        parents={[]}
                        node={new BasicVirtualNode(data, thread)}
                        key={thread.name}
                    />
                ))}
            </div>
        </div>
    );
}
