---
weight: 2
type : docs
bookFlatSection : false
---

SmartChart标准数据集你可以想象为一个EXCEL的二维表, 有行和列
你直接在数据集开发界面填写SQL即可

### 标准图形的数据表类型
#### A类数据源
```sql
比如你的原始数据库中表的格式如下, 表名tb_name:
城市    户型    数量
长沙    A       12
长沙    A       23
上海    B       19

查询的sql: select 城市,户型,sum(数量) AS 数量 from tb_name group by 城市,户型
正常的查询的结果为:
[['城市','户型','数量'],
 ['长沙','A',35],
 ['上海','B ',19]]
由于生成的数据格式第二行是 [字符,字符,数值], 后台会自动进行转列动作, 
生成图表更容易使用格式:
[['Categroy','A','B'],
 ['长沙',     35, 0],
 ['上海',     0, 19]]
```
 
#### B类数据源
```sql
再比如我们有一个表的数据格式, 指标是展开的:
城市    A     B
长沙    10    12
上海    11    19
长沙    9     10

我们可以写的sql是:
select 城市, sum(A) as A, sum(B) as B from tb_name group by 城市
这样得到的结果是:
[['城市','A','B'],
 ['长沙', 19, 22],
 ['上海', 11, 19]]
和我们的标准格式也是一样的

```

### SQL多段查询
有时你一个数据集可能只用一个SQL查询还不够，比如你需要一个清单数据，同时你需要一个汇总数据做为说明在图形中显示，这样你就需要使用多条SQL语句，在数据集中的写法你只需要用分号隔开，如：
```sql
select ... from xxx;
select ..... from xxxxxxx

传递到图形中的格式为：
{"df0":[[...]]. "df1":[[......]]}
df0, df1分别对应的是第一段和第二段查询
```
[多段查询使用视屏参考](https://www.ixigua.com/6928570043022180876)


### 支持的数据源：
| 数据库 | 驱动填写 | 需安装 | 使用说明 |
| :-----| :----: | :----: | :----: |
| Mysql | mysql | 默认支持 |  |
| Mysql连接池 | mysqlpool | |  |
| Sqlite | sqlite |默认支持 | 连接地址填写绝对路径 |
| API |任意|默认支持 | 参考数据集说明文档 |
| EXCEL | 任意|默认支持 | 参考数据集说明文档 |
| SQL Server|mssql | 需安装 pip install pymssql |  |
| SQL Server连接池|mssqlpool |  |  |
| ORACLE |oracle| pip install cx_Oracle |  |
| ORACLE连接池 |oraclepool|  |  |
| PostgreSql |gp| pip install psycopg2 |  |
| GP |gp| pip install psycopg2 |  |
| Impala |impala| pip install impyla |  |
| Hive |hive| pip install impyla |  |
| DB2 |db2| pip install ibm_db |  |
| 达梦 |dm| pip install dmPython |  |
| Python |python| pip install pandas, openpyxl | 参考数据集->特殊数据源 |
| Redis |redis| pip install redis | 参考数据集->特殊数据源 |
| Mongodb |mongodb| pip install pymongo | 参考数据集->特殊数据源 |
| Clickhouse |clickhouse| pip install clickhouse_driver |  |
| Elasticsearch |es| pip install elasticsearch==7.13.0 | 参考数据集->特殊数据源 |
| Sqlalchemy |sqlalchemy| pip install sqlalchemy | 参考数据集->特殊数据源 |
| JDBC |jdbc| pip install JayDeBeApi | 参考数据集->特殊数据源 |
| 自定义 |自定义| 用户自由定义 | 参考数据集->特殊数据源 |