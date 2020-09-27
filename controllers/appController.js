const Tasks = require('../models/tasks.js');
const Tests = require('../models/tests.js');
const Exams = require('../models/exams.js');
var mongoose = require('mongoose');
const fs = require('fs');

let savedFileName = 'code.js';
let funcName = '';
let choosenLang = 'javascript'
let successTasks = []

const app_index = async (req, res) => {
    try{
        const examId = req.params.title;
        const exam = await Exams.findOne({ '_id': examId })
        choosenLang = exam.language

        // console.log(exam);
        let eachTaskId = exam.tasks_id.split(',').map(elem => {
            return elem.trim()
        });
        var eachTasks = [];
        let i = 1;
            eachTaskId.forEach(elem => {
                let tasksPromise = new Promise((resolve, reject) => {
                    Tasks.findOne({ '_id': elem }).sort({ createdAt: 'asc' })
                    .then(elem => {
                        resolve(elem)
                    }).catch(err => {
                        reject(err)
                    })
                })
                tasksPromise.then(value => {
                    eachTasks.push(value);
                    if (i == eachTaskId.length){
                        let TestsIds = eachTasks.map(elem => {
                            return elem.tests_id
                        })
                        let j = 1;

                        TestsIds.forEach(test_id => {
                            let testsPromise = new Promise((resolve, reject) => {
                                Tests.findOne({ '_id': test_id})
                                .then(elem => {
                                    resolve(elem)
                                }).catch(error => {
                                    reject(error)
                                })
                            })

                            testsPromise.then(value => {
                                if (j == TestsIds.length){
                                    let result = [];
                                    let testsInfo = [];
                                    for(let k = 0; k < Object.keys(value.tests[0]).length; k++){
                                        result.push({ 
                                            tasks: eachTasks,
                                        })
                                        testsInfo.push({
                                            tests_id: '-',
                                            input: ['-'],
                                            ex_output: '-',
                                            ex_output_type: '-',
                                            output: '-',
                                            is_completed: '-'
                                        })
                                    }
                                
                                    res.render('app/index', { tasksInfo: result, testsInfo });
                                }
                                j++
                            }).catch(error => {
                                console.log(error);
                            })
                        })
                    }
                    i++;
                })
                .catch(err => {
                    console.log(err);
                })
            })
    }catch (err){
        console.log(err)
    }
}

const app_get_task = (req, res) => {
    let testID = req.body.test_id
    let getTests = Tests.findOne({ '_id': testID })
    .then(result => {
        let responseTestInfo = []
        for (const [key, value] of Object.entries(result.tests[0])) {
            responseTestInfo.push({ 
                tests_id: result._id,
                input: key.split(','),
                ex_output: value,
                ex_output_type: typeof(value),
                output: '-',
                is_completed: false
            });
        }
       res.json({ result: responseTestInfo, id: testID  })
    })
    .catch(error => {
        console.log(error)
    })
}

