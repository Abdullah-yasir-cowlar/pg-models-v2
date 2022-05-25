const pgClient = {
    query: function (query, values) {
        const placeholders = query.match(/\$/g)
        if (values && (values.length !== placeholders.length)) {
            console.log('query requires %s but recieved %s', placeholders.length, values.length)
        }
        return new Promise((resolve) => {
            resolve({ rows: values })
        })
    }
}

module.exports = { pgClient }