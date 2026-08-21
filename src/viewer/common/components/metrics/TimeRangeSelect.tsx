export interface TimeRangeSelectProps {
    value: number;
    onChange: (value: number) => void;
}

export default function TimeRangeSelect({
    value,
    onChange,
}: TimeRangeSelectProps) {
    return (
        <select
            className="range-selector"
            value={value}
            onChange={e => onChange(Number(e.target.value))}
        >
            <option value="5">Last 5 minutes</option>
            <option value="15">Last 15 minutes</option>
            <option value="30">Last 30 minutes</option>
            <option value="60">Last 1 hour</option>
        </select>
    );
}
