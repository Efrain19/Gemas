const mongoose = require('mongoose')
const Schema = mongoose.Schema 
const UserProfileSchema = Schema({
    username: {
        type: String
    },
    phone:{
        type: String,
        optional: true
    },
    email: {
        type: String
    },
    roles: {
        type: [String],
        allowedValues: ['admin', 'manager', 'developer']
    },
    password: {
        type: String
    }
})

module.exports = mongoose.model('Users', UserProfileSchema)