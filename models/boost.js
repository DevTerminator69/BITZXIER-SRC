const mongo = require('mongoose')

const Schema = new mongo.Schema({
    Guild: String,
    Boost: String
})

module.exports = mongo.model('boost', Schema)
