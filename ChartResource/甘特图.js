// select 项目名, 开始时间, 结束时间
var dataset = __dataset__; //传入dataset
//dataset=[['category','C1','C2'],['L1','2020-01-01T10:00:00','2020-02-01 11:00'],['L2','2020-02-01','2020-03-01'],['L3','2020-03-01','2020-04-01']];
//dataset = ds_transform(dataset) //可选, 当需要行列互转时
//legend_label = ['C1','C2'] //legend_label的顺序可以指定, 已知系列名
legend_label = ds_rowname(dataset) //可选, 自动获取legend
xlabel = dataset[0].slice(1) //x轴的标签列
dataset = ds_createMap(dataset) //转化成KV格式

//自动series
var series =[];
for (var i=0;i<legend_label.length;i++){
    series.push(
        {
            name: legend_label[i],
            type: "bar",
            stack: legend_label[i],
            label: {
                normal: {
                    show: true,
                    color: "#000",
                    position: "right",
                    formatter: function(params) {
                        return params.seriesName
                    }
                }
            },
            itemStyle: {
                normal: {
                    color: "skyblue",
                    borderColor: "#fff",
                    borderWidth: 2
                }
            },
            zlevel: -1,
            data: [new Date(dataset[legend_label[i]][1])]
        },
        {
            name: legend_label[i],
            type: "bar",
            stack: legend_label[i],
            itemStyle: {
                normal: {
                    color: "white",
                }
            },
            zlevel: -1,
            z: 3,
            data:[new Date(dataset[legend_label[i]][0])]
        }
        );
}


var option__name__= {
    backgroundColor: "#fff",
    title: {
        text: "甘特图",
        padding: 20,
        textStyle: {
            fontSize: 17,
            fontWeight: "bolder",
            color: "#333"
        },
        subtextStyle: {
            fontSize: 13,
            fontWeight: "bolder"
        }
    },
    legend: {
        data:legend_label,
        align: "right",
        right: 80,
        top: 50
    },
    grid: {
        containLabel: true,
        show: false,
        right: 130,
        left: 40,
        bottom: 40,
        top: 90
    },
    xAxis: {
        type: "time",
        axisLabel: {
            "show": true,
            "interval": 0
        }
    },
    yAxis: {
        axisLabel: {
            show: true,
            interval: 0,
            formatter: function(value, index) {
                var last = ""
                var max = 5;
                var len = value.length;
                var hang = Math.ceil(len / max);
                if (hang > 1) {
                    for (var i = 0; i < hang; i++) {
                        var start = i * max;
                        var end = start + max;
                        var temp = value.substring(start, end) + "\n";
                        last += temp; //凭借最终的字符串
                    }
                    return last;
                } else {
                    return value;
                }
            }
        },
        data: ["维度"]
    },
    tooltip: {
        trigger: "axis",
        formatter: function(params) {
            var res = "";
            var name = "";
            var start0 = "";
            var start = "";
            var end0 = "";
            var end = "";
            for (var i in params) {
                var k = i % 2;
                if (!k) { //偶数
                    start0 = params[i].data;
                    console.log(start0);
                   // start = start0.getFullYear() + "-" + (start0.getMonth() + 1) + "-" + start0.getDate();
                   start = start0.getHours() + ":" + start0.getMinutes() + ":" + start0.getSeconds();
                }
                if (k) { //奇数
                    name = params[i].seriesName;
                    end0 = params[i].data;
                    //end = end0.getFullYear() + "-" + (end0.getMonth() + 1) + "-" + end0.getDate();
                    end = end0.getHours() + ":" + end0.getMinutes() + ":" + end0.getSeconds();
                    res += name + " : " + end + "~" + start + "</br>";

                }
            }
            return res;
        }
    },
    series: series
}
charts.push(myChart__name__);

