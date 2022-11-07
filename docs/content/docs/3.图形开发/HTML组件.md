---
weight: 4
type : docs
bookFlatSection : false
---

### 应用场景
- 输入控件,如输入框,筛选器,多选,按钮...
- 显示组件, 文本, 图片, 视屏...
- 表格组件
> 如果你还不熟悉html, 建意先花几分钟看下文档, 推荐 [HTML基础](https://www.runoob.com/html/html-tutorial.html)
> 实际应用中有不熟悉的组件, 你都可以通过baidu搜索到, 如时间选择器
![输入图片说明](https://images.gitee.com/uploads/images/2022/0731/211441_f3eb7ce4_5500438.png "屏幕截图.png")

### 如何将html组件转化为smartchart组件
比如我们要实现一个有多选项和按钮的网页元素
![输入图片说明](https://images.gitee.com/uploads/images/2021/0701/150141_1e0ba921_5500438.png "屏幕截图.png")

从各大搜索平台上我们可以找到html的代码是：
```html
<label><input type="checkbox">孙尚香</label>
.....
<button id='id_select0'>提交</button>
```
那么我们可以直接在图形编辑器写上
```js
let dataset=__dataset__;
let table = '';
table = `<label><input type="checkbox">孙一香</label>
         <label><input type="checkbox">孙二香</label>
         <label><input type="checkbox">孙三香</label>`
table = table + "<button id='id_select0'>提交</button>"

dom__name__.innerHTML=table;
```
但是由于我们是要通过传入的数据动态变化的，所以只需要做简单修改
```js
let dataset=__dataset__;
let table = '';
for (let i=1;i<dataset.length;i++){
    table = `${table}<label><input type="checkbox"/>${dataset[i][0]}</label> `
}
table = table + "<button id='id_select__name__'>提交</button>"

dom__name__.innerHTML=table;
```
所有html你都可以进行转化成smartchart组件，
你可以通过学习”万能表格系列视屏“ 来了解通用组件开发
[第一波](https://www.bilibili.com/video/BV1Ma41187oZ)
[第二波](https://www.bilibili.com/video/BV1SR4y1F7Pp)
[第三波](https://www.bilibili.com/video/BV11P4y1T7gX)


