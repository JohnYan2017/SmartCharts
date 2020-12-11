//[0,item.project_name.name,item.name,item.id,item.project_name.icon,item.desktop,
//                 parse.quote(item.name),item.remark,item.image_url(),item.project_name.remark,item.project_name.seq]
var table_show_list = "";
var favor_show_list = [];
var disreport =[];
var report_list =[];
var disproject =[];
var first_menu_sets = "";
var dev = '';
var nowreport = '';
var nowreportid = 0;
var nowreportflag = 10;
refresh_index();

function reset_dev() {
if(dev){
    dev = ''; $('#devchange').css('color','#606266');refresh_index();
}else{dev='&dev=1';$('#devchange').css('color','red');refresh_index();}
if(nowreport){embedurl(nowreport);}
}

function gen_report_list() {
    report_list =[];
$(table_show_list).each(function(index, array) {report_list.push(array[0]+array[2]);});
}


function refresh_index(){
    let url = '/echart/index_api/?'+dev;
    let title = $.trim($("#id_title").val());
    if (title !== "") {
        if(report_list.includes(title)){
            if(title.slice(0,1)==='1'){
                url = '/echart/tableau?type=' + title.slice(1);
            }else{url = '/echart?type=' + title.slice(1); }
            embedurl(url); return;}
        url = url + '&s='+title;
    }
    $.ajax({type: "get",url: url,dataType:'json',success: function (data) {
        if (data.hasOwnProperty('msg')){embedurl(data.msg); return}
        table_show_list = data.show_list;
        favor_show_list = [];
        disreport = data.disreport;
        disproject = data.disproject;
        let tmplist = [];
        let favorlist =[];
        first_menu_sets = new Map();
        first_menu_sets.set('我的关注',favorlist);
        //[projecticon,reportname,reportname,reporttype,projectremark,reportid]
        $(table_show_list).each(function(index, array) {
            if (first_menu_sets.has(array[1])){
                tmplist = first_menu_sets.get(array[1]);
                tmplist.push([array[4],array[2],array[2],array[0],array[9],array[3]]);
            } else {
                tmplist = [[array[4],array[2],array[2],array[0],array[9],array[3]]];
            }
            first_menu_sets.set(array[1], tmplist);
            if(disreport.includes(array[3])){
                favor_show_list.push(array);
                favorlist.push(['iconfont ic-paid1',array[2],array[2],array[0],'smartchart.cn',array[3]]);
            }
        });
            if(favorlist.length===0){favorlist=[['iconfont ic-paid1','no_favorite','Contact',0,'smartchart.cn',-1]];}
            if(dev){
                favorlist.push(['iconfont ic-paid1','/admin/echart/echartdashboardsetup_v2/add/?','新增Dashboard',2,'新增图形集装箱',-1]);
                favorlist.push(['iconfont ic-paid1','/admin/echart/echartdataset/?','浏览数据集',2,'浏览数据集',-1]);
            }
            first_menu_sets.set('我的关注',favorlist);
        $("#show_list").html("");
        first_menu_sets.forEach(generate_first_menu);
        generate_favor();
        if (title ===''){gen_report_list();}
}})}

function help() {
$("#tbshow_list").html(
`<a class="load-more" href="javascript:embedurl(\'/echart?type=no_favorite\');">
<p>SmartChart</p>
<span class="fas fa-expand">全屏</span><span class="fas fa-sync-alt">刷新</span><span class="iconfont ic-list-like" title="加入收藏">关注</span><span class="fab fa-rocketchat">留言</span>
<hr><p>窗口显示报表: 点击左方菜单中项目名,显示报表列表后点击列表中链接</p><p>右方显示报表: 左方菜单中滑动选择报表后点击 或 上方搜索选择随机报表后点击查询</p></a>`)
}

function generate_favor() {
}


function first_menu_call(first_menu_name) {
    nowreport ='';
    nowreportid = 0;
    let mainframe_html = '<div class="col-xs-24 col-sm-16 col-sm-offset-1 main"> <ul class="note-list" id="tbshow_list"> </ul> </div>';
    $("#mainframe").html(mainframe_html);
    $("#show_list a").attr("class", "");
    $('#'+first_menu_name).attr("class", "active");
    if(first_menu_name === '我的关注'){generate_favor();return}
    $(table_show_list).each(function(index, array) {
        if (first_menu_name === array[1]) {
            generate_second_menu(array)
        }
    });
    $('html,body').animate({scrollTop: '0px'}, 500);
}

