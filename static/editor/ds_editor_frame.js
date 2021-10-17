var dsid = GetQueryString('dsid');
var divid = GetQueryString('divid') || '';
var dsname = '';
editor1=init_editor('sql');

$.ajax({type: "get",url: '/echart/get_sqlstr/?dsid='+dsid,success: function (data)
    {editor1.setValue(data['msg']);dsname=data['name'];$('#title').text('#'+dsid+dsname);$('#conn').text(data['connname']);} });

$('#submit').click(function () {
    let e = editor1.getValue();console.log(e);
     $.ajax({
            type: "POST",
            url: "/echart/save_ds/",
            data: { dsid:dsid,sqlstr:e, divid:divid},
            success: function(data) {
                console.log(data);
                $('#printlog').html(data['msg']);
                // $('#iframepage')[0].contentWindow.refresh_ds_1();
                $('#iframepage')[0].contentWindow.location.reload();
                    }
        });
});


function save_title() {
    let tmpdsname = $('#dsname_input').val();
  $.ajax({type: "get",url: '/echart/save_dstitle/?dsid='+dsid+'&dsname='+ tmpdsname,success: function (data)
 {if(data['status']==='success'){dsname=tmpdsname; $('#title').text('#:'+dsid+dsname);} $('#printlog').html(data['msg']);
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

editor1.getSession().on('change', function(e) {$("#printlog").html('');});

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

window.onbeforeunload= function(event) {if(divid){window.opener.location.reload();}}