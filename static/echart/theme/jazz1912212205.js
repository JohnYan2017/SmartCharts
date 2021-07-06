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

    var colorPalette = [
        '#e9e0d1',
        '#91a398',
        '#33605a',
        '#070001',
        '#68462b',
        '#58a79c',
        '#abd3ce',
        '#eef6f5'
    ];

    var theme = {
        color: colorPalette,

        title: {
            textStyle: {
                fontWeight: 'normal',
                color: '#e9e0d1'
            }
        },

        visualMap: {
            color: ['#e9e0d1', '#91a398']
        },

        toolbox: {
            color: ['#e9e0d1', '#e9e0d1', '#e9e0d1', '#e9e0d1']
        },

        tooltip: {
           // backgroundColor: 'rgba(0,0,0,0.5)',
            axisPointer: {
                // Axis indicator, coordinate trigger effective
                type: 'line', // The default is a straight line： 'line' | 'shadow'
                lineStyle: {
                    // Straight line indicator style settings
                    color: '#e9e0d1',
                    type: 'dashed'
                },
                crossStyle: {
                    color: '#e9e0d1'
                },
                shadowStyle: {
                    // Shadow indicator style settings
                    color: 'rgba(200,200,200,0.3)'
                }
            }
        },

        // Area scaling controller
        dataZoom: {
            dataBackgroundColor: '#eee', // Data background color
            fillerColor: 'rgba(200,200,200,0.2)', // Fill the color
            handleColor: '#e9e0d1' // Handle color
        },

        timeline: {
            lineStyle: {
                color: '#e9e0d1'
            },
            controlStyle: {
                color: '#e9e0d1',
                borderColor: '#e9e0d1'
            }
        },

        candlestick: {
            itemStyle: {
                color: '#91a398',
                color0: '#33605a'
            },
            lineStyle: {
                width: 1,
                color: '#68462b',
                color0: '#070001'
            },
            areaStyle: {
                color: '#91a398',
                color0: '#abd3ce'
            }
        },

        map: {
            itemStyle: {
                color: '#c12e34'
            },
            areaStyle: {
                color: '#ddd'
            },
            label: {
                color: '#c12e34'
            }
        },

        graph: {
            itemStyle: {
                color: '#33605a'
            },
            linkStyle: {
                color: '#e9e0d1'
            }
        },

        gauge: {
            axisLine: {
                lineStyle: {
                    color: [
                        [0.2, '#91a398'],
                        [0.8, '#e9e0d1'],
                        [1, '#68462b']
                    ],
                    width: 8
                }
            }
        }
    };

    echarts.registerTheme('jazz', theme);
});