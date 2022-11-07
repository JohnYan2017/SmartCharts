---
weight: 1
type : docs
bookFlatSection : false
---

对接外部API取数, 注意返回一定要是JSON格式
你只需要在数据集编辑框中如下输入
```json
-- GET 方法:
dataset= {
"url":"https://www.smartchart.cn/smartdata/api/?i=loaddataset1&j=1"
}

-- POST 方法:
dataset= {
"url":"https://www.smartchart.cn/smartdata/api",
"method":"POST",
"data":{"i":"loaddataset1", "j":"1"}
 ...
}

```

例如你可以传入参数做出联动效果

 ```json
dataset= {
"url":"https://www.smartchart.cn/smartdata/api",
"method":"POST",
"data":{"i":"loaddataset1", "j":"/*$参数名*/"}
 ...
}
```

你也可以增加header等认证方式

 ```json
dataset= {
"url":"https://www.smartchart.cn/smartdata/api",
"method":"GET",
"headers":{"Cookie":"xxxxxxx"}
 ...
}
```