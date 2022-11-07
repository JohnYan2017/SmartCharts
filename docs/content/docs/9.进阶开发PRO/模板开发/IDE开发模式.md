---
weight: 6
type : docs
bookFlatSection : false
---

### 应用场景
- 如果您是一个资深的前端开发者
- 可能不需要使用smartchart组件,仅需使用到数据集
- 你希望在IDE(如VS code)中开发然后打包发布
- 非专用人士,请不要尝试这种方式

### 开发方式
在模板中使用basesimple
![输入图片说明](https://images.gitee.com/uploads/images/2022/0726/082844_51c28fab_5500438.png "屏幕截图.png")
 **此时smartchart不会引用任何echarts, vue组件, 完全由您自已控制引入** , 你可以直接采用以下代码替换模板中的代码
```html
{% extends "echart/basesimple.html" %}{% block head %}

<!--head区域的引用或代码-->

{% endblock %}{% block body %}

<!--在此区间粘入body相关代码-->

{% endblock %}{% block javascript %}

<!--粘入js相关引用或代码-->

{% endblock %}{% block footer %}{% endblock %}

```

### 如何使用数据集接口
按照自由开发模式中, 新增一个图形, 然后修改数据集为通用且懒加载数据集
![输入图片说明](https://images.gitee.com/uploads/images/2022/0726/083916_7e8a92b9_5500438.png "屏幕截图.png")
修改对应图形编辑器, 使数据赋值给一个全局变量或vue
![](https://images.gitee.com/uploads/images/2022/0726/084154_bf4b4bb4_5500438.png "屏幕截图.png")
![](https://images.gitee.com/uploads/images/2022/0726/084420_53727f88_5500438.png "屏幕截图.png")

### 在IDE中开发
由于你在开发中仅需要用到filter_param及ds_refresh, 建意新建一个js文件, 文件内容:
```js
//下面定义全局变量, 发布时需放入smartchart模板的script标签中
var mypublicdata1 = xxxx;
.....

//以下为辅助方法, 发布时, 无需放入smartchart模板中
var filter_param = {};
function ds_refresh(num){
  if(num === 0){你对应的图形中赋值代码,调试代码}
  if(num === 1){....}
  ......
}

```
然后将这个js文件在你的项目中引用调试使用

### 如何部署到smartchart
打包完成后会有相应的css, js 和index.html文件, 将index.html中的代码复制贴粘到对应的模板区域中即可
- 上传css,js
- 修改css, js 相关引用路径
- 去除之前定义的js辅助开发文件引用, 如果有定义全局变量, 将全局变量定义复制到模板js区域
