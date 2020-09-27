$(function () {
  let sessionCodes = {};
  let currentTaskTitle = '';

  $('#submitBtn').click(() => {
    let tests_id = $('#task_tests_id').val();
    let title = $('#task_title').val()
    $.ajax({
      url: '/tasks/add',
      type: "POST",
      data: {
        title,
        test_id: tests_id,
        code: editor.getValue()
      },
      success: function (data) {
        let checkForSuccess = false;
        for (var i = 0; i < data.result.length; i++) {
          $(`#${i}_output`).html(data.result[i].output);
          $(`#${i}_output_type`).html(data.result[i].output_type);
          $(`#${i}_full_text`).html(data.result[i].full_output)
          if (data.result[i].is_completed) {
            $(`#${i}_is_completed`).html('+');
            $(`#${i}_is_completed`).parent().css('background-color', '#90ee90')
          } else {
            $(`#${i}_is_completed`).html('-');
            $(`#${i}_is_completed`).parent().css('background-color', '#ffcccb')
            checkForSuccess = true;
          }
          if(!checkForSuccess){
            $(`#${currentTaskTitle}`).css({'background-color': '#90ee90'})
          }
        }
      }
    });
  })

  $('#clone-btn').click(() => {
    $('#clone-block').clone().insertAfter('#clone-block')
  })

  function setupEditor(taskTitle)
  {
    $.ajax({
      url: '/tasks/getEditor',
      type: "POST",
      data: { },
      success: function (data) {
        let lang = data.lang
        let CodeString = sessionCodes[taskTitle] || ''

        console.log(taskTitle);

        window.editor = ace.edit("editor");
        editor.setTheme("ace/theme/monokai");
        editor.getSession().setMode(`ace/mode/${lang}`);
        editor.setValue(CodeString ,0);


        editor.focus();
          
        editor.setOptions({
          fontSize: "15pt",
          showLineNumbers: true,
          showGutter: true,
          vScrollBarAlwaysVisible:true,
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSippets: true
        });

        editor.setShowPrintMargin(false);
        editor.setBehavioursEnabled(false);
      }
    });
  }

  $('button.eachTask').click(function (e) {
    $('#chooseText').css('display', 'none')
    let currentTaskTitle = $(`#task_title`).val();

    console.log(sessionCodes);
    if (e.target) {
      try {
        sessionCodes[currentTaskTitle] = editor.getValue()
      }catch(err){ }


      $.ajax({
        url: `/tasks/getTask`,
        type: "POST",
        data: {
          test_id: e.target.id
        },
        success: function (data) {
          setupEditor(e.target.innerText);
          for (var i = 0; i < data.result.length; i++) {
            $(`#${i}_input`).html(data.result[i].input);
            $(`#${i}_ex_type`).html(data.result[i].ex_output_type);
            $(`#${i}_ex_output`).html(data.result[i].ex_output);
            $(`#${i}_output`).html(data.result[i].output);
            $(`#${i}_output_type`).html(data.result[i].output_type);
            $(`#${i}_full_text`).html(data.result[i].full_output);
            $('#testBlock').css('display', 'inline-block')
            $('#submitBtn').css('display', 'block')
            $('#task_tests_id').val(data.id)
            $('#task_title').val(e.target.innerText)

            if (data.result[i].is_completed) {
              $(`#${i}_is_completed`).html('+');
              $(`#${i}_is_completed`).parent().css('background-color', '#90ee90')
            } else {
              $(`#${i}_is_completed`).html('-');
              $(`#${i}_is_completed`).parent().css('background-color', '#ffcccb')
            }
          }

        }
      });
    }
});
})
