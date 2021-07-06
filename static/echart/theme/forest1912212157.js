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
        '#313b23',
        '#494f2b',
        '#606233',
        '#d6b77b',
        '#0e0e0e',
        '#076278',
        '#808080',
        '#e7d5b1'
    ];

    var theme = {
        color: colorPalette,

        title: {
            textStyle: {
                fontWeight: 'normal',
                color: '#313b23'
            }
        },

        visualMap: {
            color: ['#313b23', '#494f2b']
        },

        toolbox: {
            color: ['#313b23', '#313b23', '#313b23', '#313b23']
        },

        tooltip: {
          //  backgroundColor: 'rgba(0,0,0,0.5)',
            axisPointer: {
                // Axis indicator, coordinate trigger effective
                type: 'line', // The default is a straight line： 'line' | 'shadow'
                lineStyle: {
                    // Straight line indicator style settings
                    color: '#313b23',
                    type: 'dashed'
                },
                crossStyle: {
                    color: '#313b23'
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
            handleColor: '#313b23' // Handle color
        },

        timeline: {
            lineStyle: {
                color: '#313b23'
            },
            controlStyle: {
                color: '#313b23',
                borderColor: '#313b23'
            }
        },

        candlestick: {
            itemStyle: {
                color: '#494f2b',
                color0: '#606233'
            },
            lineStyle: {
                width: 1,
                color: '#0e0e0e',
                color0: '#d6b77b'
            },
            areaStyle: {
                color: '#494f2b',
                color0: '#d6b77b'
            }
        },

        map: {
            itemStyle: {
                color: '#606233'
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
                color: '#494f2b'
            },
            linkStyle: {
                color: '#313b23'
            }
        },

        gauge: {
            axisLine: {
                lineStyle: {
                    color: [
                        [0.2, '#494f2b'],
                        [0.8, '#313b23'],
                        [1, '0e0e0e']
                    ],
                    width: 8
                }
            }
        }
    };

    echarts.registerTheme('forest', theme);
});