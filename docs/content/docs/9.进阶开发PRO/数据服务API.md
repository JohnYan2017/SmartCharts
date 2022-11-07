---
weight: 2
type : docs
bookFlatSection : false
---
### SmartChart的数据集功能, 可以非常方便的实现数据对外微服务

### 权限设定
- 如果你使用的是自已搭建的django项目, 你需要在项目的根目录下新建一个JSON文件, 
  如果是使用smartchart启动的, 配置文件在项目的安装目录下可以找到
  名为apiconfig.json, 
- 比如需要调用API的用户名为test 和 test2，用户名需要是在你的用户设定中存在的,内容如下:
```json
{
  "test": {
    "token": "smartchart"
  },
  "test2": {
   "token": "smartchartxxx",
   "host": ["10.10.10.10","10.10.10.23"],
   "limit': 60,
   "log":1,
   "cors": 1
 }
}
```
> 可选设定参考test2
> host:API白名单配置，limit:一分钟内可调用次数, log:日志记录方式. 
> cors:永许跨域访问

- 然后你只需要将你的数据集中的权限设定给对应的用户即可

### 请求方式
#### 加密接口请求方式（推荐）
#### GET 请求
```python
#接口请求格式: 
url: /echart/dataset_api/?visitor=xxx&token=xxx&type=xxx&stamp=xxxxx&param={"xx":"xxx","xx":"xxxx"}
# 参数说明
visitor: 用户名
type: 接口数据集ID
stamp: 时间戳(1970年1月1日到生成时间的毫秒数)
token: 采用sha1加密, token=SHA1(秘钥 + stamp + Visitor + Type)
param: 传入的参数值(可选)，格式json字符串，如多个参数: '{"参数A":"xxxx", "参数B":"xxxx"}'
# 接口返回格式
Json: 
{
"data":[[]],
"result":"success",
"maxpg":1,
"pg":1
}
返回值说明：
data : 二维数组，第一行为表头， 样列数据
[["heroname", "qty"],["镜",658],["猪八戒",591]]
result : success 或 error
maxpg/pg : GET请求固定为1不分页

```

#### POST请求(适用于后台定时同步数据，查询请用GET请求方法)
```python
#接口请求格式:
url: /echart/dataset_api/
# 请求参数说明
data: 
{
"visitor":"xxx",
"token":"xxx",
"stamp":xxxxx,
"type":"xxx",     
"pagesize":"xxx",  
"pg":"xxx",       
"param":'{"xxx":"xxxx"}'  
}
# 参数说明
visitor: 用户名
type: 接口数据集ID
stamp: 时间戳(1970年1月1日到生成时间的毫秒数)
token: 采用sha1加密, token=SHA1(秘钥 + stamp + Visitor + Type)
Pagesize: 采用分页，每页的数据量大小
pg: 返回第几页
param: 传入的参数值，格式json字符串，如多个参数
'{"参数A":"xxxx", "参数B":"xxxx"}'


#接口返回格式
Json: 
{
"data":[[]],
"result":"success",
"maxpg":xxx,  #最大页数
"pg":xx,  #当前页数
"casheflag": xx,  #如果是999说明命中缓存
"total":xx,   #总条数
}

```
>注意：
>只有post是分页的, 第一页是带标题的， 后面页不带标题
>由于post方式会使用缓存进行分页,如命中缓存传参不会生效，小数据量请使用get方式请求
>不要请求大数据量，大量数据请采用limit, offset传参方式进行分页

#### 不加密请求方式(简单但不安全）
```
GET 请求
#接口请求格式: 
url: /echart/dataset_api/?visitor=xxx&token=xxx&type=xxx 数据集名或id名
#接口返回格式
Json: 
{
"data":[[]],
"result":"success",
"maxpg":1,
"pg":1
}

POST请求
#接口请求格式:
url: /echart/dataset_api/
data: 
{
"visitor":"xxx",
"token":"xxx",
"type":"xxx",      #数据集名或id名
"pagesize":"xxx",  #每页数据条数
"pg":"xxx",        #返回第几页
"param":'{"xxx":"xxxx"}'  #参数可选
}
#接口返回格式
Json: 
{
"data":[[]],
"result":"success",
"maxpg":xxx,  #最大页数
"pg":xx,  #当前页数
"casheflag": xx,  #如果是999说明命中缓存
"total":xx,   #总条数
}

注意：
只有post是分页的, 第一页是带标题的， 后面页不带标题
由于post方式会使用缓存, 小数据量建议你使用get方式请求


```