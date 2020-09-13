let lang = 'python'

$(function () {
  // alert($(location).attr("href"));
  $('#submitBtn').click(() => {
    let tests_id = $('#task_tests_id').val();
    console.log(tests_id);
    $.ajax({
      url: '/tasks/add',
      type: "POST",
      data: {
        test_id: tests_id,
        code: editor.getValue()
      },
      success: function (data) {
        console.log('Success | script.js - line 11');
        console.log(data.result);
        for (var i = 0; i < data.result.length; i++) {
          $(`#${i}_output`).html(data.result[i].output);
          $(`#${i}_output_type`).html(data.result[i].output_type);
          if (data.result[i].is_completed) {
            $(`#${i}_completed`).html('+');
            $(`#${i}_completed`).parent().css('background-color', '#90ee90')
          } else {
            $(`#${i}_completed`).html('-');
            $(`#${i}_completed`).parent().css('background-color', '#ffcccb')
          }
        }
      }
    });
  })

  $.ajax({
    url: '/tasks/getLang',
    type: "POST",
    data: { },
    success: function (data) {
      lang = data
    }
  });



})

function setupEditor()
{
  window.editor = ace.edit("editor");
  editor.setTheme("ace/theme/monokai");
  editor.getSession().setMode(`ace/mode/${lang}`);
  editor.setValue('',0);


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

setupEditor();