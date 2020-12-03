//select 指标名, 值

var dataset = __dataset__; //传入dataset
legend_label = ds_rowname(dataset) //可选, 自动获取legend
var series =[];
for (var i=1;i<dataset.length;i++){
    series.push({name: dataset[i][0],value: dataset[i][1]})
}

option__name__ = {
   // backgroundColor: '#2c343c',

    title: {
        text: dataset[0][1],
        left: 'center',
        top: 20,
        textStyle: {
      //      color: '#ccc'
        }
    },
    tooltip : {
        trigger: 'item',
        formatter: "{b} <br/>{c} ({d}%)"
    },

    visualMap: {
        show: false,
        min: 80,
        max: 600,
        inRange: {
    //        colorLightness: [0, 1]
        }
    },
    series : [
        {
            name:dataset[0][1],
            type:'pie',
            radius : '55%',
            center: ['50%', '50%'],
            roseType: 'radius',
            label: {
                normal: {
                    textStyle: {
                  //      color: 'rgba(255, 255, 255, 0.3)'
                    }
                }
            },
            labelLine: {
                normal: {
                    lineStyle: {
                   //     color: 'rgba(255, 255, 255, 0.3)'
                    },
                    smooth: 0.2,
                    length: 10,
                    length2: 20
                }
            },
            itemStyle: {
                normal: {
                //    color: '#8B2500',
                 //   shadowBlur: 200,
                 //   shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            },

            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function (idx) {
                return Math.random() * 200;
            },
            data: series
        }
    ]
};
charts.push(myChart__name__);

//动态播放
startSelectAnimate(myChart__name__,legend_label.length,1000,1);