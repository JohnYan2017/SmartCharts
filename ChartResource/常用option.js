var dataset = __dataset__; //传入dataset
//print(dataset)  //打印数据
var title = dataset[0][0]; //标题一般取第一个字段的名称
dataset = ds_transform(dataset); //可选, 当需要行列互转时
legend_label = ds_rowname(dataset); //可选, 自动获取legend
xlabel = dataset[0].slice(1); //x轴的标签列
dataset = ds_createMap(dataset); //转化成KV格式

//自动series,处理字典
var series =[];
for (var i=0;i<legend_label.length;i++){
    series.push({type:'bar',data:dataset[legend_label[i]]});
}

/*
//自动series,处理数组
var series =[];
for (var i=1;i<dataset[0].length;i++){
    series.push({type: 'line'})
}
*/

var option__name__ = {
//指定背景颜色
backgroundColor: '#3bd482',
//指定图列的顺序颜色
color : ['#b3c7bc','#cdd6bc','#d4713b'],
//标题，每个图表最多仅有一个标题控件
title: {
    text: "更多配置说明",//图的标题
    link: "https://www.echartsjs.com/zh/option.html",//主标题文本超链接
    subtext: "", //副标题文本，
    sublink: "",//副标题文本超链接
    x: "", //水平坐标，默认为左侧center|left|right| {number}（px)
    y: "", //top|bottom|center|{number}（y坐标，单位px）
    //字体格式
    textStyle: {
	 align: 'center',
     color: '#fff',
     fontSize: 20,
   },
},

tooltip: {//提示框，鼠标悬浮交互时的信息提示
    trigger: "axis",//触发类型，默认（item）数据触发，可选为：item|axis
    formatter: '{a} <br/>{b} : {c}',
    //formatter: function(param) { console.log(param);return param[0].value},
    //formatter: '{b}<br />{a0}: {c0}<br />{a1}: {c1}<br />{a2}: {c2}%',
    //折线（区域）图、柱状（条形）图、K线图 : {a}（系列名称），{b}（类目值），{c}（数值）, {d}（无）
    //散点图（气泡）图 : {a}（系列名称），{b}（数据名称），{c}（数值数组）, {d}（无）
    //地图 : {a}（系列名称），{b}（区域名称），{c}（合并数值）, {d}（无）
    //饼图、仪表盘、漏斗图: {a}（系列名称），{b}（数据项名称），{c}（数值）, {d}（百分比）

    //坐标轴指示器，坐标轴触发有效
    axisPointer: {
        type: "shadow",// 默认为直线，可选为：'line' | 'shadow'
        label: {
            show: true,
        }
   },
},
//图例，每个图表最多仅有一个图例
legend: {
    show: true,
    //水平安放位置，默认为全图居中，可选为：center|left|right|{number}（x坐标，单位px）
    x: "center",
    //垂直安放位置，默认为全图顶端，可选为top|bottom|center|{number}（y坐标，单位px）
    y: "top",
    //legend的data: 用于设置图例，data内的字符串数组需要与sereis数组内每一个series的name值对应
    data: ['销量', '人员'],
    //字体格式
    textStyle: {
	 align: 'center',
     color: '#fff',
     fontSize: 20,
   },
   //图标样式'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'
   icon: "diamond",
   //选择模式,默认开启图例选择,false 关闭,设成 'single' 或者 'multiple'使用单选或者多选模式
   selectedMode:true,
   //选中状态
   selected: {
    // 选中'系列1'
    '销量': true,
    // 不选中'系列2'
    '人员': false
   },
},

//x轴,横坐标
xAxis: {
    //x轴的标签
    data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
    //显示策略，可选为：true（显示） | false（隐藏），默认值为true
    show: true,
    type: 'category',//坐标轴类型，横轴默认为类目型’category’

    //x轴的标签格式
    axisLabel: {
        show: true,
        textStyle: {
            color: "#ebf8ac", //X轴文字颜色
        },
        //formatter: function(name) { return name;},
    },
    //x轴的轴线格式
    axisLine: {
        show: true, //是否隐藏X轴轴线
        lineStyle: {
            color: '#01FCE3',
            }
    },
    //x轴的刻度格式
    axisTick: {
        show: true, //是否隐藏X轴刻度
    },
},

//纵坐标

yAxis: {
    show: true,
    //坐标轴类型，纵轴默认为数值型’value’
    type: 'value',
    //分隔区域，默认不显示
    splitArea: { show: true, },
    //分隔线
    splitLine: { show: true, },
    //指定刻度范围
    min: 0,
    max: 50,
    interval:10,
    splitNumber: 8, //坐标轴的分割段数预估
    //标签轴线等与x轴的方法一致

},
/* //多坐标的写法

yAxis:[{
             type: 'value',
             name:'AAA',
             position:'left',
             axisLabel:{
                 //坐标文字
                textStyle: {
                    color: function (value, index) {
                    return value >= 90 ? 'green' : 'red';
                     }
                },
                formatter:function (value, index) {
                  return value/10000 + '万';
                  },
             }
         },
         {
             type: 'value',
             name:'差异',
            position : 'right',
         },

    ],

*/

//系列
series: [
    {
        name: '销量',
        type: 'bar',
        //barWidth: 15,//宽度
        barGap:'30%', //间距
        data: [5, 20, 36, 10, 10, 20],
        label: {
            show: true, //是否显示数值
            //position: [10, 10], //位置绝对的像素值
            position: ['50%', '50%'], //相对的百分比,'top','bottom','inside'
            rotate:-36, //角度
            formatter: '{b}:{c}' //自定义数据

        },
        //显示样式
        itemStyle: {
            color: "#058cff",
            //渐变色设定
            normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: "#00FFE3"
                        },
                        {
                            offset: 1,
                            color: "#4693EC"
                        }
                    ])
                },

        },

        //系列外框线格式
        lineStyle: {
            color: "#058cff"
        },
        //系列填充格式
        areaStyle:{
            color: "rgba(5,140,255, 0.2)"
        },

        //折线设定,所有标记样式如下
        //'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'
        smooth: true, //平滑曲线显示
        showAllSymbol: true, //显示所有图形。
        symbol: "circle", //标记的图形为实心圆
        symbolSize: 10, //标记的大小

        //标记点
        markPoint : {
                data : [
                    {type : 'max', name: '最大值'},
                    {type : 'min', name: '最小值'},
                    {name: '坐标',coord: [10, 20]},
                    {name: '屏幕坐标',x:100,y:200},
                ],
                //标记
                symbol:'pin',
                symbolSize:50,
                symbolRotate:-30,
                //通用格式如上的label
                label:{
                    show:true,
                },
            },

        //标记线
        markLine : {
            data : [
                {type : 'average', name: '平均值'},
                {name : '1000', yAxis : 24},
            ]
        },

    },
  /*  //高级series设定的方法
     {
        name: legend_label[2],
        data: dataset[legend_label[2]],
        type: 'line',
        yAxisIndex:1, //所在坐标轴,0为默认
        label:{
            show:true,
            formatter:function(param) {
             if (param.value===0) {return '';} else
               {return param.value;}
         }
       }
   },

  */



],



