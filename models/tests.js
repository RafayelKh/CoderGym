const mongoose = require('mongoose');
const Scema = mongoose.Schema;


const TestsScema = new Scema({
    tests: {
        type: Array,
        required: true
    }
});


const Tests = mongoose.model('Tests', TestsScema, 'tests')

module.exports = Tests