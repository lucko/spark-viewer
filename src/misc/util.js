export function humanFriendlyPercentage(percentage) {
    return (percentage * 100).toFixed(2) + '%';
}

export function formatTime(time, n = 2) {
    return parseFloat(time.toFixed(n));
}

export function formatBytes(bytes) {
    if (bytes === 0) {
        return '0 bytes';
    }
    const sizes = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const sizeIndex = Math.floor(Math.log(bytes) / Math.log(1024));
    return (
        parseFloat((bytes / Math.pow(1024, sizeIndex)).toFixed(1)) +
        ' ' +
        sizes[sizeIndex]
    );
}

export function formatDuration(duration) {
    const seconds = Math.abs(Math.ceil(duration / 1000));
    const h = (seconds - (seconds % 3600)) / 3600;
    const m = ((seconds - (seconds % 60)) / 60) % 60;
    const s = seconds % 60;

    let str = [];
    if (h) str.push(h + 'h');
    if (m) str.push(m + 'm');
    if (s) str.push(s + 's');

    return str.join(' ');
}
