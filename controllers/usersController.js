const Users = require('../models/users.js');
var mongoose = require('mongoose');
const Tests = require('../models/tests.js')
const Tasks = require('../models/tasks.js')
const Exams = require('../models/exams.js')
const sha1 = require('sha1');

// Login Page Opening
const users_login = (req, res) => {
    res.render('users/login');
}

// User authentificarion
const users_signin_account = (req, res) => {
    // Getting data
    const username = req.body.username
    const pass = sha1(req.body.password)

    // Get User from DB
    const user = Users.findOne({ username: username, password: pass })
        .then(result => {
            // Check if user exists
            if (result != null) {
                res.redirect(`/account/${result.username}`)
            } else {
                res.render('users/login')
            }
        })
        .catch((err) => {
            console.log(err);
        })
}

// Welcome page renderer
const account = async (req, res) => {
    var userType = "student"
    var userAcc = await Users.findOne({ username: req.url.split('/')[2] })
        .then(result => {
            userType = result.type
        }).catch(err => {
            console.log(err);
        })
    res.render('users/welcome', { username: req.url.split('/')[2], type: userType})
}

// Sign-up page rendering
const users_signup = (req, res) => {
    res.render('users/signup', { error: '' });
}

// New user creating
const signup = (req, res) => {
    // Get all data
    var username = req.body.username
    var password = sha1(req.body.password)
    var email = req.body.email
    var type = req.body.type
    var error = ""

    const user = new Users({
        username, email, type, password
    })

    // Save new user
    user.save()
        .then((result) => {
            res.redirect('/login')
        })
        .catch((err) => {
            error = "Something went wrong"
            res.render('users/signup', { error })
        })
}

// New Exam adding
const users_add_task = async (req, res) => {
    let examLang = req.body.language;
    let loopRange = 1;
    let allTasks = [];
    let newTitle = '';
    let desc = '';

    if (typeof(req.body.title) != 'string'){
        loopRange = req.body.title.length
    }
    for(let i = 0; i < loopRange; i++){
        // Get title
        if (typeof(req.body.title) == 'string'){
            newTitle = req.body.title
        }else{
            newTitle = req.body.title[i]
        }
        // Get description
        if (typeof(req.body.description) == 'string'){
            desc = req.body.description
        }else{
            desc = req.body.description[i]
        }

        // Data handling for table tests
        let datas = {}
        for(let j = 3; j <= Object.keys(req.body).length; j += 2){
            if (Object.entries(req.body)[j] != undefined){
                if (Object.entries(req.body)[j][1][i] != '' && Object.entries(req.body)[j + 1][1][i] != ''){
                    datas[Object.entries(req.body)[j][1][i]] = Object.entries(req.body)[j + 1][1][i]
                }
            }
        }

        allTasks.push([newTitle, desc, examLang, datas])
    }

    let tasksID = [];

    // Loop for each task
    allTasks.forEach(elem => {
        let newTest = new Tests({
            tests: elem[3]
        })
        // Saving current test
        newTest.save()
        .then(result => {
            let newTask = new Tasks({
                title: elem[0],
                description: elem[1],
                language: elem[2],
                tests_id: result._id
            })
            // Saving current task
            newTask.save()
                .then(taskResult => {
                    // Pushing current task id to tasksID
                    tasksID.push(String(taskResult._id));
                })
                .catch(err => {
                    console.log(err);
                })
        }).catch(err => {
            console.log(err);
        })
    })

    // Saving new exam to DB
    setTimeout(() => {
        let resultIDs = tasksID.join(',')
        let newExam = new Exams({
            language: examLang,
            tasks_id: resultIDs
        })

        // Saving...
        newExam.save()
            .then(result => {
                res.redirect('/')
            }).catch(err => {
                console.log(err);
            })
    }, 1000)

}

// Exam form renderer
const add_task = (req, res) => {
    res.render('tasks/add_task')
}

module.exports = {
    users_login,
    users_signup,
    users_signin_account,
    account,
    signup,
    users_add_task,
    add_task
}