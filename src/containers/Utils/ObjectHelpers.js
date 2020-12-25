import _ from 'lodash'

export function convertObjectkeyToCamelCase(obj) {
return Object.keys(obj).reduce((c, k) => (c[_.camelCase(k)] = obj[k], c), {});
}

export function convertObjectkeyToLowerCase(obj) {
    return Object.keys(obj).reduce((c, k) => (c[_.toLowerCase(k)] = obj[k], c), {});
    }