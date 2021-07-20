
export function trimString  (string, length, toReplace = '') {
    return string?.length > length ? string?.substring(0, length) + toReplace : string;
};