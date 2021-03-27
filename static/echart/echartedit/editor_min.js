var __dataset__ = [['category','C1','C2'],['L1',10,20],['L2',15,25],['L3',8,15]];
var logstr='';
var helpText = '';
var vapp = {};
var autoshow = true;
function print(item){logstr+=item+";"}
function GetQueryString(name) {
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  let r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return unescape(r[2]);
  }
  return null;
}

function loaddefault(data){ gb.editor.setValue(data)}
function loadextjs() {
    let ec_themejs = localStorage.getItem('ec_themejs');
    let ec_theme = localStorage.getItem('ec_theme') || 'default';
    if (ec_themejs){$.getScript('/static/echart/theme/'+ec_themejs,function(){configs['theme']=ec_theme;});}}
function loaddataset(data){__dataset__=data;loadextjs();}
function loadlcdataset(localcachestr){__dataset__=JSON.parse(sessionStorage.getItem(localcachestr)) || __dataset__;loadextjs();}

function serverSave() { console.log('serversave');var e = gb.editor.getValue();console.log(e);
let dataid = GetQueryString('dataid') || '';
 $.ajax({
		type: "POST",
		url: "/echart/savechart/",
		data: { chartid: GetQueryString('chartid'),dataid: dataid,chart:e},
		success: function(data) {
			console.log(data);
			$('#printlog').html(data['msg']);
			let r_url = data['url'];
			if(r_url){window.location.href=r_url}
			if (GetQueryString('r')){try{
                window.opener.location.reload();}catch (e) {console.log('no opener');}
                 }
		}
	});
}

function localSave() { console.log('save');var e = gb.editor.getValue(); if (window.localStorage && e !== gb.loadedCode) try { window.localStorage.setItem("code", e), $("#reset-btn").css("display", "inline-block") } catch (t) { console.error(t), log("缓存到本地失败，刷新页面后图表将不被保存，请及时保存") } }

var dom = document.getElementById("chart-panel");

function makeSearch(e) { var t = []; for (var o in e) null != e[o] && t.push(o + "=" + e[o]); return t.join("&") }

function initEditor() { gb.editor = ace.edit("code-panel"), gb.editor.getSession().setMode("ace/mode/javascript"), gb.editor.setOptions({ enableBasicAutocompletion: !0, enableSnippets: !0, enableLiveAutocompletion: !0 }) }

function initEcharts() {
//localLoad();
gb.editor.selection.setSelectionRange({ start: { row: 1, column: 4 }, end: { row: 1, column: 4 } }) }
function localLoad() {
    try {
    console.log('loading local')
        var e = window.localStorage.getItem("code");
        e && gb.editor.setValue(e, -1),( gb.enableLive || runDebounce(), log("读取本地缓存成功"));
        return true;
    } catch (t) { console.error(t); }
}

function initControl() { $("#theme-dropdown").on("click", "li a", function() { setThemeButton($(this).text()) }), $("#echarts-version-dropdown").on("click", "li a", function() { setEchartsVersionButton($(this).text()) }) }
function setThemeButton(e) { $("#theme-btn").html("ECharts-" + e + ' <span class="caret"></span>'), $("#theme-btn").val(e),configs["theme"]=e, disposeAndRun() }

var handle_t=0.4;
function initEventHandler() {
    gb.enableLive && gb.editor.on("change", function() { runDebounce() }), $("#h-handler").mousedown(function() { gb.handler.isDown = !0 }), $(window).mousemove(function(e) {
        if (gb.handler.isDown) {
            var t = e.clientX / window.innerWidth;
            setSplitPosition(t);
            handle_t=t;
        }
    }).mouseup(function() { gb.handler.isDown = !1 }), $(window).resize(function() { gb.chart.resize(), appEnv.onresize && appEnv.onresize(), checkEditorIfToShow() })
}

function setSplitPosition(e) {
    e = Math.min(.9, Math.max(.1, e));
    var t = 100 * e;
    $("#code-container").css("width", t + "%"), $(".right-container").css("width", 100 - t + "%").css("left", t + "%"), $("#h-handler").css("left", t + "%"), gb.chart && (gb.chart.resize(), appEnv.onresize && appEnv.onresize())
}

