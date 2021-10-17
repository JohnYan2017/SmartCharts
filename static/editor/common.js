var submit = document.querySelector('#submit');
var theme = localStorage.getItem('acetheme') || 'monokai';
var editor1 = '';
var helpText = '';
var helmodal = $('#myModal');

theme_init();
$("#ace-theme").change(function () {
    theme=$("#ace-theme").val();
    editor1.setTheme("ace/theme/"+theme);
    localStorage.setItem('acetheme',theme)
});

function GetQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
    return unescape(r[2]);
    }
    return null;
}
function init_editor(mode,name='editor1') {
    return ace.edit(name, {
            theme: "ace/theme/" + theme,
            mode: "ace/mode/" + mode,
            wrap: true,
            autoScrollEditorIntoView: true,
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: true
        });
}

function load_help(name) {
    if(helpText ===''){$.ajax({
    type: "get", url: 'https://www.smartchart.cn/smartdata/api/?i='+name,
    success: function (data) {helpText=data;helmodal.html(helpText);}
})}helmodal.modal('show');
}

function theme_init(){
    theme_option = `<option value="clouds">clouds</option>
                    <option value="monokai">monokai</option>
                    <option value="chrome">chrome</option>
                    <option value="github">github</option>
                    <option value="eclipse">eclipse</option>
                    <option value="tomorrow">tomorrow</option>
                    <option value="dawn">dawn</option>
                    <option value="sqlserver">sqlserver</option>
                    <option value="twilight">twilight</option>`;
    $('#ace-theme').append(theme_option).val(theme);

}