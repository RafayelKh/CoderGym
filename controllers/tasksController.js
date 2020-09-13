const Tasks = require('../models/tasks.js');
const fs = require('fs');

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
        const all_tasks = await Tasks.find({ language: req.params.lang });
        let responseTestInfo = [];
        for (const elem of all_tasks) {
            responseTestInfo.push({ 
                title: elem.title,
                desc: elem.description
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