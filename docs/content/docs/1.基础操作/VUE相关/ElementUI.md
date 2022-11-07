---
weight: 2
---
#### 应用场景
- 非大屏场景应用
- 有较多交互场景的报表, 如筛选,表格,分页,下载等

#### 使用方法
如下图, base.html 改为 basevue.html
将自动开启加载vue和elementui
![输入图片说明](https://images.gitee.com/uploads/images/2022/0730/204702_84897ea2_5500438.png "屏幕截图.png")
 **注意vue的变量引用在 模板编辑界面中, 写法变更为 {[ ]}** 

[ElementUI组件说明](https://element.eleme.cn/)
[视屏参考](https://www.toutiao.com/video/7107842562462843395/)

#### 参考样列
新增一个数据集(点击金色的新增按钮, 这样会新增一个可拖拽的数据集)
修改相应的数据集及图形
数据集端
```sql
select  H1, H2, qty, rate from smartdemo2 limit 100
```
图形端
```
let dataset = __dataset__;
let tableData = ds_createMap_all(dataset);

vapp.d0={
    tableData: tableData
}
```
模板Body区端
```html
<div class="smtdrag" id="id_1639824145817">
    <template>
    <el-table
    stripe
    border
    height="100%"
      :data="d0.tableData"
      style="width: 100%">
     <el-table-column label="hero">
      <el-table-column
        prop="H1"
        label="H1"
        fixed
        :default-sort = "{prop: 'H2', order: 'descending'}"
        width="180">
      </el-table-column>
      <el-table-column
        prop="H2"
        label="H2"
        sortable
        width="180">
      </el-table-column>
     </el-table-column>
     
      <el-table-column
        sortable
        prop="qty"
        label="qty">
      </el-table-column>
      <el-table-column
        prop="rate"
        label="rate">
      </el-table-column>
    </el-table>
    </template>
  </div>
```