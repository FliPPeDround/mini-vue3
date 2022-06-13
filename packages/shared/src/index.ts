export const isObject = (val: any) => val !== null && typeof val === 'object'
export const isString = (val: any) => typeof val === 'string'
export const isFunction = (val: any) => typeof val === 'function'
export const isNumber = (val: any) => typeof val === 'number'

export const isArray = Array.isArray
export const assign = Object.assign
