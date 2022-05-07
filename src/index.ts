module.exports = require('./classes/Model.class')

exports = module.exports

exports.Column = require('./classes/Column.class')
exports.Query = require('./classes/Query.class')
exports.Table = require('./classes/Table.class')

export { default as Model } from './classes/Model.class'
