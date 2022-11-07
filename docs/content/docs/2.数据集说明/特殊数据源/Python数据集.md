---
weight: 2
type : docs
bookFlatSection : false
---
#### 应用场景
当SQL查询无法满足你的需求, 你需要对查询后的结果进行处理, 或者你需要使用Excel的数据源, 甚至你需要对不同系统的数据进行查询, Python连接器可以帮到你
我们又称他为万能数据集， 你可以使用任何python语法，
 **需要把数据集的结果赋值给ds变量!!** 

首先你需要新建python连接器, 由于安全控制只允许超级管理员建立
![输入图片说明](https://images.gitee.com/uploads/images/2021/1102/155146_e51ab050_5500438.png "屏幕截图.png")

```python
# 内置函数说明
ds_get(id)    #输入目标数据集的id名, 可以获取目标数据集
ds_df(id)     #输入目标数据集的id名, 转化成pandas的df对象
ds_sql(conn_name, sql_str)     #输入连接池中的名称, SQL语句, 获取数据集
ds_list(df)   #将pandas的df对象转化成数据集

```

##### 使用方法样列说明
```python
# 读取Excel数据处理, 如需上传页面可参考"数据上传"说明
import pandas as pd
df = pd.read_excel('/Users/../smartdemo.xlsx', 'demo')
df = df.groupby('c3').agg({'qty':'sum'}).reset_index()
ds = ds_list(df)

#从数据集获取数据
ds=ds_get(12)
ds=ds[:15]

#从数据集获取数据转化成pandas对象处理
df = ds_df(12)
df = df.sort_values(by="出场数", ascending=False)
ds = ds_list(df)

#可以生成字典格式的数据集供多个图形使用
import pandas as pd
df = pd.read_excel('/Users/../smartdemo.xlsx', 'demo')
df1 = df.groupby('c3').agg({'qty':'sum'}).reset_index()
df2 = df.groupby(['province','c3']).agg({'qty':'sum'}).reset_index()
ds = {'df1': ds_list(df1), 'df2': ds_list(df2)}

#可以直接执行SQL
sql_str = '''select H1 as heroname, sum(qty) as 出场数 from T
/* where H2 = '$H2' */
group by H1 order by sum(qty) desc'''
ds = ds_sql('XXX', sql_str)
ds = ds[:10]

```