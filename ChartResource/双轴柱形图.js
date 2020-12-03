//select 维度,指标1, 指标2, 指标3

let dataset = __dataset__; //传入dataset
dataset = ds_transform(dataset) //可选, 当需要行列互转时
let legend_label = ds_rowname(dataset) //可选, 自动获取legend
let xlabel = dataset[0].splice(1) //x轴的标签列
dataset = ds_createMap(dataset) //转化成KV格式

option__name__  = {
   title: {
       text: '',
        left: 'center'
    }, //定义标题的显示
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c}'  //鼠标移动提示的格式
    },
    legend: {
       left: 'center',
        data: legend_label
    }, //定义图例的显示
    xAxis: {
        type: 'category',
       data: xlabel
    }, //定义X轴的显示
    yAxis: [{
        type: 'value',
        name:'AAA',
        position:'left',
        axisLabel:{
         formatter:function (value, index) {
    return value/10000 + '万';
}}
    },{
        type: 'value',
        name:'差异',
        position : 'right',

    }],
    //图例定义
   series: [{
        name: legend_label[0],
        data: dataset[legend_label[0]],
        type: 'bar'
   },
   {
        name: legend_label[1],
       data: dataset[legend_label[1]],
        type: 'bar'
   },{
        name: legend_label[2],
        data: dataset[legend_label[2]],
        type: 'line',
        yAxisIndex:1,
        label:{
            show:true,
            formatter:function(param) {
            if (param.value==0) {return '';} else
            {return param.value;}
        }
    }}
]
};
charts.push(myChart__name__);