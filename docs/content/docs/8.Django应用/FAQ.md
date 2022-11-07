---
weight: 2
type : docs
bookFlatSection : false
---
### FAQ
---------------------------------------------------
如果你想对smartchart前端二次开发或关闭debug模式后找不到资源
在settings中加入
```
STATIC_ROOT = os.path.join(BASE_DIR, "static")
```
执行以下命令将静态文件静态文件克隆到根目录
```shell
python3 manage.py collectstatic
```
----------------------------------------------------


