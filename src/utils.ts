export const callIfFunction = (callback: Function) => {
    if (typeof callback === 'function') return callback
}

export const isObject = (obj: any) => obj !== null && typeof obj === 'object'
