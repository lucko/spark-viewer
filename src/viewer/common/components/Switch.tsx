import styles from '../../../style/switch.module.scss';

export interface SwitchProps {
    value: boolean;
    toggle: () => void;
}

export default function Switch({ value, toggle }: SwitchProps) {
    return (
        <label className={styles.switch}>
            <input type="checkbox" checked={value} onChange={() => toggle()} />
            <span className={styles.slider}></span>
        </label>
    );
}
