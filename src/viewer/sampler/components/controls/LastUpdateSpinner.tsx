import classNames from 'classnames';
import { Dispatch, MouseEvent, SetStateAction } from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { SocketBinding } from '../../hooks/useSocketBindings';

export interface LastUpdateSpinnerProps {
    socket: SocketBinding;
    showSocketInfo: boolean;
    setShowSocketInfo: Dispatch<SetStateAction<boolean>>;
}

export default function LastUpdateSpinner({
    socket,
    showSocketInfo,
    setShowSocketInfo,
}: LastUpdateSpinnerProps) {
    if (!socket.socket.socket) {
        return null;
    }

    function onClick(e: MouseEvent<HTMLDivElement>) {
        setShowSocketInfo(state => !state);
    }

    return (
        <>
            <div
                className={classNames('last-update-spinner button textbox', {
                    toggled: showSocketInfo,
                })}
                onClick={onClick}
            >
                <CountdownCircleTimer
                    key={socket.lastSamplerUpdate}
                    isPlaying
                    size={26}
                    strokeWidth={4}
                    duration={socket.socket.settings?.samplerInterval ?? 60}
                    colors={'var(--text-secondary)' as any}
                    trailColor={'var(--border-light)' as any}
                >
                    {() => {
                        return (
                            <CountdownCircleTimer
                                key={socket.lastStatsUpdate}
                                isPlaying
                                size={16}
                                strokeWidth={4}
                                duration={
                                    socket.socket.settings
                                        ?.statisticsInterval ?? 10
                                }
                                colors={'var(--text-secondary)' as any}
                                trailColor={'var(--border-light)' as any}
                            />
                        );
                    }}
                </CountdownCircleTimer>
            </div>
        </>
    );
}
