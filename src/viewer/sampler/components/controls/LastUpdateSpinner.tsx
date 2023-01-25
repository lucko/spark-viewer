import classNames from 'classnames';
import { Dispatch, MouseEvent, SetStateAction } from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { SocketBinding } from '../../hooks/useSocketBindings';

export interface LastUpdateSpinnerProps {
    showSocketInfo: boolean;
    setShowSocketInfo: Dispatch<SetStateAction<boolean>>;
    socketBinding?: SocketBinding;
}

export default function LastUpdateSpinner({
    showSocketInfo,
    setShowSocketInfo,
    socketBinding,
}: LastUpdateSpinnerProps) {
    if (!socketBinding) {
        return null;
    }

    function onClick(e: MouseEvent<HTMLDivElement>) {
        setShowSocketInfo(state => !state);
    }

    return (
        <>
            <div
                className={classNames('button textbox', {
                    toggled: showSocketInfo,
                })}
                onClick={onClick}
            >
                <CountdownCircleTimer
                    key={socketBinding.lastStatsUpdate}
                    isPlaying
                    size={20}
                    strokeWidth={4}
                    duration={10}
                    colors={'#b5b5b5'}
                    trailColor={'#3c3f41'}
                />
            </div>
        </>
    );
}
