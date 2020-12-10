function lst_contains(arr, obj) {
    let i = arr.length;
    while (i--) {
        if (arr[i] === obj) {
            return true;
        }
    }
    return false;
}

//行列替换
function ds_transform(dataset){
    let seted = [];
    //确定新数组有多少行
    for(let i=0;i<dataset[1].length;i++){
     seted[i] = [];
    }
    //遍历原数组，动态添加数据（并实现行列转换）
    for(i=0;i<dataset.length;i++){
        for(let j=0;j<dataset[i].length;j++){
            seted[j][i] = dataset[i][j];
        }
    }
  return seted
}

//将第一列拆分成多个字段,默认逗号分隔, 如果不传表头,取SQL中的字段名拆分
function ds_split(data,sep=',',head_add=[]){
    let dataset=[];
    if(head_add){
    dataset.push(head_add.concat(data[0].slice(1)));
    }else{
     dataset.push(data[0][0].split(sep).concat(data[0].slice(1)));
    }
    for(let i=1; i<data.length; i++){
        dataset.push(data[i][0].split(sep).concat(data[i].slice(1)))
    }
    return dataset
}
//获取第一列的名称
function ds_rowname(dataset,start_row=1){
    let seted = [];
    for(let i=start_row;i<dataset.length;i++){
     seted[i-start_row] = dataset[i][0];
    }
  return seted
}

function ds_remove_column(dataset,remove_list=[0]){
        let seted = [];
        //确定新数组有多少行
        for(let i=0;i<dataset.length;i++){
         seted[i] = [];
        }
        //遍历原数组，动态添加数据
        for(i=0;i<dataset.length;i++){
            let k=0;
            for(let j=0;j<dataset[i].length;j++){
				if (lst_contains(remove_list,j)===false) {
                seted[i][k] = dataset[i][j];
				k=k+1;
				}
            }
        }
	  return seted
	}

// data表示传入的二位数组,生成结果表示为key->[]
function ds_createMap(data){
    let map = {};
    for (let i = 0; i < data.length; i++) {
    let t1 = [];
    for (let j = 1; j < data[i].length; j++) {
        t1.push(data[i][j]);
    }

    if (data[i][0].length > 0) {
            map[data[i][0]] = t1;
        } else {
            map['0'] = t1;
        }
    }
    return map
}

// data表示传入的二位数组,生成结果表示为[{A:A1,B:B1,C:C1},{A:A2,B:B2,C:C2}...]
function ds_createMap_all(data){
    let dataset = [];
    let tmpmap ={};
    for (let i = 1; i < data.length; i++) {
        tmpmap ={};
    for (let j = 0; j < data[i].length; j++) {
        tmpmap[data[0][j]]=data[i][j];
    }
    dataset.push(tmpmap);
    }
    return dataset;
}
//基于分辨率自动转字体大小
function ds_fontSize(res){
  let docEl = document.documentElement;
  let clientWidth = window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth;
  if (!clientWidth) return;
  let fontSize = 100 * (clientWidth / 1920);
  return res*fontSize;

}

//水印
function addWaterMarker(str){
let can = document.createElement('canvas');
let body = document.body;
body.appendChild(can);
can.width=400; //画布的宽
can.height=200;//画布的高度
can.style.display='none';
let cans = can.getContext('2d');
cans.rotate(-20*Math.PI/180); //画布里面文字的旋转角度
cans.font = "16px Microsoft JhengHei"; //画布里面文字的字体
cans.fillStyle = "rgba(17, 17, 17, 0.50)";//画布里面文字的颜色
cans.textAlign = 'left'; //画布里面文字的水平位置
cans.textBaseline = 'Middle'; //画布里面文字的垂直位置
cans.fillText(str,can.width/3,can.height/2); //画布里面文字的间距比例
body.style.backgroundImage="url("+can.toDataURL("image/png")+")"; //把画布插入到body中
}