function get_sub_menu_html(param_list,projectname) {
    let tmpstr = '';
    let next_param_list = [];
    for(let i=0; i<disproject.length;i++) {
        let item = disproject[i];
        let subproject = item[0];
        let icon = item[2];
        if (projectname === item[1] && first_menu_sets.has(subproject)) {
            next_param_list = first_menu_sets.get(subproject);
            tmpstr = tmpstr + '<li><a href="javascript:first_menu_call(\'' + subproject + '\')" class=" " id = "' + subproject + '"><i class="' + icon + '"></i>' + subproject + ' >> </a><ul>' + get_sub_menu_html(next_param_list, subproject) + '</ul></li>';
        }
    }
    $(param_list).each(function (index,array) {
        if(array[3]<4){
        tmpstr = tmpstr + '<li><a href="javascript:showreport(\'' + array[1] + '\',' + array[3] + ',' + array[5] + ')" style="font-size:12px;"><i class="fa fa-globe"></i>' + array[2] + '</a></li>';
    }
    });
    return tmpstr;
}

function list_contain(key,array){
    for(let i= 0;i<array.length;i++){
        if(key === array[i][0]){
            return true;
        }
    }
    return false;
}

function generate_first_menu(value, key, map) {
    let first_menu_name = key;
    let param_list = value;
    let img_src = param_list[0][0];
    let comment = param_list[0][4];
    let tmpstr = '';
    if(list_contain(first_menu_name,disproject)){return}
    tmpstr = get_sub_menu_html(param_list,first_menu_name);
    let first_menu_li = '<li ><a href="javascript:first_menu_call(\''+ first_menu_name+'\')" class=" " id = "'+first_menu_name+'"><i class="'+img_src+'"></i> <strong>'+first_menu_name+'</strong><small>'+comment+'</small> </a> <ul>'+tmpstr+'</ul> </li>';
    $("#show_list").append(first_menu_li);
}

function generate_second_menu(array) {
    let number = array[0];
    let first_menu = array[1];
    let chart_name = array[2];
    let chart_id = array[3];
    let project_icon = array[4];
    let flag_pc = array[5];
    let chart_name_url = array[6];
    let comment = array[7];
    let chart_image = array[8];
    if(number === 1){
        chart_name_url = '/echart/tableau?type=' + chart_name_url;
    } else {chart_name_url = '/echart?type=' + chart_name_url +dev}
    chart_image = 'https://www.smartchart.cn/static/images/echart_shot.png';
    let like_html = '<span id="favor_'+chart_id+'_'+number+'"><a class="iconfont ic-list-like" title="加入收藏" href="javascript:add_favor(\''+chart_id+'\',\'favor_'+chart_id+'_'+number+'\')" ></a> </span>';
    if (disreport.includes(chart_id)){
        like_html = '<span id="favor_'+chart_id+'_'+number+'"><a class="iconfont ic-paid1" title="取消收藏" href="javascript:del_favor(\''+chart_id+'\',\'favor_'+chart_id+'_'+number+'\')" ></a> </span>';
    }

    let second_menu_li = '<li class="have-img"> <a href="'+chart_name_url+'" target="_blank" class="wrap-img"><img src="'+chart_image+'"></a> <div class="content"> <a href="'+chart_name_url+'" target="_blank" class="title">'+chart_name+'</a> <p class="abstract">'+comment+'</p> <div class="meta">'+like_html+'</div> </div> </li>';
    $("#tbshow_list").append(second_menu_li);
}

function add_favor(chart_id,h_id) {}

function del_favor(chart_id,h_id) {}

function showreport(reportname,flag, id=0) {
    let url ='';
    if(flag === 1) {
        url = '/echart/tableau?type=' + reportname;
    }else if(flag ===2){url = reportname}
    else{url = '/echart/?type=' + reportname;}
    embedurl(url,flag, id);
    $('html,body').animate({scrollTop: '0px'}, 300);
}

function iFrameHeight() {
  let ifm = document.getElementById("iframepage");
  if (ifm != null) {
   ifm.height =  $(window).height()*0.9;
  }
 }

function embedurl(url, flag =10, id=0) {
    nowreport = url;
    nowreportflag = flag;
    nowreportid = id;
    url = encodeURI(url+dev);
    let mainframe_html = '<iframe id="iframepage" class="iframepage" name="chartframe" src="'+url+'" frameborder="0" scrolling="auto" width="100%" height="100%"></iframe>';
    $("#mainframe").html(mainframe_html);
    iFrameHeight();
    if(disreport.includes(nowreportid)){
        $("#iframe-heart").css('color','red')
    }else{$("#iframe-heart").css('color','#606266')}
    $("#message-badge").remove();
    $.ajax({type:'POST', url:'/echart/get_comment_qty/',data: {report_id: nowreportid, report_flag: nowreportflag},
    success: function (data) {
        if(data['qty']>0){$("#iframe-message").append(`<span class="badge" id="message-badge">${data['qty']}</span>`)}
    }});
 }

