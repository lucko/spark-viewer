export const LOADING_DATA: Status = 'loading-data';
export const FAILED_DATA: Status = 'failed-data';
export const LOADED_PROFILE_DATA: Status = 'loaded-profile-data';
export const LOADED_HEAP_DATA: Status = 'loaded-heap-data';
export const LOADED_HEALTH_DATA: Status = 'loaded-health-data';

export type Status =
    | 'loading-data'
    | 'failed-data'
    | 'loaded-profile-data'
    | 'loaded-heap-data'
    | 'loaded-health-data';
