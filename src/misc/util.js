export function humanFriendlyPercentage(percentage) {
    return (percentage * 100).toFixed(2) + '%';
}

export function formatTime(time, n = 2) {
    return parseFloat(time.toFixed(n));
}