// 制作上升下降箭头,
// param >> 传参数大于0上升箭头
// num (0,1) >> 0表示绿色上升 默认0|1 表示上升红色
function ds_getUpdown(param, num=0) {
    let colorUp = "green";
    let colorDown = "red";
    if(num>0){
        colorUp ="red";
        colorDown = "green";
    }
    if (param > 0) {
        return '<span style="color:'+colorUp+'">'+param+'<span style="color:'+colorUp+'" class="glyphicon glyphicon-arrow-up"></span></span>'
    } else {
        return '<span style="color:'+colorDown+'">'+param+'<span style="color:'+colorDown+'" class="glyphicon glyphicon-arrow-down"></span></span>'
    }
}
//转千分位
function ds_toThousands(num) {  num = (num || 0).toString(),
            result = '';
            let flag = num<0?"-":"";
            let data = (Math.abs(num)+"").split('\.');

            num = data[0]; while (num.length > 3) { result = ',' + num.slice(-3) + result;
            num = num.slice(0, num.length - 3) } if (num) { result = num + result } if (data.length === 1) { return flag+result } return flag +result + '.' + data[1] }

//去重
function ds_distinct(a, b=[]) {
    let arr = a.concat(b);
    let result = [];
    let obj = {};

    for (let i = 0; i<arr.length;i++) {
        if (!obj[arr[i]]) {
            result.push(arr[i]);
            obj[arr[i]] = 1;
        }
    }
    return result
}

//现个数组join [[1,2,3,4][2,3,4,5]] ,[[2,3,4]], 如果带头,合并头
function ds_leftjoin(a,b,withhead=true,type=1){
let c = [];
let blank = [];
let flag = false;
let i = 1;
for(i = 1;i<b[0].length;i++){blank.push(0);}
if(withhead){
    c.push(a[0].concat(b[0].slice(1)));
    a = a.slice(1);
    b = b.slice(1);
}
a.forEach(function(val) {
    flag = true;
    b.forEach(function(val2){
        if(val[0]===val2[0]){
            c.push(val.concat(val2.slice(1)));
            flag = false;
        }
    });
    if (flag && type){c.push(val.concat(blank));}
});
if (type===2){
    blank = [];
    for(i = 1;i<a[0].length;i++){blank.push(0);}
    b.forEach(function (val2) {
        flag = true;
        for(i=0;i<a.length;i++) {
            if(a[i][0]===val2[0]){flag = false; break;}
        }
        if(flag){c.push([val2[0]].concat(blank).concat(val2.slice(1)));}
    })
}
return c;
}

function ds_crossjoin(a,b,withhead=true){
   return ds_leftjoin(a,b,withhead,0) ;
}

function ds_fulljoin(a,b,withhead=true){
   return ds_leftjoin(a,b,withhead,2) ;
}

//union 两个数据集, 可选是否带头, 取第一个数据集的头, 去除第二个头
function ds_union(a,b,withhead=true){
    let c=[];
    if (withhead){c=a.concat(b.slice(1));}else{c=a.concat(b);}
    return c
}


// 获取value值,如果为空,null,undefined给默认值
function getUndefined(param,defaultValue){
    //判断传入的值是否为null,undefined,''
    if (!param) {
        //返回默认值
        return defaultValue
    }
    return param
}

function ds_round(num,qty=2) {
 return num.toFixed(qty)
}

//  ----------------------------  内置  -------------------------------------------
function Decimal(str){return parseFloat(str);}
function Mytime(){
	this.datetime=function(y,m,d,hh,mm,s,ss){
	    hh = hh || 0;
	    mm = mm || 0;
	    s = s || 0;
	    ss = ss || 0;
		return ''+y+'-'+m+'-'+d;
	};
this.date=function(y,m,d,hh,mm,s,ss){
    hh = hh || 0;
	    mm = mm || 0;
	    s = s || 0;
	    ss = ss || 0;
    return ''+y+'-'+m+'-'+d;
}
}
var datetime=new Mytime;
function startSelectAnimate(myChart,dataLen,interval=1000,showtip=1) {
  let currentIndex = -1;
  setInterval(function () {
  //  var dataLen = option.series[0].data.length;
    // 取消之前高亮的图形
    myChart.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
        dataIndex: currentIndex
    });
    currentIndex = (currentIndex + 1) % dataLen;
    // 高亮当前图形
    myChart.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: currentIndex
    });
    // 显示 tooltip
    if (showtip){
    myChart.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex: currentIndex
    });}
}, interval)
}

function dismissChangeRelatedObjectPopup(win, objId, newRepr, newId) {
        win.close();
        console.log(newId);
        location.reload();
    }