function checkEditorIfToShow(){gb.editorIsShown = !0}
function editorShowSet(){ gb.editorIsShown === !0 ? (void 0 === gb.editorIsShown || gb.editorIsShown === !0) && ($("#code-container").hide(), $("#h-handler").hide(), $(".right-container").css("width", "100%").css("left", "0%"), gb.editorIsShown = !1,disposeAndRun(),$("#code-toggle-button").text("展开")) : (void 0 === gb.editorIsShown || gb.editorIsShown === !1) && ($("#code-container").show(), $("#h-handler").show(),setSplitPosition(handle_t), gb.editorIsShown = !0,$("#code-toggle-button").text("折叠")) }

function _clearTimeTickers() {
    for (var e = 0; e < _intervalIdList.length; e++) clearInterval(_intervalIdList[e]);
    for (var e = 0; e < _timeoutIdList.length; e++) clearTimeout(_timeoutIdList[e]);
    _intervalIdList = [], _timeoutIdList = []
}

function _wrapOnMethods(e) {
    var t = e.on;
    e.on = function(o) { var n = t.apply(e, arguments); return _events.push(o), n }
}

function _clearChartEvents() { _events.forEach(function(e) { gb.chart && gb.chart.off(e) }), _events.length = 0 }

function disposeAndRun() {
    gb.chart && gb.chart.dispose();
    gb.chart = null, run(!0)
}

function hasEditorError() {
    for (var e = gb.editor.getSession().getAnnotations(), t = 0, o = e.length; o > t; ++t)
        if ("error" === e[t].type) return !0;
    return !1
}

function load() {
    function e() { configs.c && (console.log(configs.c), $.ajax("../" + t + "/" + configs.c + ".js", { dataType: "text", success: function(e) { gb.loadedCode = e, gb.editor.setValue(e, -1), gb.enableLive || runDebounce() } }).fail(function() { log("加载图表失败！", "error") })) }
    var t = configs.gl ? "data-gl" : "data";
    if (configs.gl) {
        var o = document.createElement("script");
        o.onload = function() { e() }, o.src = "../vendors/echarts-gl/echarts-gl.js", document.body.appendChild(o)
    } else e()
}

function log(e, t) { var o = formatTime(new Date); "warn" !== t && "error" !== t && (t = "info"), $("#code-info").html('<span class="code-info-time">' + o + '</span><span class="code-info-type-' + t + '">' + e + "</span>") }

function formatTime(e) { for (var t = [e.getHours(), e.getMinutes(), e.getSeconds()], o = "", n = 0, a = t.length; a > n; ++n) o += (t[n] < 10 ? "0" : "") + t[n], a - 1 > n && (o += ":"); return o }

