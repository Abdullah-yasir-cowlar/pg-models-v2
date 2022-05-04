module.exports.callIfFunction = (callback: Function) => {
    if (typeof callback === 'function') return callback
}

module.exports.isObject = (obj: any) => obj !== null && typeof obj === 'object'