const app_check_code = async (req, res) => {
    let responseTestInfo = [];
    let raw_data = await Tests.findOne({ '_id': req.body.test_id});

    let userCode = req.body.code;
    funcName = req.body.title
    saveWrittenCode(String(req.body.code), Object.entries(raw_data.tests[0]).length);
    let resultsOfCode = [];
    let checkSuccess = true;
    // Results of tests
    for (const [key, value] of Object.entries(raw_data.tests[0])) {
        if (choosenLang == 'python'){
            // Python code checking            
            const { spawnSync } = require('child_process');
            const pyProg = spawnSync('python', ['./users_codes/code.py', ...key.split(',')]);

            // Check error
            if (pyProg.stderr != '') {
                let errorResult = String(Error(pyProg.stderr))
                let result = errorResult.split('\n')[errorResult.split('\n').length - 2].trim('\r')
                resultsOfCode.push({
                    full_output: String(Error(pyProg.output[2])),
                    output: result,
                    output_type: '-',
                    is_completed: false
                });
            }

            // Check success
            let check = false;
            let data = String(pyProg.output[1]).trim('\n');
            
            if (data != ''){
                if (data == value && typeof(data) == typeof(value)){
                    check = true;
                }else{
                    checkSuccess = false;
                }
                resultsOfCode.push({ 
                    full_output: String(pyProg.output[1]),
                    output: data,
                    output_type: typeof(data),
                    is_completed: check
                });
            }
            
            choosenLang = 'python'

        } else if (choosenLang == 'java') {
            try{
                let check = false;

                // Java code checking
                const { execSync } = require('child_process');
                let javac = execSync(`javac users_codes/Code.java`)

                if (String(javac) == ''){
                    let args = key.split(',').map(elem => {
                        return elem.trim();
                    }).join(' ')
                    let java_code_result = execSync(`java users_codes/Code.java ${args}`)
    
                    if (String(java_code_result) == value && typeof(String(java_code_result)) == typeof(value)){
                        check = true;
                    }
                    resultsOfCode.push({ 
                        full_output: String(java_code_result),
                        output: String(java_code_result),
                        output_type: typeof(String(java_code_result)),
                        is_completed: check
                    });
                }
            }catch(err){
                resultsOfCode.push({
                    full_output: String(err.stderr),
                    output: '-',
                    output_type: '-',
                    is_completed: false
                });
            }

            choosenLang = 'java'
        } else {
            // Javascript code checking
            try {
                let test_args = key.split(',').map(elem => { return elem.trim() })
                let codeForRunning = require(`../users_codes/${savedFileName}`);
                let returnedValue = codeForRunning.func(...test_args);
                let check = false;
                if (returnedValue == value && typeof(returnedValue) == typeof(value)){
                    check = true
                }
                resultsOfCode.push({ 
                    full_output: returnedValue,
                    output: returnedValue,
                    output_type: typeof(returnedValue),
                    is_completed: check
                });
            }catch (err) {
                resultsOfCode.push({ 
                    full_output: err.message,
                    output: err.message,
                    output_type: '-',
                    is_completed: false
                });
            }
            
        }
    }

    if(checkSuccess){
        successTasks.push(funcName)
    }
    res.json({ result: resultsOfCode })
}

const app_get_config = async (req, res) => {
    res.json({ lang: choosenLang })
}

// Saves user-written code
function saveWrittenCode (userCode, inpCount) {
    // Python code saving
    if (choosenLang == 'python'){
        let inputsString = '';
        for (var i = 1; i < inpCount + 1; i++){
            inputsString = inputsString.concat(`sys.argv[${i}],`)
        }
        inputsString = inputsString.substring(0, inputsString.length - 1);
        let last_block = `\n\nprint(${funcName}(${inputsString}))\nsys.stdout.flush()`;

        fs.writeFileSync(__dirname + '/../users_codes/code.py', 'import sys \n\n\n' + userCode.concat(last_block), (err) => {
            if (err) {
              console.log(err);
            }else{
              console.log('File saved');
            }
          })
    }else if (choosenLang == 'java') { // Java save code
        let javaFullCode = `package users_codes;\n\n\nclass Code{\npublic static void main(String[] args) {\n\nSystem.out.println(${funcName}(args)); \n}  static ${userCode} \n}`        
        fs.writeFileSync(__dirname + '/../users_codes/Code.java', javaFullCode, (err) => {
            if (err) {
              console.log(err);
            }else{
              console.log('File saved');
            }
          })

    } else {
        // Javascript code saving
        fs.writeFileSync(__dirname + '/../users_codes/code.js', userCode.concat(`\n\nmodule.exports = { func: ${funcName} }`), (err) => {
            if (err) {
              console.log(err);
            }else{
              console.log('File saved');
            }
          })
    }
  }
  

module.exports = {
    app_index,
    app_check_code,
    app_get_task,
    app_get_config
}