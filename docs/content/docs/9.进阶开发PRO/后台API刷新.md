---
weight: 6
type : docs
bookFlatSection : false
---

### 应用场景
- 有ETL流程，需要等待后台数据刷新完成后，再触发仪表盘的刷新，数据未完成刷新，仪表盘不刷新
- 针对有一些耗时的查询, 虽然smartchart有缓存加速, 但是在第一次刷新时可能不能达到极速
- 用户需要随时都能体验到极速的打开效果
> 使用后台API刷新，建意将仪表盘中数据集的缓存时间设置长一些，比如2天（2880分钟）

### 后台数据主动刷新接口
(购买专业版本后支持)
1. 你需要在setting.py中设定API_TOKEN
```
API_TOKEN = 'xxxxxxxx'
```
2. 找到你要刷新的仪表盘编码, 你可以在打开的仪表盘url上面找到这个type id

3. 后台访问如下api url即可
```
http://ip:端口/echart/refresh_ds/?type=你的报表ID&token=你设定的API_TOKEN

```

### 关于定时刷新
为保持产品的轻量化及坚持专业的产品做专业的事情, 归一化统一化的架构设计, 我们不会集成相关调度系统,
一般我们推荐使用您自有的调度工具或平台, 如airflow, 我们也有相关的配套产品

如果您仅仅是简单应用, 也无需使用专用调度来增加运维复杂度, 可以使用linux自带的即可
- 新建一个sh文件, 假设目录在/data/smartchart
```
vim refresh_smartchart.sh
```
- 写入需要刷新的脚本
```
echo  start refresh $(date "+%Y-%m-%d %H:%M:%S")
curl  http://ip:端口/echart/?type=你的报表ID1&token=你设定的API_TOKEN
curl  http://ip:端口/echart/?type=你的报表ID2&token=你设定的API_TOKEN
echo  end refresh $(date "+%Y-%m-%d %H:%M:%S")

```
> 如果你的网址是https, 可如下方法使用curl
```
curl -k --insecure "https://www.baidu.com”
```

- 修改为可执行文件
```
chmod 775 refresh_smartchart.sh
```

- 使用crontab来定时执行

```
# 编辑crontab
crontab -e
# 比如需要每天晚上5点10分执行
10 5 * * * /data/smartchart/refresh_smartchart.sh >>/data/smartchart/log.txt 2>&1

# 定时参数说明
*    *    *    *    *
-    -    -    -    -
|    |    |    |    |
|    |    |    |    +----- 星期中星期几 (0 - 6) (星期天 为0)
|    |    |    +---------- 月份 (1 - 12) 
|    |    +--------------- 一个月中的第几天 (1 - 31)
|    +-------------------- 小时 (0 - 23)
+------------------------- 分钟 (0 - 59)
```

