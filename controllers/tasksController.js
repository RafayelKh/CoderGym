const Exams = require('../models/exams.js');

const tasks_index = async (req, res) => {
    const langs = [
        'javascript',
        'python',
        'java',
    ]
    let responseTestInfo = []
    try{
        for (var i = 0; i < langs.length; i++) {
            responseTestInfo.push({ 
                title: langs[i],
            });
        }
        res.render('tasks/index', { allTests: responseTestInfo});
    }catch (err){
        console.log(err)
    }
}

const tasks_langTasks = async (req, res) => {
    try{
        const all_tasks = await Exams.find({ language: req.params.lang });
        let responseTestInfo = [];
        for (var i = 0; i < all_tasks.length; i++) {
            var elem = all_tasks[i]
            console.log(elem._id);
            responseTestInfo.push({ 
                title: `Exam ${i + 1}`,
                exam_id: elem._id
            });
        }
        res.render('tasks/langTasks', { allTests: responseTestInfo});
    }catch (err){
        console.log(err)
    }
}

module.exports = {
    tasks_index,
    tasks_langTasks
}