export interface Debounce {
    start: Function;
    cancel: Function;
}

export function debounce(f: () => void, wait: number): Debounce {
    let timerId: number = null;
    const cancel: Function = () => {
        if (timerId) {
            clearTimeout(timerId);
            timerId = null;
        }
    }
    const start: Function = () => {
        const onComplete = () => {
            f();
            timerId = null;
        }
        cancel();
        timerId = window.setTimeout(onComplete, wait);
    }
    return { start, cancel };
}