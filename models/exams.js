const mongoose = require('mongoose');
const Scema = mongoose.Schema;


const ExamsScema = new Scema({
    language: {
        type: String,
        required: true
    },
    tasks_id: {
        // tasks_id must be a comma-separated string containing IDs of tasks.
        type: String,
        required: true
    },
}, { timestamps: true });


const Exams = mongoose.model('Exams', ExamsScema, 'exams')

module.exports = Exams