for (var lang = { zh: { errorInEditor: "编辑器内容有误！", chartOK: "图表已生成, " }, en: { errorInEditor: "Errors exist in code!", chartOK: "Chart has been generated successfully, " } }[window.EC_DEMO_LANG], configs = {}, lnTools = ace.require("ace/ext/language_tools"), keywords = { __name__:900001,__dataset__:900002,grid: 108210, series: 1161721, pie: 173151, legend: 278319, right: 12224, tooltip: 188049, xAxis: 374619, bar: 182040, label: 163527, emphasis: 5e4, formatter: 62138, line: 306801, data: 232156, left: 24464, top: 18094, scatter: 48954, type: 92134, yAxis: 238764, axisLabel: 73604, legendHoverLink: 14243, textStyle: 129159, hoverAnimation: 9062, dataZoom: 90999, nameLocation: 15800, nameTextStyle: 30596, nameGap: 14640, singleAxis: 15977, splitLine: 30047, nameRotate: 10483, inverse: 12997, boundaryGap: 18533, clockwise: 4411, lineStyle: 81857, selectedOffset: 2984, width: 17962, slider: 28321, dataBackground: 2287, areaStyle: 19428, color: 94439, height: 7954, orient: 17218, align: 10373, symbol: 35613, xAxisIndex: 15405, stack: 10602, clipOverflow: 3229, center: 9827, padding: 12855, itemStyle: 143518, itemGap: 11914, shadowBlur: 17233, shadowColor: 13929, normal: 211293, borderColor: 20648, shadowOffsetX: 11499, shadowOffsetY: 9210, opacity: 12301, heatmap: 13825, value: 21111, fillerColor: 797, borderWidth: 15576, itemWidth: 7123, effectScatter: 31179, coordinateSystem: 15302, axisLine: 53628, axisTick: 38765, selectedMode: 15177, fontSize: 14906, inactiveColor: 5720, selected: 10921, gauge: 55176, markLine: 65539, handleStyle: 1852, borderType: 5717, title: 158568, show: 82e3, length: 4814, zlevel: 22293, labelPrecision: 746, position: 48349, labelFormatter: 727, alignWithLabel: 3785, interval: 28810, showDetail: 694, yAxisIndex: 10560, showDataShadow: 591, realtime: 2611, onZero: 3690, silent: 22883, radar: 61070, axisPointer: 23175, trigger: 15344, barCategoryGap: 3511, splitNumber: 19992, inside: 32482, name: 61072, showSymbol: 4778, containLabel: 6413, offset: 15619, max: 12538, backgroundColor: 32864, visualMap: 95262, fontStyle: 14443, fontWeight: 11970, fontFamily: 10141, symbolSize: 21077, blurSize: 360, geo: 65283, radius: 8533, markArea: 19906, map: 102385, brush: 29508, parallel: 20673, parallelAxis: 13713, gridIndex: 20650, piecewise: 25231, showContent: 6960, zoom: 3997, polar: 23175, controller: 2892, radiusAxis: 24146, angleAxis: 18771, toolbox: 101543, timeline: 34619, precision: 3306, curveness: 1378, x: 2753, valueIndex: 2807, itemHeight: 5180, icon: 10336, valueDim: 2013, symbolOffset: 10017, y: 1590, transitionDuration: 3814, radarIndex: 715, extraCssText: 3640, animation: 17864, "animationThreshold = 2000": 11727, minInterval: 11278, animationDelay: 7620, layoutCenter: 2348, animationDurationUpdate: 6972, animationEasingUpdate: 6816, animationDelayUpdate: 6642, symbolRotate: 10221, feature: 50238, axis: 1794, crossStyle: 1830, funnel: 11042, scaleLimit: 4792, roam: 7112, itemSize: 1966, showTitle: 1851, smooth: 5185, saveAsImage: 9915, showAllSymbol: 3417, polarIndex: 5235, graph: 76898, layout: 2633, excludeComponents: 447, restore: 3693, dataView: 10258, magicType: 10505, iconStyle: 9088, nodeScaleRatio: 892, hoverLayerThreshold: 6480, textAlign: 9402, splitArea: 16447, nameMap: 4584, text: 11691, pixelRatio: 357, readOnly: 491, optionToContent: 936, lang: 549, textareaColor: 233, textareaBorderColor: 177, option: 2003, seriesIndex: 4483, back: 199, rect: 323, polygon: 254, min: 16646, scale: 14303, logBase: 7456, start: 2889, z: 15867, link: 5348, textBaseline: 4210, subtext: 5086, sublink: 2618, subtarget: 2373, subtextStyle: 7732, triggerEvent: 9175, blendMode: 6359, progressiveThreshold: 4699, continuous: 42105, lines: 31608, markPoint: 81254, roseType: 4221, animationEasing: 8836, animationDuration: 9562, calculable: 3953, progressive: 5761, treemap: 16948, links: 9573, edgeSymbol: 1211, bottom: 13969, edges: 1122, edgeLabel: 1685, edgeSymbolSize: 769, focusNodeAdjacency: 888, draggable: 965, force: 5601, geoIndex: 2856, circular: 1862, avoidLabelOverlap: 3694, target: 5476, coord: 3995, startValue: 2182, triggerOn: 6741, showDelay: 3535, alwaysShowContent: 4928, enterable: 3871, hideDelay: 3018, step: 3437, detail: 5434, startAngle: 5421, handleIcon: 1051, handleSize: 932, zoomLock: 1979, throttle: 1757, boxplot: 6233, candlestick: 14005, sankey: 10101, loop: 678, rewind: 439, controlStyle: 1269, labelLine: 17838, distance: 452, rotate: 4666, margin: 4342, barWidth: 6641, category: 1318, barGap: 4832, nodes: 2085, pieces: 2683, smoothMonotone: 2203, itemSymbol: 882, axisType: 902, currentIndex: 583, effectType: 1364, areaColor: 2808, showEffectOn: 1285, rippleEffect: 3617, minAngle: 2527, barMaxWidth: 3073, rotateLabel: 523, dimension: 1922, end: 1426, inRange: 4604, outOfRange: 2262, checkpointStyle: 1036, sampling: 2458, regions: 6273, large: 1055, showLegendSymbol: 1600, layoutSize: 1981, mapValueCalculation: 1447, categories: 4362, indicator: 2995, barBorderRadius: 1455, range: 2009, connectNulls: 3411, pointer: 2665, effect: 5446, parallelAxisDefault: 927, coords: 750, shadowStyle: 1670, largeThreshold: 754, hoverLink: 1276, repulsion: 865, textGap: 1121, breadcrumb: 828, baseline: 1316, endAngle: 895, period: 1153, brushType: 1421, minOpacity: 216, brushLink: 913, brushMode: 465, transformable: 418, brushStyle: 507, throttleType: 448, throttleDelay: 369, removeOnClick: 648, inBrush: 500, outOfBrush: 466, offsetCenter: 981, barMinHeight: 2279, parallelIndex: 235, nodeClick: 732, source: 869, color0: 210, filterMode: 2252, tiled: 352, autoPlay: 496, playInterval: 440, sort: 484, polyline: 929, initLayout: 966, controlPosition: 408, children: 89, contentToOption: 590, maxOpacity: 215, squareRatio: 281, leafDepth: 347, zoomToNodeRatio: 300, childrenVisibleMin: 303, shape: 1054, length2: 891, endValue: 1107, gravity: 634, edgeLength: 662, layoutAnimation: 485, colorAlpha: 389, constantSpeed: 451, trailLength: 530, dim: 313, areaSelectStyle: 253, funnelAlign: 334, buttonTextColor: 177, buttonColor: 205, levels: 2267, textColor: 178, lineX: 46, lineY: 32, showPlayBtn: 64, showPrevBtn: 43, showNextBtn: 43, playIcon: 90, stopIcon: 48, prevIcon: 39, nextIcon: 36, ellipsis: 76, clear: 114, colorMappingBy: 424, maxSize: 131, minSize: 147, gap: 175, visibleMin: 315, axisExpandable: 134, layoutIterations: 226, nodeGap: 158, nodeWidth: 134, axisExpandCenter: 79, axisExpandCount: 56, axisExpandWidth: 51, boxWidth: 46, gapWidth: 78, borderColorSaturation: 56, inactiveOpacity: 51, keep: 41, colorSaturation: 343, visualDimension: 471, id: 138, borderColor0: 67, emptyItemWidth: 60, activeOpacity: 43, radiusAxisIndex: 574, angleAxisIndex: 478, textPosition: 232, minOpen: 194, maxOpen: 125, graphic: 5617, elements: 3108, image: 673, group: 488, $action: 82, style: 431, textVerticalAlign: 13, fill: 55, stroke: 47, lineWidth: 34, sector: 93, "bezier-curve": 6, cpx2: 1, cpy2: 1, circle: 256, arc: 61, bezierCurve: 61, onclick: 101, onmouseover: 32, font: 17, bounding: 75, cursor: 54, themeRiver: 11, confine: 580, ring: 103, ondragleave: 3, ondragstart: 4, ondragover: 4, disabled: 221, visualMin: 44, visualMax: 18, onmousemove: 14, ondrag: 8, ondragend: 2, x2: 7, x1: 4, y1: 2, y2: 3, percent: 6, ondrop: 9, cx: 7, smoothConstraint: 20, cpx1: 2, points: 16, onmousewheel: 13, onmouseout: 7, barBorderWidth: 2, ondragenter: 2, onmouseup: 1, cy: 1, r: 2, onmousedown: 1, animationThreshold: 1 }, fullKeywordsList = ["0", "1", "createMap_all","pivot","pivotUI","title", "show", "text", "link", "target", "textStyle", "color", "fontStyle", "fontWeight", "fontFamily", "fontSize", "textAlign", "textBaseline", "subtext", "sublink", "subtarget", "subtextStyle", "padding", "itemGap", "zlevel", "z", "left", "top", "right", "bottom", "backgroundColor", "borderColor", "borderWidth", "shadowBlur", "shadowColor", "shadowOffsetX", "shadowOffsetY", "legend", "width", "height", "orient", "align", "itemWidth", "itemHeight", "formatter", "selectedMode", "inactiveColor", "selected", "tooltip", "data", "name", "icon", "grid", "containLabel", "trigger", "axisPointer", "type", "axis", "snap", "label", "precision", "margin", "lineStyle", "opacity", "shadowStyle", "crossStyle", "position", "extraCssText", "xAxis", "gridIndex", "offset", "nameLocation", "nameTextStyle", "nameGap", "nameRotate", "inverse", "boundaryGap", "min", "max", "scale", "splitNumber", "minInterval", "interval", "logBase", "silent", "triggerEvent", "axisLine", "onZero", "axisTick", "alignWithLabel", "inside", "length", "axisLabel", "rotate", "showMinLabel", "showMaxLabel", "baseline", "splitLine", "splitArea", "areaStyle", "value", "tiggerTooltip", "status", "handle", "size", "throttle", "yAxis", "polar", "center", "radius", "radiusAxis", "polarIndex", "angleAxis", "startAngle", "clockwise", "radar", "shape", "indicator", "dataZoom", "disabled", "xAxisIndex", "yAxisIndex", "radiusAxisIndex", "angleAxisIndex", "filterMode", "start", "end", "startValue", "endValue", "minSpan", "maxSpan", "minValueSpan", "maxValueSpan", "zoomLock", "dataBackground", "fillerColor", "handleIcon", "handleSize", "handleStyle", "borderType", "labelPrecision", "labelFormatter", "showDetail", "showDataShadow", "realtime", "visualMap", "range", "calculable", "textGap", "dimension", "seriesIndex", "hoverLink", "inRange", "outOfRange", "controller", "pieces", "categories", "minOpen", "maxOpen", "showLabel", "itemSymbol", "showContent", "alwaysShowContent", "triggerOn", "showDelay", "hideDelay", "enterable", "confine", "transitionDuration", "toolbox", "itemSize", "showTitle", "feature", "saveAsImage", "excludeComponents", "iconStyle", "normal", "textPosition", "emphasis", "pixelRatio", "restore", "dataView", "readOnly", "optionToContent", "contentToOption", "lang", "textareaColor", "textareaBorderColor", "textColor", "buttonColor", "buttonTextColor", "zoom", "back", "magicType", "line", "bar", "stack", "tiled", "option", "brush", "rect", "polygon", "lineX", "lineY", "keep", "clear", "brushLink", "geoIndex", "brushType", "brushMode", "transformable", "brushStyle", "throttleType", "throttleDelay", "removeOnClick", "inBrush", "outOfBrush", "geo", "map", "roam", "aspectScale", "boundingCoords", "scaleLimit", "nameMap", "itemStyle", "layoutCenter", "layoutSize", "regions", "areaColor", "parallel", "layout", "axisExpandable", "axisExpandCenter", "axisExpandCount", "axisExpandWidth", "axisExpandTriggerOn", "parallelAxisDefault", "parallelAxis", "dim", "parallelIndex", "areaSelectStyle", "singleAxis", "timeline", "axisType", "currentIndex", "autoPlay", "rewind", "loop", "playInterval", "controlPosition", "symbol", "symbolSize", "symbolRotate", "symbolOffset", "checkpointStyle", "animation", "animationDuration", "animationEasing", "controlStyle", "showPlayBtn", "showPrevBtn", "showNextBtn", "playIcon", "stopIcon", "prevIcon", "nextIcon", "graphic", "elements", "id", "$action", "bounding", "invisible", "cursor", "draggable", "progressive", "children", "onclick", "onmouseover", "onmouseout", "onmousemove", "onmousewheel", "onmousedown", "onmouseup", "ondrag", "ondragstart", "ondragend", "ondragenter", "ondragleave", "ondragover", "ondrop", "style", "image", "x", "y", "fill", "stroke", "lineWidth", "font", "textVerticalAlign", "cx", "cy", "r", "r0", "endAngle", "points", "smooth", "smoothConstraint", "x1", "y1", "x2", "y2", "percent", "cpx1", "cpy1", "cpx2", "cpy2", "calendar", "cellSize", "dayLabel", "firstDay", "monthLabel", "yearLabel", "series", "coordinateSystem", "showSymbol", "showAllSymbol", "hoverAnimation", "legendHoverLink", "connectNulls", "clipOverflow", "step", "smoothMonotone", "sampling", "markPoint", "valueIndex", "valueDim", "coord", "animationThreshold", "animationDelay", "animationDurationUpdate", "animationEasingUpdate", "animationDelayUpdate", "markLine", "curveness", "markArea", "barBorderRadius", "barWidth", "barMaxWidth", "barMinHeight", "barGap", "barCategoryGap", "selectedOffset", "minAngle", "roseType", "avoidLabelOverlap", "stillShowZeroSum", "labelLine", "length2", "animationType", "large", "largeThreshold", "effectType", "showEffectOn", "rippleEffect", "period", "radarIndex", "squareRatio", "leafDepth", "nodeClick", "zoomToNodeRatio", "levels", "visualDimension", "visualMin", "visualMax", "colorAlpha", "colorSaturation", "colorMappingBy", "visibleMin", "childrenVisibleMin", "ellipsis", "gapWidth", "borderColorSaturation", "breadcrumb", "emptyItemWidth", "boxWidth", "barMinWidth", "color0", "borderColor0", "blurSize", "minOpacity", "maxOpacity", "mapValueCalculation", "showLegendSymbol", "inactiveOpacity", "activeOpacity", "polyline", "effect", "delay", "constantSpeed", "trailLength", "coords", "circular", "rotateLabel", "force", "initLayout", "repulsion", "gravity", "edgeLength", "layoutAnimation", "nodeScaleRatio", "focusNodeAdjacency", "edgeSymbol", "edgeSymbolSize", "edgeLabel", "category", "nodes", "links", "source", "edges", "nodeWidth", "nodeGap", "layoutIterations", "minSize", "maxSize", "sort", "gap", "funnelAlign", "distance", "pointer", "offsetCenter", "detail", "symbolPosition", "symbolRepeat", "symbolRepeatDirection", "symbolMargin", "symbolClip", "symbolBoundingData", "symbolPatternSize", "singleAxisIndex", "date", "progressiveThreshold", "blendMode", "hoverLayerThreshold", "useUTC"], i = 0; i < fullKeywordsList.length; i++) null == keywords[fullKeywordsList[i]] && (keywords[fullKeywordsList[i]] = 0);
var completions = [];
for (var key in keywords) completions.push({ caption: key, value: key, score: keywords[key], metal: "local" });
lnTools.addCompleter({ getCompletions: function(e, t, o, n, a) { a(null, completions) } }), _.each((location.search || "").substr(1).split("&"), function(e) {
    var t = e.split("=");
    configs[t[0]] = t[1]
});
var gb = { handler: { isDown: !1 }, lastTyping: 0, editor: null, chart: null, loadedCode: null, echartsSource: {}, lastOption: null, updateTime: 0, debounceTime: 500, enableLive: !configs.gl && !configs.nolive },
    COLORS = { "default": ["#c23531", "#2f4554", "#61a0a8", "#d48265", "#91c7ae", "#749f83", "#ca8622", "#bda29a", "#6e7074", "#546570", "#c4ccd3"], light: ["#37A2DA", "#32C5E9", "#67E0E3", "#9FE6B8", "#FFDB5C", "#ff9f7f", "#fb7293", "#E062AE", "#E690D1", "#e7bcf3", "#9d96f5", "#8378EA", "#96BFFF"], dark: ["#dd6b66", "#759aa0", "#e69d87", "#8dc1a9", "#ea7e53", "#eedd78", "#73a373", "#73b9bc", "#7289ab", "#91ca8c", "#f49f42"] };
