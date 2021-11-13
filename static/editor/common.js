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
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    let r = window.location.search.substr(1).match(reg);
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
    let theme_option = `<option value="clouds">clouds</option>
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

function insert_span() {
    let reg = /basevue.html/i;
    let e = editor1.getValue()
    let r = e.match(reg);
    reg = /div_list.(\d+)/g;
    let desc = function(a, b){return b-a}
    let seqList = [];
    let maxSeq=0;
   while(seq = reg.exec(e)){
    seqList.push(parseInt(seq[1]))
}
    if(seqList.length>0){console.log(seqList); seqList.sort(desc); maxSeq=seqList[0] + 1;
       if(maxSeq!==seqList.length){alert('序号不连续,请检查'+ seqList);return} }
    if(r){editor1.insert(`<el-row>
  <el-col :span="24" >{{div_list.${maxSeq}}}</el-col>
</el-row>`);} else {editor1.insert(`{{div_list.${maxSeq}}}`)}
}

function open_select(name) {
        let sText=editor1.session.getTextRange(editor1.getSelectionRange());
        let reg = /div_list.(\d+)/i;
        let r = sText.match(reg);
        let url = '';
        if(r!=null) {
            let dashid = GetQueryString('dashid');
            let seq = r[1];
            console.log(seq);
            $.ajax({
                type: "POST",
                url: "/echart/get_dashinfo/",
                data: {dashid:dashid, seq:seq},
                success: function(data) {
                    console.log(data);
                    $('#printlog').html(data['msg']);
                    if(data.status===200) {
                        dashDict = data.dashDict;
                        if(name==='chart'){url= `/echart/editor_min/?chartid=${dashDict.chartid}&dataid=${dashDict.dsid}&divid=${dashDict.divid}`}
                        else if(name==='ds'){url= `/echart/ds_editor/?divid=${dashDict.divid}&dsid=${dashDict.dsid}&seq=${dashDict.seq}`}
                        else if(name==='div'){url= `/echart/div_editor/?divid=${dashDict.divid}`}
                        if(url!==$('#iframepage').attr('src')){$('#iframepage').attr('src', url)}
                        $('#modal_iframe').modal('show');
                    }else if(data.status===501){r=confirm(data.msg + ', 是否新增数据集?'); if(r===true){create_div(dashid)}}
                }});
        }else{$('#printlog').html('请选择正确的div_list');}}

function create_div(dashid) {
        $.ajax({
            type: "GET",
            url: "/echart/create_div/?r=1&dashid=" + dashid,
            success: function (data) {
                if(data.status===200){alert('新增完成,请修改你的序号'); }
                else{alert(data.msg)}
            }
        });

    }