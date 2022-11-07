---
weight: 3
type : docs
bookFlatSection : false
---

### 应用场景
Smartchart提供了很多通用的图形,你可以在商店中直接使用
如果要个性化需要你进行自定义, 比如你可能需要在同一个图上展示柱形图和线性图

开发前建意先观看视屏, 了解基础说明, 视屏有点老和现在界面不一样,
 **目前很多功能已经做成可视化配置, 理解过程即可, 具体以文档为准** 

- [Smartchart数据库与图形的对话](https://www.ixigua.com/6910413586208653837?id=6910373199603565063 "图形开发")
- [Smartchart图形开发一](https://www.bilibili.com/video/BV1X3411t7DQ/ "图形开发")
- [Smartchart图形开发二](https://www.bilibili.com/video/BV1t34y1R7Z8/ "图形开发")


### 获取原生echarts图形
首先我们在ECHART官网可能找一个你喜欢的图形, 如下简单柱形图链接:
[![输入图片说明](https://images.gitee.com/uploads/images/2021/0701/144039_824e0d48_5500438.png "屏幕截图.png")](https://echarts.apache.org/examples/zh/editor.html?c=bar-simple)

打开我们可以看对应的option:
```javascript
option = {
    xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
        type: 'value'
    },
    series: [{
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'bar'
    }]
};
```

### 转化为smartchart图形
复制到Smartchart图形编辑器， 点击"刀叉“ 图标(目前是魔法梆)， 会自动进行初步转化
![输入图片说明](https://images.gitee.com/uploads/images/2021/0701/144446_3f9cbf1e_5500438.png "屏幕截图.png")

接下来我们就进行下改造, 请注意对比, 你只需照着复制即可
```javascript
let dataset = __dataset__ //传入dataset
let legend_label = ds_rowname(dataset) //可选, 自动获取legend
let xlabel = dataset[0].splice(1) //x轴的标签列
dataset = ds_createMap(dataset) //转化成KV格式

//初始化series
var series=[];
series.push({
        data: dataset[legend_label[0]], //对应的第一个图列
        type: 'bar'
    });
series.push({
        data: dataset[legend_label[1]], //对应的第二个图列
        type: 'line'
    });

option__name__  = {
    xAxis: {
        type: 'category',
        data: xlabel //X轴的标签
    },
    yAxis: {
        type: 'value'
    },
    series:series,
};
charts.push(myChart__name__);
```
这样一个柱形+线性图就出来了
[![线柱混合图](https://www.smartchart.cn/media/media/photo/%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20191110144542.png "线柱混合图")](https://www.smartchart.cn/echart/editor_min/?chartid=61 "线柱混合图")

当然一个图形还有很多其它的元素, 比如标题, legend, 等等  更多option的配置项, 可以点击”！“号图标查看，你可以直接参考echarts的设定， **完全一样！！** 

以下我们做了些简单的修改
```javascript
option__name__  = {
    title: {
        text: '自定义图示例',
        left: 'center'
    }, //定义标题的显示
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c}'  //鼠标移动提示的格式
    },
    legend: {
        left: 'left',
        data: legend_label
    }, //定义图例的显示
    xAxis: {
        type: 'category',
        data: xlabel
    }, //定义X轴的显示
    yAxis: {
        type: 'value'
    },
	//图例定义
    series:series,
};
```

```javascript
//关于自动化series, 可以参考以下代码
var series =[];
for (var i=1;i<dataset[0].length;i++){
    series.push({type: 'bar'})
}

```
是不是非常简单 **Smartchart让你使用echarts没有门槛** 


> TIPS:
> - 如果你在图形编辑器中可以显示图形， 但是保存后在dashboard中无法， 首先检查下所有的mychart, option是否都有转化成带__name__, 如果都有，可能原因是你的代码中有mychart.setoption， 这样你可以在代码下方加上myChart__name__.setOption(option__name__);即可
> - 如果你在开发界面的仪表盘能看到图形显示，但预览仪表盘时，不显示图形，一般都是因为你图形代码中js结束需加分号的地方没有添加导致的