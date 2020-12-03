//select 维度,维度,值

var series =[];
var dataset = __dataset__;
for (var i=1;i<dataset[0].length;i++){
    series.push({type: 'bar'})
}

option__name__= {
    legend: {},
    tooltip: {},
dataset:{source:dataset },
    xAxis: {
        type: 'category',
    },
    yAxis: {
        type: 'value'
    },
    series: series
};
charts.push(myChart__name__);
