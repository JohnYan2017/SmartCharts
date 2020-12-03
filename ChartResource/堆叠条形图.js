//select 维度,维度,值
let dataset = __dataset__;
let s = {
            type: 'bar',
            stack: '总量',
            label: {
                normal: {
                    show: true,
                    position: 'insideRight',
formatter: function (params) {
                    	if (params.value[params.seriesIndex+1] > 0) {
                        	return params.value[params.seriesIndex+1];
                    	} else {
                        	return '';
                    	}
                	},
                }
            },
        };
let series =[];
for (let i=1;i<dataset[0].length;i++){
    series.push(s)
}
option__name__={ dataset:{source:dataset },
    title:{text:dataset[0][0]},
    tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    legend: {
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis:  {
        type: 'value'
    },
    yAxis: {
        type: 'category'
    },
    series: series
};charts.push(myChart__name__);