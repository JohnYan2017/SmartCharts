Smartchart内置了LineUp图形
LineUp is an interactive technique designed to create, visualize and explore rankings of items based on a set of heterogeneous attributes.
![输入图片说明](https://images.gitee.com/uploads/images/2022/0514/121520_5108b6aa_5500438.png "屏幕截图.png")

LineUp图形参考
```
ds_loadcss('smt_LineUp');
ds_loadjs('smt_LineUp');
let dataset = __dataset__;
dataset = ds_createMap_all(dataset);
try{Ljs__name__.destroy()}catch{}
Ljs__name__ = LineUpJS.asTaggle(dom__name__, dataset);

// 点击选中行响应动作
Ljs__name__.on(LineUpJS.LineUp.EVENT_SELECTION_CHANGED, (selection) => {
   console.log(Ljs__name__.data._data[selection]);
  //通过以上log可以查看到数据格式， 以下就是标准的联动写法
  filter_param['LineupParam'] = Ljs__name__.data._data[selection].xx
  ds_refresh(2);
});

//更多响应动作
Ljs__name__.on(LineUpJS.LineUp.EVENT_HIGHLIGHT_CHANGED, (highlight) => {
});

// document.querySelector('button#select').addEventListener('click', () => {
//   Ljs__name__.setSelection([1, 2, 3]);
// });

// document.querySelector('button#highlight').addEventListener('click', () => {
//   Ljs__name__.setHighlight(50);
// });

// 获取筛选后的数据并下载(来源与"路阳" 赞助开发)
outputStr=Ljs__name__.data.exportTable(Ljs__name__.data.getRankings()[0], {});
outputStr = outputStr.replace(/\t/g, ',');
ds_download('abc.csv', outputStr);

```