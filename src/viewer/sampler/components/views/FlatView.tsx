import {
    createContext,
    Dispatch,
    SetStateAction,
    useContext,
    useState,
} from 'react';
import TextBox from '../../../../components/TextBox';
import { ExtendedThreadNode } from '../../../proto/nodes';
import { LabelModeContext } from '../SamplerContext';
import BaseNode from '../tree/BaseNode';
import BottomUpButton from './button/BottomUpButton';
import LabelModeButton from './button/LabelModeButton';
import SelfTimeModeButton from './button/SelfTimeModeButton';
import FlatViewHeader from './header/FlatViewHeader';

export const BottomUpContext = createContext(false);

export interface FlatViewProps {
    dataSelfTime?: ExtendedThreadNode[];
    dataTotalTime?: ExtendedThreadNode[];
    setLabelMode: Dispatch<SetStateAction<boolean>>;
}

// The sampler view in which the stack is flattened to the top x nodes
// according to total time or self time.
export default function FlatView({
    dataSelfTime,
    dataTotalTime,
    setLabelMode,
}: FlatViewProps) {
    const labelMode = useContext(LabelModeContext);
    const [bottomUp, setBottomUp] = useState(false);
    const [selfTimeMode, setSelfTimeMode] = useState(false);
    const data = selfTimeMode ? dataSelfTime : dataTotalTime;

    return (
        <div className="flatview">
            <FlatViewHeader>
                <LabelModeButton
                    labelMode={labelMode}
                    setLabelMode={setLabelMode}
                />
                <BottomUpButton bottomUp={bottomUp} setBottomUp={setBottomUp} />
                <SelfTimeModeButton
                    selfTimeMode={selfTimeMode}
                    setSelfTimeMode={setSelfTimeMode}
                />
            </FlatViewHeader>
            <hr />
            {!data ? (
                <TextBox>Loading...</TextBox>
            ) : (
                <div className="stack">
                    <LabelModeContext.Provider value={labelMode}>
                        <BottomUpContext.Provider value={bottomUp}>
                            {data.map(thread => (
                                <BaseNode
                                    parents={[]}
                                    node={thread}
                                    key={thread.name}
                                />
                            ))}
                        </BottomUpContext.Provider>
                    </LabelModeContext.Provider>
                </div>
            )}
        </div>
    );
}
