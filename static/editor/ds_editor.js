var dsid = GetQueryString('dsid');
var divid = GetQueryString('divid') || '';
var on = GetQueryString('on') || '1';
var dsname ='';
var seq = GetQueryString('seq') || '';

if(divid) {dssq_init(16);}else{$('#dsseq').css('display', 'None');}
$.ajax({type: "get",url: '/echart/get_sqlstr/?dsid='+ dsid,success: function (data)
 {editor1.setValue(data['msg']);dsname=data['name'];$('#title').text('#'+seq+":"+dsid+dsname);$('#conn').text(data['connname']);} });
if(divid){set_onoff();}else{$('#onoff').css('display', 'None');}
editor1 = init_editor('sql');


function set_onoff() {
     if(on==='1'){$('#onoff').css('color','rgb(126, 255, 140)');on='2';
     }else{$('#onoff').css('color','rgb(126, 159, 140)');on='1';}
}

function save_title() {
    let tmpdsname = $('#dsname_input').val();
    $.ajax({type: "get",url: '/echart/save_dstitle/?dsid='+dsid+'&dsname='+ tmpdsname,success: function (data)
    {if(data['status']==='success'){dsname=tmpdsname; $('#title').text('#'+seq+":"+dsid+dsname);} $('#printlog').html(data['msg']);
    $('#modal_name').modal('hide');
} });
}

function save_conn() {
    let connid = $('#connselect').val();
    let connname = $('#connselect').find("option:selected").text();
    $.ajax({type: "get",url: '/echart/save_dsconn/?dsid='+dsid+'&connid='+ connid,success: function (data)
    {if(data['status']==='success'){ $('#conn').text(connname);} $('#printlog').html(data['msg']);
    $('#modal_conn').modal('hide');
} });
}

function insertds(flag='') {
    seq = $('#dsseq').val();
    $.ajax({type: "get",url: '/echart/set_dsseq/?c='+flag+'&divid='+ divid+'&seq='+seq,success: function (data)
    { try{window.opener.location.reload();}catch (e) {console.log('no opener')} divid=data['divid'];seq=data['seq']; $('#printlog').html(data['msg']);$('#changedsseq').html('');
    $('#title').text('#'+seq+":"+dsid+dsname);} });
}

$('#submit').click(function () {let e = editor1.getValue();console.log(e);
 $.ajax({
        type: "POST",
        url: "/echart/save_ds/",
        data: { dsid: dsid,sqlstr:e,divid:divid},
        success: function(data) {
            console.log(data);
            $('#printlog').html(data['msg']);
            dsid = data['dsid'];
            dsname = data['dsname'];
            $('#title').text('#'+seq+":"+dsid+dsname);
            if (GetQueryString('r')){
                try{
                if (GetQueryString('a') && data['r']){
                eval('window.opener.refresh_ds_'+seq+'()');}
                else{window.opener.location.reload();}}
                catch (e) {console.log('no opener');}
                } // window.opener=null;window.close();
            // else{window.location.href="/echart/?type=z.chart&dev=1&dataset="+dsid }
        }
    });
});

editor1.getSession().on('change', function(e) {$("#printlog").html('');});


$("#dsseq").change(function () {
    if($("#dsseq").val()===seq){
        $('#changedsseq').html('');
    }
    else{ $('#changedsseq').html('<a href="#" onclick="insertds()" class="glyphicon glyphicon-indent-left" style="color: rgb(255, 140, 60);">插入</a>' +
            '<a href="#" onclick="insertds(\'1\')" class="glyphicon glyphicon-retweet" style="color: rgb(255, 140, 60);">替换</a>');}
});

$('#onoff').click(function () {
  $.ajax({type: "get",url: '/echart/set_dsonoff/?divid='+ divid,success: function (data)
{ try{window.opener.location.reload();}catch (e) {console.log('no opener')} $('#printlog').html(data['msg']);set_onoff();} });
});

$('#editorframe').click(function () {
    window.location.href='/echart/ds_editor/?dsid=' + dsid +'&divid=' + divid
});

$('#title').click(function () {
    $('#dsid_input').text('#'+dsid);
    $('#dsname_input').val(dsname);
    $('#modal_name').modal('show');
});

$('#conn').click(function () {
  $.ajax({type: "get",url: '/echart/get_connlist/',success: function (data){
      let connselect = $('#connselect');connselect.empty();
          data['msg'].forEach(function (item) {
              connselect.append('<option value='+item[0]+'>'+item[1]+'</option>')
              if(item[1]===$('#conn').text()){connselect.val(item[0])}
          });
      $('#modal_conn').modal('show');
} });
});

function dssq_init(qty){
    for(let i=1;i<qty;i++) {
        $('#dsseq').append(`<option value="${i}">${i}</option>`);
    }
    $('#dsseq').val(seq);
}