$("#theme ." + (configs.theme || "default")).addClass("selected"), $("#theme a").click(function() {
    if (!$(this).hasClass("selected")) {
        var e = $(this).attr("class").replace("default", "").trim();
        $(this).addClass("selected")
        if(configs.theme !== 'default' && configs.theme !== 'dark' && configs.theme !== 'light'){configs.theme=''}
        $("#theme ." + (configs.theme || "default")).removeClass("selected")
       // window.location.href = "?" + makeSearch({ c: configs.c, gl: configs.gl || null, theme: e || null })
       setThemeButton(e)
    }
}), $("#theme a").popover({ html: !0, content: function() { var e = $(this).attr("class").replace("selected", "").trim(); return '<div class="theme-palette ' + e + '">' + COLORS[e].map(function(e) { return '<span style="background-color:' + e + '"></span>' }).join("") + "</div>" }, placement: "top", trigger: "hover" }), $(document).ready(function() { initEditor(), checkEditorIfToShow(), initEcharts(), initControl(), initEventHandler(), load() });
var appEnv = {},
    gui, _intervalIdList = [],
    _timeoutIdList = [],
    _oldSetTimeout = window.setTimeout,
    _oldSetInterval = window.setInterval;
window.setTimeout = function(e, t) { var o = _oldSetTimeout(e, t); return _timeoutIdList.push(o), o }, window.setInterval = function(e, t) { var o = _oldSetInterval(e, t); return _intervalIdList.push(o), o };
var _events = [],
    run = function(ignoreOptionNotChange) {
         if(!(autoshow || ignoreOptionNotChange)){return}
//      var dom = document.getElementById("chart-panel");
        if (gb.chart || (gb.chart = echarts.init(dom, configs.theme, { renderer: configs.renderer || "canvas" }), _wrapOnMethods(gb.chart)), hasEditorError()) return void log(lang.errorInEditor, "error");
//        if (gb.chart || (gb.chart = echarts.init($("#chart-panel")[0], configs.theme, { renderer: configs.renderer || "canvas" }), _wrapOnMethods(gb.chart)), hasEditorError()) return void log(lang.errorInEditor, "error");
        localSave(), _clearTimeTickers(), _clearChartEvents(), appEnv.config = null;
        try {
            var myChart = gb.chart,
                app = appEnv;
            var editstr = gb.editor.getValue().replace(/__name__/g, '')
                editstr = editstr.replace('charts.push(myChart);','')
            if (option = null, eval(editstr), option && "object" == typeof option && (!_.isEqual(option, gb.lastOption) || ignoreOptionNotChange)) {
                gb.lastOption = option;
                var startTime = +new Date;
                gb.chart.setOption(option, !0);
                var endTime = +new Date;
                gb.updateTime = endTime - startTime;
                for (var debounceTime = 500, debounceTimeQuantities = [500, 2e3, 5e3, 1e4], i = debounceTimeQuantities.length - 1; i >= 0; i--) {
                    var quantity = debounceTimeQuantities[i],
                        preferredDebounceTime = debounceTimeQuantities[i + 1] || 1e6;
                    if (gb.updateTime > quantity && gb.debounceTime !== preferredDebounceTime) { gb.debounceTime = preferredDebounceTime, runDebounce = _.debounce(run, preferredDebounceTime, { trailing: !0 }); break }
                }
                log(lang.chartOK + gb.updateTime + "ms");
                $('#printlog').html(logstr);
            }
            else {
            $('#printlog').html(logstr);
            }
            logstr='';
            if (gui && ($(gui.domElement).remove(), gui.destroy(), gui = null), app.config) {
                gui = new dat.GUI({ autoPlace: !1 }), $(gui.domElement).css({ position: "absolute", right: 5, top: 0, zIndex: 1e3 }), $(".right-container").append(gui.domElement);
                var configParameters = app.configParameters || {};
                for (var name in app.config) {
                    var value = app.config[name];
                    if ("onChange" !== name && "onFinishChange" !== name) {
                        var isColor = !1,
                            controller;
                        if (configParameters[name] && (configParameters[name].options ? controller = gui.add(app.config, name, configParameters[name].options) : null != configParameters[name].min && (controller = gui.add(app.config, name, configParameters[name].min, configParameters[name].max))), "string" == typeof obj) try {
                            var colorArr = echarts.color.parse(value);
                            isColor = !!colorArr, isColor && (value = echarts.color.stringify(colorArr, "rgba"))
                        } catch (e) {}
                        controller || (controller = gui[isColor ? "addColor" : "add"](app.config, name)), app.config.onChange && controller.onChange(app.config.onChange), app.config.onFinishChange && controller.onFinishChange(app.config.onFinishChange)
                    }
                }
            }
        } catch (e) { log(lang.errorInEditor, "error"), console.error(e) }
    },
    runDebounce = _.debounce(run, gb.debounceTime, { trailing: !0 });
$("#save").click(serverSave);
$("#code-toggle-button").click(editorShowSet);
function auto_html() {
    autoshow = !autoshow;
    if(autoshow){$('#id_autohtml').css('color', 'red')}else{$('#id_autohtml').css('color', 'gray')}
}