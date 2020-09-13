const Tasks = require('../models/tasks.js');
const Tests = require('../models/tests.js');
var mongoose = require('mongoose');
const fs = require('fs');

// Inputs & Outputs 

let savedFileName = 'code.js';
let funcName = '';
let choosenLang = 'javascript'

const app_index = async (req, res) => {
    try{
        const title = req.params.title;
        const all_tasks = await Tasks.find({ 'title': title });
        choosenLang = all_tasks[0].language
        let responseTestInfo = [];
        if (all_tasks[0] != undefined){
            let raw_data_tests = await Tests.findById(all_tasks[0].tests_id);

            for (const [key, value] of Object.entries(raw_data_tests.tests[0])) {
                responseTestInfo.push({ 
                    tests_id: raw_data_tests._id,
                    input: key.split(','),
                    ex_output: value,
                    ex_output_type: typeof(value),
                    output: '-',
                    is_completed: '-'
                });
            }
            res.render('app/index', { testsInfo: responseTestInfo, id: raw_data_tests._id});
        }else{
            res.send('Something went wrong')
        }
        
    }catch (err){
        console.log(err)
    }
}

// AJAX responser
const app_check_code = async (req, res) => {
    const this_task = await Tasks.find({});
    let responseTestInfo = [];
    var id = mongoose.Types.ObjectId(req.body.test_id)
    let raw_data = await Tests.findOne({_id: id});

    let userCode = req.body.code;
    funcName = userCode.split(' ')[1].split('(')[0];
    saveWrittenCode(String(req.body.code), Object.entries(raw_data.tests[0]).length);
    let resultsOfCode = [];

    // Results of tests
    for (const [key, value] of Object.entries(raw_data.tests[0])) {
        if (choosenLang == 'python'){               
            const { spawnSync } = require('child_process');
            const pyProg = spawnSync('python', ['./users_codes/code.py', ...key.split(',')]);

            // Python code checking
            if (pyProg.stderr != '') {
                let errorResult = String(Error(pyProg.stderr))
                let result = errorResult.split('\n')[errorResult.split('\n').length - 2].trim('\r')
                resultsOfCode.push({ 
                    output: result,
                    output_type: '-',
                    is_completed: false
                });
            }

            let check = false;
            let data = String(pyProg.output[1]).trim('\n');
            
            if (data != ''){
                if (data == value && typeof(data) == typeof(value)){
                    check = true;
                }
                resultsOfCode.push({ 
                    output: data,
                    output_type: typeof(data),
                    is_completed: check
                });
            }
            
            choosenLang = 'python'

        }else{
            // Javascript code checking
            try {
                let test_args = key.split(',').map(elem => { return elem.trim() })
                let codeForRunning = require(`../users_codes/${savedFileName}`);
                let returnedValue = codeForRunning.func(...test_args);
                let check = false;
                if (returnedValue == value && typeof(returnedValue) == typeof(value)){
                    check = true
                }
            }catch (err) {
                resultsOfCode.push({ 
                    output: err.message,
                    output_type: '-',
                    is_completed: false
                });
            }
            
        }
    }
    
    res.json({ result: resultsOfCode })
}

const app_get_lang = async (req, res) => {
    res.json({ respond: choosenLang })
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
    }else{
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
    app_get_lang
}