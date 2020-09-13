const Users = require('../models/users.js');
var mongoose = require('mongoose');
const Tests = require('../models/tests.js')
const Tasks = require('../models/tasks.js')
const sha1 = require('sha1');

const users_login = (req, res) => {
    res.render('users/login');
}


const users_signin_account = (req, res) => {
    const username = req.body.username
    const pass = sha1(req.body.password)
    const user = Users.findOne({ username: username, password: pass })
        .then(result => {
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

const account = async (req, res) => {
    var user_type = "student"
    var user_acc = await Users.findOne({ username: req.url.split('/')[2] })
        .then(result => {
            user_type = result.type
        }).catch(err => {
            console.log(err);
        })
    res.render('users/welcome', { username: req.url.split('/')[2], type: user_type})
}

const users_signup = (req, res) => {
    res.render('users/signup', { error: '' });
}

const signup = (req, res) => {
    var username = req.body.username
    var password = sha1(req.body.password)
    var email = req.body.email
    var type = req.body.type
    var error = ""
    const user = new Users({
        username, email, type, password
    })


    user.save()
        .then((result) => {
            res.redirect('/login')
        })
        .catch((err) => {
            error = "Something went wrong"
            res.render('users/signup', { error })
        })
}

const users_add_task = (req, res) => {
    var title = req.body.title
    var funcname = req.body.funcname
    var desc = req.body.description
    var task_lang = req.body.language
    var datas = {}
    for(var i=3; i<=12; i+=2){
        if (Object.entries(req.body)[i][1] != '' && Object.entries(req.body)[i + 1][1] != ''){
            datas[Object.entries(req.body)[i][1]] = Object.entries(req.body)[i + 1][1]
        }
    }
    let new_test = new Tests({
        tests: datas
    })

    new_test.save()
        .then(result => {
            let new_task = new Tasks({
                title,
                description: desc,
                language: task_lang,
                funcname: funcname,
                tests_id: result._id
            })
            new_task.save()
                .then(result => {
                    res.redirect('/')
                })
                .catch(err => {
                    console.log(err);
                })
        }).catch(err => {
            console.log(err);
        })
}

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