#### 使用方法
连接池正常配置即可
数据集开发中，填写查询需求：
![输入图片说明](https://images.gitee.com/uploads/images/2022/0805/125528_63d6e63c_5500438.png "屏幕截图.png")
```
{"db": "db1", "table": "tb1", "filter": {"name": "Zarten"}, 
"projection": {"_id": 0}, "sort": [["_id", 1]], "limit": 10}
```
由于返回的字典格式， 如需转化成二维数组， 可使图形中的转化函数ds_mapToList
```
let dataset=ds_mapToList(__dataset__);
```

#### 参数说明：
除table，其它都为可选参数
|参数|说明|样列|
| :-----| :----: | :----: |
|db|数库名,默认连接设定中db名||
|table|表名[必填]||
|filter|筛选项,具体用法参考下文|{"name": "Zarten","date":"2020-10-01"}|
|projection|显示列|{"name": 1,"date":1}|
|sort|排序，-1为降序|[["date", -1]]|
|limit|限定返回数量||

#### filter条件说明
且条件
```
{"age":{"$gt":22}, "name":{"$regex":"user"}}
```
或条件
```
{ "$or": [ {"age": {"$gt": 22}}, {"name": {"$regex": "user"}} ] }
```

```
比较查询
$lt和<，$lte和<=，$gt和>，gte和>=，ne和!=是一一对应的
{"field_name": {"$lt": value, "$gt": value}}
关联查询$in和$nin
{"field_name": {"$in": [1,5,8]}}
$regex为模糊查询的字符串提供正则表达式功能
{"$or": [{"field_name": {'$regex': value}},{"field_name2": {"$regex": value}}]}
```

