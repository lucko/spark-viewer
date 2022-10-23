import { Dispatch, SetStateAction, useContext } from 'react';
import { ExtendedThreadNode } from '../../../proto/nodes';
import { LabelModeContext } from '../SamplerContext';
import BaseNode from '../tree/BaseNode';
import LabelModeButton from './button/LabelModeButton';
import AllViewHeader from './header/AllViewHeader';

export interface AllViewProps {
    threads: ExtendedThreadNode[];
    setLabelMode: Dispatch<SetStateAction<boolean>>;
}

// The sampler view in which all data is shown in one, single stack.
export default function AllView({ threads, setLabelMode }: AllViewProps) {
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
                <LabelModeContext.Provider value={labelMode}>
                    {threads.map(thread => (
                        <BaseNode
                            parents={[]}
                            node={thread}
                            key={thread.name}
                        />
                    ))}
                </LabelModeContext.Provider>
            </div>
        </div>
    );
}
