### 应用场景
> 你需要在jupyter中通过smartchart分享的数据集获取数据进行分析
> 你有很多线下数据需要进行个性化分析, 然后制做仪表盘
> 在Jupyter的数据分析过程中, 你需要快速生成图形
> 大屏或报表有部分数据集是需要能过复杂的分析生成的


Smartchart支持像pyecharts, Matplotlib 等python绘图工具一样在Jupyter中使用, 
但她更加方便, 更加炫酷 和 通用化, 
不仅仅是一个绘图工具, 而且是一个平台

我们有什么特色:
> 使用上手非常简单, 仅仅只有两个命令, get and set, 配置项采用原生的Echarts配置, 无重复学习成本, 使用顺滑
> 支持Echarts所有功能, 可定制化程度高, 显示效果好, 可嵌入也可以弹出窗口显示, 也可以dashboard中显示
> 数据可以固化存储, 采用smartchart Portal可以直接拼接炫酷大屏


[Smartchart与Pandas](https://www.ixigua.com/6910413586208653837?id=6918162479646245389 "smartchart")
[Smartchart与Jupyter](https://www.ixigua.com/6910413586208653837?id=6917989046132310535 "smartchart")
[SmartChart大屏新思路](https://www.ixigua.com/6921133676189352456 "smartchart")

![输入图片说明](https://images.gitee.com/uploads/images/2021/0701/114301_76f82bab_5500438.png "屏幕截图.png")


### 安装使用方法
```
你需要在jupyter相同的python环境中安装smartchart客户端
pip install smartchart
或pip3 install -i https://pypi.tuna.tsinghua.edu.cn/simple smartchart

如果你只是需要连接已部署好的smartchart服务端, 本地无需启动smartchart
```
### 快速开始

初始化认证:
第一次使用时, 打开jupyter后, 需要设定默认用户和smartchart服务端url
同一个环境, 只需初始化一次, 后面无需再设定
```python
from smart_chart import Smart
Smart().set_auth('用户名', '密码',url = 'http://xxxxx')
```
如果smartchart服务端在本地, 可以省略url
```python
Smart().set_auth('用户名', '密码')
```

使用方法:
```python
from smart_chart import Smart
mysmart = Smart()
dataset = [['A','B','C'],[12,34,23],[22,33,37]]
#把数据写入临时数据集并显示图形
mysmart.set(1,dataset)
#随意命名临时数据集, 不一定需要smartchart中数据集已有的
mysmart.set('DD', dataset)

#从已有的数据集中获取数据(格式参考smartchart数据集)
ds1 = mysmart.get(1)
ds2 = mysmart.get('DD')
```

### 修改图形显示
方法一: 你可以在图形菜单中选择内置图形或主题
方法二: set默认是表格显示,你也可通过名称加前缀 bar, line, pie进行修改

```python
mysmart.set('barxxx', dataset)  #显示柱形图, 另外还有linexxx, piexxx
```
方法三: 简单图形,可能无法满足你的个性化要求, 你可以采用实例化数据集的方式后做出炫酷的自定义图形

```python
mysmart.set('myds_1', dataset, push=1)  #参数push=1, 将实例化数据集
```
实例化的数据集, 在图形编辑区点击, 可以进入定制化图形开发, 可使用原生的Echarts配置和实时调试,或直接使用社区图形(第一次使用,有一个登记的过程, 按提示进行)
![输入图片说明](https://images.gitee.com/uploads/images/2021/0701/114330_fa9da6af_5500438.png "屏幕截图.png")

方法四: 如何在非实例化的数据集中使用自定义图形进行临时显示
假如你已经实例化并自定义了图形, 比如 'myds_1', 你可以直接用它的名称来set
```python
#不加push, 将使用新的数据采用myds_1的图形临时显示, 而不会改变原myds_1的数据
mysmart.set('myds_1', dataset) 
```

### 显示设定参数
你可以通过参数来设定图形的高宽, 是否嵌入等个性化要求
```python
# width, height指定图形嵌入显示的宽高
# embed 默认不嵌入, embed=1 嵌入, embed=0 不嵌入
# editor 是否显示图形菜单, 1显示, 0不显示
# push 是否持久化数据集 push=1, 无则新建有则保存数据
# url 报表访问的url,默认是localhost

#可以全局初始化设定
mysmart = Smart(width=xx, height=xx, embed=1, editor='')
#也可以全局单独进行设定
mysmart.url = 'http://ip:8000'
mysmart.embed = 1

#也可以针对单独的一个图形设定
mysmart.set(1,dataset,embed=1,height=200,editor=0)
```

### SmartChart与Pandas
Smartchart的set支持直接set Pandas的dataframe对象
```python
from smart_chart import Smart
import pandas as pd
mysmart = Smart()
df = pd.read_excel('manual_smartdemo.xlsx', 'sheet1')
mysmart.set('excelsample', df.sample(10))


df1 = df.groupby('province').agg({'qty':'sum'}).reset_index()
mysmart.set('ec_df1', df1, push=1)

df2 = df.groupby('c1').agg({'qty':'sum'}).reset_index()
mysmart.set('ec_df2', df2, push=1)

df4 = df.groupby('province').agg({'qty':'count'}).reset_index()
mysmart.set('ec_df4', df1, push=1)


df3 = df.groupby('c3').agg({'qty':'sum'}).reset_index()
print(df3)
df3.loc[1, 'qty'] = df3.loc[1, 'qty'] * 100
print(df3)

mysmart.set('ec_df3', df3, push=1)

#mysmart.set('pie0', df1)
#df2 = df.groupby(['province','c3']).agg({'qty':'sum'}).reset_index()
#print(df2)
#mysmart.set('ssss', df2)
#print(mysmart.get(15))

```

![输入图片说明](https://images.gitee.com/uploads/images/2021/0701/114403_9ec1ed28_5500438.png "屏幕截图.png")