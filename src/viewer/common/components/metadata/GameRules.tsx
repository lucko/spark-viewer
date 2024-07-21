import { useState } from 'react';
import { WorldStatistics_GameRule } from '../../../proto/spark_pb';

export interface GameRulesProps {
    gameRules: WorldStatistics_GameRule[];
}

export default function GameRules({ gameRules }: GameRulesProps) {
    const setRules = gameRules.filter(
        gameRule => !gameRuleIsDefaultInAllWorlds(gameRule)
    );

    const [showDefaults, setShowDefaults] = useState<boolean>(false);

    return (
        <div className="gamerules">
            {setRules.length === 0 && (
                <>
                    <p>All game rules are set to default values.</p>
                </>
            )}
            {setRules.length > 0 && (
                <>
                    <h2>Game Rule Overrides</h2>
                    <span>
                        (Values are only shown below when they differ from the
                        default)
                    </span>
                    <ul>
                        {setRules.map(gameRule => (
                            <li key={gameRule.name}>
                                {gameRule.name} (default:{' '}
                                <GameRuleValue value={gameRule.defaultValue} />)
                                <ul>
                                    {Object.entries(gameRule.worldValues)
                                        .filter(
                                            ([_, value]) =>
                                                value !== gameRule.defaultValue
                                        )
                                        .map(([worldName, value]) => (
                                            <li key={worldName}>
                                                {worldName}:{' '}
                                                <GameRuleValue value={value} />
                                            </li>
                                        ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </>
            )}

            <button onClick={() => setShowDefaults(value => !value)}>
                {showDefaults ? 'Hide' : 'Show'} default values
            </button>

            {showDefaults && (
                <>
                    <h2>Game Rule Defaults</h2>
                    <span>(The default values for each game rule)</span>
                    <ul>
                        {gameRules.map(gameRule => (
                            <li key={gameRule.name}>
                                {gameRule.name}:{' '}
                                <GameRuleValue value={gameRule.defaultValue} />
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}

const GameRuleValue = ({ value }: { value: string }) => {
    if (value === 'true' || value === 'false') {
        return <span className={`value-${value}`}>{value}</span>;
    }
    if (/^-?\d+$/.test(value)) {
        return <span className="value-number">{value}</span>;
    } else {
        return <span className="value-string">{value}</span>;
    }
};

const gameRuleIsDefaultInAllWorlds = (gameRule: WorldStatistics_GameRule) => {
    const worldValuesSet = Array.from(
        new Set(Object.values(gameRule.worldValues))
    );
    return (
        worldValuesSet.length === 1 &&
        worldValuesSet[0] === gameRule.defaultValue
    );
};
