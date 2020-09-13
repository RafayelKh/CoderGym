$(function () {
  // alert($(location).attr("href"));
  $('#submitBtn').click(() => {
    let tests_id = $('#task_tests_id').val();
    let title = $(location).attr("href").split('/')[$(location).attr("href").split('/').length - 1]
    console.log(tests_id);
    $.ajax({
      url: '/tasks/add',
      type: "POST",
      data: {
        title,
        test_id: tests_id,
        code: editor.getValue()
      },
      success: function (data) {
        console.log('Success | script.js - line 11');
        console.log(data.result);
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
          }
        }
      }
    });
  })
})

function setupEditor()
{
  $.ajax({
    url: '/tasks/getEditor',
    type: "POST",
    data: { },
    success: function (data) {
      let lang = data.lang

      window.editor = ace.edit("editor");
      editor.setTheme("ace/theme/monokai");
      editor.getSession().setMode(`ace/mode/${lang}`);
      editor.setValue('' ,0);


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

setupEditor();