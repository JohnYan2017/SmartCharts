
[Wiki](https://gitee.com/smartchart/smartchart/wikis/pages) \|
[Community](https://www.smartchart.cn/) \|
[Sponsors](https://www.smartchart.cn/) \|
[GitHub](https://github.com/JohnYan2017/Echarts-Django) \|
[Gitee](https://gitee.com/smartchart/smartchart)

<p align="center">
	<a href="https://www.smartchart.cn"><img src="http://smartchart.cn/static/smartui/img/smartlogo.png" width="45%"></a>
</p>
<p align="center">
	<strong>A NoBI platform that Connect Data to Insight.</strong>
</p>
<p align="center">
	<a href="https://www.smartchart.cn">https://www.smartchart.cn</a>
</p>

<p align="center">
    <img src="https://img.shields.io/badge/Release-V6.1-green.svg" alt="Downloads">
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
- 数据可视化,大屏,移动报表,数据中台,WEB应用的微代码NoBI(No Only BI)开发平台
- 简单, 敏捷, 高效, 通用化, 高度可定制化, 让你的项目瞬间档次提升
- 完全真正打通前后端, 支持图形数据联动,筛选,钻取, 支持几乎常见的所有数据库
- 积木式拖拽开发模式, 开箱即用, 安装简单, 依赖少, 适应各种平台
- 支持Django插件方式应用, 支持数据分析Jupyter方式应用
- 支持中国式报表类EXCEL开发, 支持3D场景大屏
- 内存加速技术, 让你的数据快人一步, 大幅减少数据库压力
- 所见即所得的拖拽开发模式, 无需在画布上设计
- 支持websocket, 数据填报设计,前端埋点, 数据服务API低代码开发
- 支持仪表盘备份恢复快照等, 满足企业级的版本控制开发上线流程要求
- 没有重复学习成本, 高度可定制化, 注意是高度可定制化!!

具体功能预览可观看视屏了解, [6.0介绍视屏](https://www.bilibili.com/video/BV1Md4y1h7iq) 

![大数据](https://www.smartchart.cn/media/editor/微信截图_20211202163316_20211202163647765791.png)
![smartchart](http://smartchart.cn/media/editor/smartvoice_20201224085323156045.png)

### 样列
- [SmartChart大屏样列-智慧城市_大数据大屏](https://magiccube.smartchart.cn/echart/?type=5 "大屏样列-智慧城市_大数据大屏")
- [SmartChart集成DataV](https://magiccube.smartchart.cn/echart/?type=3 "集成DATAV")
- [Smartchart图形数据联动](https://magiccube.smartchart.cn/echart/?type=4 "图形数据联动")
- [Smartchart分页表格数据下载](https://magiccube.smartchart.cn/echart/?type=26 "分页表格及下载")

### 快速开始
- 请务必先阅读 [SmartChart入门文档入口](https://help.smartchart.cn/ "SmartChart入门")
- 请务必先阅读 [SmartChart入门文档入口](https://help.smartchart.cn/ "SmartChart入门")
- 请务必先阅读 [SmartChart入门文档入口](https://help.smartchart.cn/ "SmartChart入门")
#### 安装Python环境
- 环境准备: 官方[最新Python下载链接](https://www.python.org/downloads/release/python-390/ "最新Python下载链接")
如果下载太慢, 可以到[淘宝镜象下载](https://npm.taobao.org/mirrors/python/3.9.0/ "淘宝镜象下载")
也可以直接下载[WINDOWS64位安装版](https://npm.taobao.org/mirrors/python/3.9.0/python-3.9.0-amd64.exe "WINDOWS64位安装版")
[MAC电脑安装版](http://npm.taobao.org/mirrors/python/3.9.0/python-3.9.0rc2-macosx10.9.pkg "MAC电脑安装版")

#### 安装SmartChart
```shell script
   pip3 install smartchart
   
   如果安装过程慢,建意使用
   pip3 install -i https://pypi.tuna.tsinghua.edu.cn/simple smartchart -U

   升级方法:
   pip3 install smartchart -U (升级)
```


### 应用场景一: 
数据可视化,大屏开发平台, 可以快速启动, 独立平台使用
```shell script
   本地命令行启动: 
   smartchart
   如果你是服务器部署,远程访问,服务端启动方式: 
   smartchart runserver 0.0.0.0:8000 --insecure --noreload
```
**管理员帐号密码: admin/admin, 请及时更改密码**

[SmartChart入门文档入口](https://help.smartchart.cn/ "SmartChart入门")


-------------------------------------------------------------------------------

### 应用场景二: 
如果你是数据分析爱好者, 在使用jupyter, Pandas等分析工具, 你可以当做可视化工具使用
**支持像pyecharts,Matplotlib等python绘图工具一样在Jupyter中使用, 更加方便, 更加炫酷**
**仅仅只有两个命令,get and set, 简化数据分析工作, 还能固化分析好的数据, 生成炫酷的仪表盘**


-------------------------------------------------------------------------------
### 应用场景三: 
你也可以使用smartchart制做报表, 在你的应用系统中嵌入报表

-------------------------------------------------------------------------------
### 应用场景四: 
如果你是django应用的开发者, 那么恭喜你, 它能无缝的作为你项目的一部分
数据可视化, 仪表盘, 低代码API开发平台的功能瞬间拥有


### 应用场景五:
smartchart不仅仅是一个可视化平台, 也是一个低代码服务API开发平台, 如果你需要对外提供
API服务, smartchart可以让你轻松完成

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
v5.5
- 调整模板中样式引用的顺序
- 增加数据集编辑器可调整区域大小
- 增加数据集编辑器查询时长显示
- 增加数据集编辑器显示表格功能
- 增加数据集增加历史查询结果显示与删除
- 优化初始化数据集的数据源问题
- 优化了一些图形端函数
- 隐藏系统数据集/仪表
- 增加pivot图形模板
v5.6
- 新增数据集懒加载功能
- 新增报表嵌入传入参数id加密方案
- 新增ds_setParam,ds_mapToList函数
- 数据集权限与图形权限绑定
- 连接池升级
- 项目名显示逻辑修改
- 优化加载速度
- 修复filter_param位置
- 修复图形最后一行注释后不显示
- 修复basevue未自动引入拖拽
- 修复数据集表格预览模式不超出宽度
- 修复django模式下上传自定义数据源问题
- 取消高级中的初始参数设定
- 移除滑动条样式
v5.7
优化模板中自由开发体验
- 在模板中进行图形新增不再自带栅格布局
- 新增插入栅格菜单
- 插入拖拽或栅格现在有两种智能模式
- 修改编辑器快捷键
- 增加功能清空上传的文件
- 增加样式列表
- 增加组件列表
- 增加工具菜单
- 增加UI组件列表
- 增加快速资源引入
- 合并数据集编辑功能
- 合并容器功能
- 现在炫酷背景边框字体的应用更顺畅
极大的优化了图形编辑器体验
- 帮助及图形商店的浏览状态将会保持
- 基础图形位置现在放在了合适的地方
- 增加自定义图形管理
- 图形编辑器增加echarts样列
- 增加ds_sort函数
大幅改善竖屏报表开发拖拽体验
- 竖向可屏幕外拖拽
- 带padding的容器问题
其它功能性增强
- 优化非激活数据集
- api服务增加了限流控制
- 加入一个内置数据分页查询下载模板一键应用
- 修复DIV编辑器插入不换行
- 增加mongodb连接器
- 增加ES连接器
- 增加数据集查询数量限定设定
- 现在定时刷新会保持当前的查询参数
- 增加资源可上传到通用静态目录
- 登录界面动画柔和化
- 仪表盘备份增加interval
- 修复_id问题
v6.0
- 新增复杂报表开发
- 新增3D场景开发
- 新增上线数据集零代码使用
- 新增界面化高级设定
- 新增背景切换
- 新增移动端适配支持
- 开发界面新增了隐藏容器
- 通用数据集/懒加载数据集使用更顺畅
- 新增apiconfig配制界面化
- 开发工具栏更清晰顺畅
- 数据集开发新增表及字段联想
- 新增Prometheus/influxdb连接
- 数据集序号自动化
- 全面优化了数据集数据预览
- 全面优化了拖拽体验
- 全面优化了开发界面
- 移除了body设定
v6.1
- 增加ds_loadpivot透视表组件
- 增加smtmail连接
- 增加仪表盘数据集模式
- 增强仪表盘开发页编辑框拖拽体验
- 数据集开发增加表,字段联想功能
- 升级并轻量化elementui
- 优化图形配置提示
- 优化数据集预览表格
- 优化图标
```


