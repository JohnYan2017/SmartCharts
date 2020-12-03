//select 维度A,维度B,.....,数值
let dataset=__dataset__;
//dataset = [['color','shape','qty','SS'],['blue','circle',1,2],['red','triangle',2,3]]

let rows = ['城市']
let cols = ['']
let derivers = $.pivotUtilities.derivers;
let sum = $.pivotUtilities.aggregatorTemplates.sum;// 获取sum操作函数
let numberFormat = $.pivotUtilities.numberFormat;// 获取数字格式化类
let renderers = $.extend($.pivotUtilities.renderers,
            $.pivotUtilities.plotly_renderers,
            $.pivotUtilities.export_renderers);
let intFormat = numberFormat({digitsAfterDecimal: 2}); // 对输入的数据进行格式转换
let pivotOption = {
                renderers:renderers,
                rows: rows,
                cols: cols,
                vals:['销售价'],
                aggregator: sum(intFormat)(["销售价"]),// 使用聚合函数指定聚合列名,
                rendererOptions:{table:{rowTotals: true,colTotals:false}}// 指定行列是否聚合汇总
            };
pivotOption.showUI=true;


$(function() {
//pivot隐藏拖拽,pivotUI显示
$(dom__name__).pivotUI(dataset, pivotOption,true);
    });

//需要切换功能时,在你的DIV中加一个id=pivotbutton的元素
$('#pivotbutton').click(function(){
    let pivotOption = $(dom__name__).data("pivotUIOptions");
    pivotOption.showUI = ! pivotOption.showUI;
    $(dom__name__).pivotUI(dataset, pivotOption,true);
})

//需要下载功能时,加一个id=tbdownbutton的元素,container改成对应的编号
$('#tbdownbutton').click(function(){
    let defaultOptions = "file"+ new Date().getTime();
    new Table2Excel().export($('#container___name__ > table > tbody > tr:nth-child(3) > td.pvtRendererArea > table'),defaultOptions);
    });