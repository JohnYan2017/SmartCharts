(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['exports', 'echarts'], factory);
    } else if (
        typeof exports === 'object' &&
        typeof exports.nodeName !== 'string'
    ) {
        // CommonJS
        factory(exports, require('echarts'));
    } else {
        // Browser globals
        factory({}, root.echarts);
    }
})(this, function(exports, echarts) {
    var log = function(msg) {
        if (typeof console !== 'undefined') {
            console && console.error && console.error(msg);
        }
    };
    if (!echarts) {
        log('ECharts is not Loaded');
        return;
    }
    var contrastColor = '#eee';
    var axisCommon = function() {
        return {
            axisLine: {
                lineStyle: {
                    color: contrastColor
                }
            },
            axisTick: {
                lineStyle: {
                    color: contrastColor
                }
            },
            axisLabel: {
                textStyle: {
                    color: contrastColor
                }
            },
            splitLine: {
                lineStyle: {
                    type: 'dashed',
                    color: '#aaa'
                }
            },
            splitArea: {
                areaStyle: {
                    color: contrastColor
                }
            }
        };
    };

    var colorPalette = [
        '#458c6b',
        '#f2da87',
        '#d9a86c',
        '#d94436',
        '#a62424',
        '#76bc9b',
        '#cce6da',
        '#eeeeee'
    ];
    var theme = {
        color: colorPalette,
        backgroundColor: '#333',
        tooltip: {
            axisPointer: {
                lineStyle: {
                    color: contrastColor
                },
                crossStyle: {
                    color: contrastColor
                }
            }
        },
        legend: {
            textStyle: {
                color: contrastColor
            }
        },
        title: {
            textStyle: {
                color: contrastColor
            }
        },
        toolbox: {
            iconStyle: {
                normal: {
                    borderColor: contrastColor
                }
            }
        },

        // Area scaling controller
        dataZoom: {
            dataBackgroundColor: '#eee', // Data background color
            fillerColor: 'rgba(200,200,200,0.2)', // Fill the color
            handleColor: '#458c6b' // Handle color
        },

        timeline: {
            itemStyle: {
                color: colorPalette[1]
            },
            lineStyle: {
                color: contrastColor
            },
            controlStyle: {
                color: contrastColor,
                borderColor: contrastColor
            },
            label: {
                color: contrastColor
            }
        },

        timeAxis: axisCommon(),
        logAxis: axisCommon(),
        valueAxis: axisCommon(),
        categoryAxis: axisCommon(),

        line: {
            symbol: 'circle'
        },
        graph: {
            color: colorPalette
        },

        gauge: {
            axisLine: {
                lineStyle: {
                    color: [
                        [0.2, '#f2da87'],
                        [0.8, '#458c6b'],
                        [1, '#a62424']
                    ],
                    width: 8
                }
            }
        }
    };

    theme.categoryAxis.splitLine.show = false;
    echarts.registerTheme('dark-bold', theme);
});