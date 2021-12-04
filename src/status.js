export const HOMEPAGE = Symbol();
export const DOWNLOAD = Symbol();
export const PAGE_NOT_FOUND = Symbol();

export const LOADING_DATA = Symbol();
export const LOADING_FILE = Symbol();
export const FAILED_DATA = Symbol();
export const LOADED_PROFILE_DATA = Symbol();
export const LOADED_HEAP_DATA = Symbol();

export function isViewerStatus(status) {
    return (
        status === LOADING_DATA ||
        status === LOADING_FILE ||
        status === FAILED_DATA ||
        status === LOADED_PROFILE_DATA ||
        status === LOADED_HEAP_DATA
    );
}