function changelayout() {
    if ($('#show_list').hasClass('mcd-menu1')){
        $('#show_list').removeClass('mcd-menu1');
        $('#leftside').removeClass('leftsmall');
        $('#mainframe').removeClass('rightexpand');
        $('#leftside').css('background-color',p_background);
    }else{
        $('#show_list').addClass('mcd-menu1');
        $('#leftside').addClass('leftsmall');
        $('#mainframe').addClass('rightexpand');
        $('#leftside').css('background-color','white');

    }
}



var old_value = "";
var highlightindex = -1;
function AutoComplete(auto, search, mylist) {
    let title = $("#" + search).val();
    if(title ===''){mylist = getRandomArrayElements(mylist,10)}
    if (title != old_value || old_value == "") {
        var autoNode = $("#" + auto);
        var carlist = new Array();
        var n = 0;
        old_value = title;
        for (i=0; i<mylist.length;i++) {
            if (mylist[i].indexOf(old_value)!== -1) {
                carlist[n++] = mylist[i];
            }
        }
        if (carlist.length == 0) {
            autoNode.hide();
            return;
        }
        autoNode.empty();
        for (i=0;i<carlist.length;i++) {
            var wordNode = carlist[i];
            var newDivNode = $("<div>").attr("id", i);
            newDivNode.attr("style", "font:14px/25px arial;height:25px;padding:0 8px;cursor: pointer;");
            newDivNode.html(wordNode).appendTo(autoNode);
            newDivNode.mouseover(function () {
                if (highlightindex != -1) {
                    autoNode.children("div").eq(highlightindex).css("background-color", "white");
                }
                highlightindex = $(this).attr("id");
                $(this).css("background-color", "#ebebeb");
            });
            newDivNode.mouseout(function () {
                $(this).css("background-color", "white");
            });
            newDivNode.click(function () {
                var comText = autoNode.hide().children("div").eq(highlightindex).text();
                highlightindex = -1;
                $("#" + search).val(comText);
            });
            if (carlist.length > 0) {
                autoNode.show();
            } else {
                autoNode.hide();
                highlightindex = -1;
            }
        }
    }
    //点击页面隐藏自动补全提示框
    document.onclick = function (e) {
        var e = e ? e : window.event;
        var tar = e.srcElement || e.target;
        if (tar.id != search) {
            if ($("#" + auto).is(":visible")) {
                $("#" + auto).css("display", "none")
            }
        }
    }
}
$(function () {
    old_value = $("#id_title").val();
    $("#id_title").focus(function () {
        if ($("#id_title").val() == "") {
            AutoComplete("auto_div", "id_title", report_list);
        }
    });
    $("#id_title").keyup(function () {
        AutoComplete("auto_div", "id_title", report_list);
    });
});

function getRandomArrayElements(arr, count) {
    if(arr.length<=count){return arr;}
    let shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
    while (i-- > min) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(min);
}

// 兼容es7 includes string Array
(function(types) {
    types.forEach(function(type) {
        if (!type.prototype.includes) {
            type.prototype.includes = function(search, start) {
                if (typeof start !== 'number') {
                    start = 0;
                }
                if (start + search.length > this.length) {
                    return false;
                } else {
                    return this.indexOf(search, start) !== -1;
                }
            };
        }
    });
})([String, Array]);

function requestFullScreen() {
    if(nowreport) {
        let element = document.getElementById("iframepage");
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        }
    }else{$('body').dailog({type:'warning',animateStyle:'none',bottons:['确定'],title:'全屏', discription:'你需要在报表打开时才可全屏'});
}

}
function refreshFrame(){
    document.getElementById('iframepage').contentWindow.location.reload(true);
}

//获取评论
function report_msg() {
    let d_type = 'danger';
    if(nowreportid>0){d_type='success'}
    $.ajax({type:'POST', url:'/echart/get_comment/',data: {report_id: nowreportid, report_flag: nowreportflag},
    success: function (data) {
    $('body').dailog(
        {
            type:d_type,
            title:'comments',
            inputPlaceholder: data['placeholder'],
            isInput:true,
            discription: data['msg'],
            width: 'auto'
        },
        function(ret) {
            if(ret.index===0 && ret.input.value){
                $.ajax({
                type: "POST",
                url: "/echart/save_comment/",
                data: { report_link: nowreport, report_id: nowreportid, report_flag: nowreportflag, remark: ret.input.value},
                success: function(data) { console.log(data['msg']);
                } });
            }
        }
        );
    $("#message-badge").remove();
        }});
}

function make_love() {
    $('body').dailog({type:'warning',animateStyle:'none',bottons:['确定'],title:'关注报表', discription:'通用性原因,此功能暂无法开放-smartchart.cn'});
}