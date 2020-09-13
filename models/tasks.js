const mongoose = require('mongoose');
const Scema = mongoose.Schema;


const TasksScema = new Scema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    language:{
        type: String,
        required: true
    },
    tests_id: {
        type: String,
        required: true
    }
}, { timestamps: true });


const Tasks = mongoose.model('Tasks', TasksScema, 'tasks')

module.exports = Tasks