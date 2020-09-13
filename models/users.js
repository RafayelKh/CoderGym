const mongoose = require('mongoose');
const Scema = mongoose.Schema;


const UsersScema = new Scema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum:['teacher', 'student'],
        default:'Student',
        required: true
    }
});


const Users = mongoose.model('Users', UsersScema, 'users')
module.exports = Users