
[Wiki](https://gitee.com/smartchart/smartchart/wikis/pages) \|
[Community](https://www.smartchart.cn/) \|
[Sponsors](https://www.smartchart.cn/) \|
[GitHub](https://github.com/JohnYan2017/Echarts-Django) \|
[Gitee](https://gitee.com/smartchart/smartchart)

<p align="center">
	<a href="https://www.smartchart.cn"><img src="http://smartchart.cn/static/smartui/img/smartlogo.png" width="45%"></a>
</p>
<p align="center">
	<strong>A platform that Connect Data to Echarts.</strong>
</p>
<p align="center">
	<a href="https://www.smartchart.cn">https://www.smartchart.cn</a>
</p>

<p align="center">
    <img src="https://img.shields.io/badge/Release-V5.4-green.svg" alt="Downloads">
	<a target="_blank" href="https://www.python.org/downloads/release/python-390/">
		<img src="https://img.shields.io/badge/Python-3.6+-green.svg" />
	</a>
	<a href='https://gitee.com/smartchart/smartchart/members'><img src='https://gitee.com/smartchart/smartchart/badge/fork.svg?theme=dark' alt='fork'></a>
	<a href='https://gitee.com/smartchart/smartchart/stargazers'><img src='https://gitee.com/smartchart/smartchart/badge/star.svg?theme=dark' alt='star'></a>
	<a target="_blank" href='https://github.com/JohnYan2017/Echarts-Django'>
		<img src="https://img.shields.io/github/stars/JohnYan2017/Echarts-Django.svg?style=social" alt="github star"/>
	</a>
</p>
<p align="center">
	<a href="https://qm.qq.com/cgi-bin/qm/qr?k=eC34KwVvEtMvfh8Zyn1RSfYlzZvuvm7i&jump_from=webapi"><img src="https://img.shields.io/badge/QQ群-476715246-orange"/></a>
   <a target="_blank" href="https://www.smartchart.cn">
   <img src="https://img.shields.io/badge/Author-John%20Yan-ff69b4.svg" alt="Downloads">
 </a>
 <a target="_blank" href="https://www.smartchart.cn">
   <img src="https://img.shields.io/badge/Copyright%20-@smartchart.cn-%23ff3f59.svg" alt="Downloads">
 </a>
</p>

-------------------------------------------------------------------------------

[**English Documentation**](README-EN.md)

-------------------------------------------------------------------------------

### 简介
- Smartchart是数据可视化,大屏,移动报表,WEB应用的微代码开发平台
- 简单, 敏捷, 高效, 通用化, 高度可定制化, 让你的项目瞬间档次提升
- 完全真正打通前后端, 支持图形数据联动,筛选,钻取, 支持几乎常见的所有数据库
- 积木式拖拽开发模式, 开箱即用, 安装简单, 依赖少, 适应各种平台
- 支持Django App插件方式应用, 支持数据分析Jupyter方式应用
- 内存加速技术, 让你的数据快人一步, 大幅减少数据库压力
- 所见即所得的拖拽开发模式, 无需在画布上设计
- 支持websocket, 数据填报设计,前端埋点
- 支持仪表盘备份恢复快照等, 满足企业级的版本控制开发上线流程要求
- 没有重复学习成本, 高度可定制化, 注意是高度可定制化!!

![大数据](https://www.smartchart.cn/media/editor/微信截图_20211202163316_20211202163647765791.png)
![smartchart](http://smartchart.cn/media/editor/smartvoice_20201224085323156045.png)

### 样列
- [SmartChart大屏样列-智慧城市_大数据大屏](https://magiccube.smartchart.cn/echart/?type=5 "大屏样列-智慧城市_大数据大屏")
- [SmartChart集成DataV](https://magiccube.smartchart.cn/echart/?type=3 "集成DATAV")
- [Smartchart图形数据联动](https://magiccube.smartchart.cn/echart/?type=4 "图形数据联动")

### 快速开始
#### 安装Python环境
- 环境准备: 官方[最新Python下载链接](https://www.python.org/downloads/release/python-390/ "最新Python下载链接")
如果下载太慢, 可以到[淘宝镜象下载](https://npm.taobao.org/mirrors/python/3.9.0/ "淘宝镜象下载")
也可以直接下载[WINDOWS64位安装版](https://npm.taobao.org/mirrors/python/3.9.0/python-3.9.0-amd64.exe "WINDOWS64位安装版")
[MAC电脑安装版](http://npm.taobao.org/mirrors/python/3.9.0/python-3.9.0rc2-macosx10.9.pkg "MAC电脑安装版")
- [Window平台安装视屏介绍](https://www.ixigua.com/6910413586208653837?id=6901867671193649668 "Window平台安装视屏介绍")
**注意: Windows安装Python时需选中"Add to Path"**

#### 安装SmartChart
```shell script
   pip3 install smartchart
   
   如果安装过程慢,建意使用
   pip3 install -i https://pypi.tuna.tsinghua.edu.cn/simple smartchart -U

   升级方法:
   pip3 install smartchart -U (升级)
```

 [SmartChart入门文档入口](https://gitee.com/smartchart/smartchart/wikis/ "SmartChart入门")


### 应用场景一: 
如果你仅需要一个数据可视化,大屏开发平台, 可以快速启动, 独立平台使用
```shell script
   本地命令行启动: 
   smartchart
   如果你是服务器部署,远程访问,服务端启动方式: 
   smartchart runserver 0.0.0.0:8000 --insecure --noreload
```
**管理员帐号密码: admin/admin, 请及时更改密码**

[SmartChart入门文档入口](https://gitee.com/smartchart/smartchart/wikis/ "SmartChart入门")


-------------------------------------------------------------------------------

### 应用场景二: 
如果你是数据分析爱好者, 在使用jupyter, Pandas等分析工具, 你可以当做可视化工具使用
**支持像pyecharts,Matplotlib等python绘图工具一样在Jupyter中使用, 更加方便, 更加炫酷**
**仅仅只有两个命令,get and set, 简化数据分析工作, 还能固化分析好的数据, 生成炫酷的仪表盘**
[Jupyter中使用SmartChart入门文档](https://gitee.com/smartchart/smartchart/wikis/6.Jupyter%E5%BA%94%E7%94%A8/%E5%9C%A8Jupyter%E4%B8%AD%E4%BD%BF%E7%94%A8%E6%8C%87%E5%BC%95 "Jupyter中使用SmartChart入门文档")


-------------------------------------------------------------------------------
### 应用场景三: 
你也可以使用smartchart制做报表, 在你的应用系统中嵌入报表
[嵌入SmartChart报表入门文档](https://gitee.com/smartchart/smartchart/wikis/7.%E6%8A%A5%E8%A1%A8%E5%B5%8C%E5%85%A5/%E7%AE%80%E5%8D%95%E5%B5%8C%E5%85%A5 "嵌入SmartChart报表入门文档")

-------------------------------------------------------------------------------
### 应用场景四: 
如果你是django应用的开发者, 那么恭喜你, 它能无缝的作为你项目的一部分
数据可视化, 仪表盘, 低代码API开发平台的功能瞬间拥有
[在Django中应用Smartchart入门文档](https://gitee.com/smartchart/smartchart/wikis/8.Django%E5%BA%94%E7%94%A8/%E5%B5%8C%E5%85%A5Django%20Apps "在Django中应用Smartchart")

- django新手推荐下载此项目使用
```shell script
请直接下载gitee/github的项目后
pip install smartchart
启动方式 python manage.py runserver
帐号: admin/admin
```

### 应用场景五:
smartchart不仅仅是一个可视化平台, 也是一个低代码服务API开发平台, 如果你需要对外提供
API服务, smartchart可以让你轻松完成
[Smartchart低代码API开发](https://gitee.com/smartchart/smartchart/wikis/9.%E8%BF%9B%E9%98%B6%E5%BC%80%E5%8F%91PRO/%E6%95%B0%E6%8D%AE%E6%9C%8D%E5%8A%A1API "Smartchart低代码API开发")


------------------------------------------------
### 数据库支持说明
Smartchart理论上可以支持任意的数据源, 详见文档中使用说明


### 联系我们与帮助
你也可以加入QQ群进行普通问题讨论
**QQ群: 476715246  暗号: smartchart**

-------------------------------------------------------------------------------

#### Change Log
```shell script
2020/12/14  静态资源本地化
v3.9.8.2    支持所有常见数据库,支持VUE,DATAV
v3.9.8.7    支持Jupyter,支持一键分享和应用dashboard模板
v3.9.8.9    帐号绑定功能上线
v3.9.8.10   用户自定义图形管理上线
v3.9.8.17   支持最新的Echarts5.0, 优化加载速度
v3.9.8.20   用户自定义图形管理功能升级
v3.9.8.23   Echarts升级5.0.1, 支持一个数据集对应多查询, 资源本地化
v3.9.9.0    print函数优化,新增数据透视函数,个人静态资源路径显示, db2支持
v3.9.9.1    开发界面美化
v3.9.9.5    开发界面优化,fix定时刷新BUG,新增批量数据集删除
v3.9.9.7    增加python连接器,数据池,自定义主模板,优化开发界面
v3.9.9.10   DIV设定中可以写css,新增内置动态表格,优化布局支持,增加config文件
v3.9.9.12   优化后台数据处理性能,Jupyter使用体验
v3.9.9.16   新增模板编辑功能,增加嵌入报表TOKEN方式,优化编辑界面,优化连接池选择
v3.9.9.18   修复vue bug, 增加elementUI支持, 优化DataV开发体验
v3.9.9.24   模板开发界面增加编辑功能,自动建立数据集,新增数据集测试功能,Echarts升级到5.2
v3.9.9.25   增加变更未保存提示,数据集选择执行,优化保存模板重复提交的问题
v3.9.9.28   Admin适配UI, 资源文件优化
v3.9.9.33   增加文件上传功能,增加basesimple模板,优化开发菜单
v4.0
- 取消boostrap布局,采用全新的24格或12格网格布局,更小的文件引用,更方便的功能
- 增加拖拽布局方式,同时不损失自由开发模式, 可混合使用
- 增加HTML组件区别与数据集组件
- 更为用户友好的首页,全新的UI体验, 自动识别用户与开发者身份
- 优化了开发菜单, 增强用户开发体验
- 数据集开发界面完成数据源,后台同步, 前端同步修改
v5.0
- 全新开发UI体验, 优化拖拽
- 完全移除boostrap, 减少安装包
- 全部40个图形主题开放
- 新增自定义主题开发功能,新增调色器
- 新增嵌入和弹出窗口开发切换
- 联动钻取界面化
- 图形编辑器优化增加常用图形一键导入
- 增加模板t3兼容3.0报表
- 增加数据集开发可设定图形联动
- 增加数据集开发可设定缓存及定时
- 增加数据集开发可一键转化为共享数据集
v5.1
- 新增离线初始化DB, 新增数据集对外服务api配置
- 静态资源优化, 增加VIP模板功能
- 增加一键实现滚动表格及图片轮播图形, 增加一键实现边框效果
- 增强体验去除默认加载地图js, 所有非常用js改为动态加载
v5.1.10 增加rem与px互转功能,优化模板开发体验
v5.2
- 优化通用数据集开发
- 自由模式开发序号问题解决
- 增加频幕日志打印
- 增加样式可视化开发
- 增加仪表盘版本控制,备份恢复
- 增加仪表盘服务器之间同步
- 增加资源文件上传功能
- 增加对clickhouse,达梦等数据库支持
- 增加JDBC连接器
- Echarts升级到5.3
- 首页增加主题选择
- 仪表盘V,R,E增加图标防呆
v5.3
- 合并仪表盘上传下载到同一界面,并优化体验
- 增加LineUp图形的支持
- 优化模板自由开发体验, 现在拖拽后能自动同步
- 增加开发过程快速备份仪表盘
- 增加安全模式,在图表异常时可使用此模式进入
v5.4
- 增加图形管理
- 增加可外部调用定时刷新数据集
- 增强版本控制功能
- 优化自动保存拖拽
- 增加数据填报功能
- 优化数据服务及嵌入认证方式
```