//直角坐标系内绘图网格
 grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        top: '15%',
        containLabel: true //false防止标签溢出容器
 },

/*
//视觉映射组件
visualMap: {
    min: 0,
    max: 100,
    // 两个手柄对应的数值是 4 和 15
    range: [4, 100],
    calculable:true, //是否显示手柄
    itemWidth:20,
    itemHeight:140,
    text:['最大值','最小值'],
    //dimension:1, //指定用数据哪个维度，映射到视觉元素上
    seriesIndex:0, //指用那个系列
    hoverLink:true, //鼠标位置对应的数值图表中对应的图形元素高亮
    // 表示目标系列的视觉样式 和 visualMap-continuous 共有的视觉样式。
    inRange: {
        color: ['#121122', 'rgba(3,4,5,0.4)', 'red'],
        symbolSize: [4, 100]
    },
    // 表示 visualMap-continuous本身的视觉样式，会覆盖共有的视觉样式。
    // 比如，symbolSize 覆盖成为 [30, 100]，而 color 不变。
    controller: {
        inRange: {
            symbolSize: [30, 100]
        }
    }

},

*/


//工具栏
toolbox: {
    //显示策略，可选为：true（显示） | false（隐藏），默认值为false
    show: true,
    //工具箱自定义功能回调处理
    feature: {
        //辅助线标志
        mark: { show: true },
        //dataZoom，框选区域缩放，自动与存在的dataZoom控件同步，分别是启用，缩放后退
        dataZoom: {
            show: true,
            title: {
                dataZoom: "区域缩放",
                dataZoomReset: "区域缩放后退"
                }
        },
        //数据视图，可设置更多属性,readOnly 默认数据视图为只读(即值为true)，可指定readOnly为false打开编辑功能
        dataView: { show: true, readOnly: true },
        //magicType，动态类型切换，支持直角系下的折线图、柱状图、堆积、平铺转换
        magicType: { show: true, type: ["line", "bar"] },
        //restore，还原，复位原始图表
        restore: { show: true },
        //saveAsImage，保存图片（IE8-不支持）,图片类型默认为’png’
        saveAsImage: { show: true }
    }
},
};

charts.push(myChart__name__);