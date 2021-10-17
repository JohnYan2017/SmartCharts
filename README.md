
[Wiki](https://gitee.com/smartchart/smartchart/wikis/pages) \|
[Community](https://www.smartchart.cn/) \|
[Sponsors](https://www.smartchart.cn/) \|
[GitHub](https://github.com/JohnYan2017/Echarts-Django) \|
[Gitee](https://gitee.com/smartchart/smartchart)

<p align="center">
	<a href="https://www.smartchart.cn"><img src="https://www.smartchart.cn/media/editor/WechatIMG51_20210117224243671223.png" width="45%"></a>
</p>
<p align="center">
	<strong>A platform that Connect Data to Echarts.</strong>
</p>
<p align="center">
	<a href="https://www.smartchart.cn">https://www.smartchart.cn</a>
</p>

<p align="center">
    <img src="https://img.shields.io/badge/Release-V3.9.9-green.svg" alt="Downloads">
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
- SmartChart基于Echarts/Django的微代码开发平台,适用于任何WEB项目
- 简单, 敏捷, 高效,通用化, 高度可定制化, 让你的项目瞬间档次提升, 比拖拽开发更方便
- 完全真正打通前后端, 支持图形数据联动,筛选,钻取, 支持几乎常见的所有数据库
- 积木式的开发模式, 开箱即用, 安装简单, 依赖少, 适应各种平台
- 高度可定制化, 注意是高度可定制化!!

![舆情分析](https://images.gitee.com/uploads/images/2019/0614/130021_887dc34c_2327318.png "舆情分析.png")
![smartchart](http://smartchart.cn/media/editor/qyj01show_20210306112736437498.png)

### 样列
- [SmartChart大屏样列-智慧城市_大数据大屏](https://www.smartchart.cn/echart/?type=智慧城市_大数据大屏 "大屏样列-智慧城市_大数据大屏")
- [SmartChart集成DataV](https://www.smartchart.cn/echart/?type=Smartchart_DataV "集成DATAV")
- [Smartchart图形数据联动](https://www.smartchart.cn/echart/?type=评论分析 "图形数据联动")

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

### 应用场景一: 快速启动, 独立平台使用(推荐!)
```shell script
   本地命令行启动: 
   smartchart
   如果你是服务器部署,远程访问,服务端启动方式: 
   smartchart runserver 0.0.0.0:8000 --insecure
```
**管理员帐号密码: admin/admin, 请及时更改密码**

 [SmartChart入门文档入口](https://gitee.com/smartchart/smartchart/wikis/pages "SmartChart入门")


-------------------------------------------------------------------------------

### 应用场景二: 在python,Jupyter中作为数据分析使用
**支持像pyecharts,Matplotlib等python绘图工具一样在Jupyter中使用, 更加方便, 更加炫酷**
**仅仅只有两个命令,get and set, 简化数据分析工作**
![](https://www.smartchart.cn/media/editor/WX20210103-181343@2x_20210103181856302575.png)


-------------------------------------------------------------------------------
### 应用场景三: 外部系统对接方式
```python
# 如果需要，你可以采用单点登录的方式与smartchart进行对接嵌入
'/echart/smart_login?id=xxx&stamp=xxx&token=xxx&url=/'
'''
参数说明：
id: 用户名（在smartchart平台中管理）
stamp: 时间戳(1970年1月1日到生成时间的毫秒数)
token: 采用sha1加密, token=SHA1(链接秘钥+stamp+id)
	   链接秘钥默认smartchart,
	   请在环境变量设定SMART_KEY替换（重要）
url: 登录成功后跳转链接
'''

# 提示：为了数据安全,对外生产环境使用,务必设定你的环境变量SMART_KEY
```

-------------------------------------------------------------------------------
### 应用场景四: 在django项目中当作apps使用
**django新手不建意使用此方法**
- django新手推荐下载此项目使用
```shell script
请直接下载gitee/github的项目后
pip install smartchart
启动方式 python manage.py runserver
帐号: admin/amdin
```

- 如果你动手能力强, 对django熟悉的, 可以参考Wiki中的说明进行自行加入


### 数据库支持说明

- 原生支持的有mysql,sqlite,API,EXCEL数据, 你可以使用python连接器扩展任意数据源
- SQL Server     需安装 pip install pymssql
- ORACLE         需安装 pip install cx_Oracle
- GP,Postgrep    需安装 pip install psycopg2
- Impala         需安装 pip install impyla
- DB2            需安装 pip install ibm_db
- Python         需安装 pip install pandas, openpyxl
- ....

### 联系我们与帮助
**安装及使用问题,可加以下微信号**

<img src="https://www.smartchart.cn/media/editor/QQ20201201-140615@2x_20201201140657981573.png" alt="smartchart" height="150" />

你也可以加入QQ群进行普通问题讨论

**QQ群: 476715246  暗号: smartchart**

-------------------------------------------------------------------------------

### 开发指引与声明:
**此项目为前端代码开源(需保留作者信息)**
```shell script
对应的项目目录说明:

templates/echart  -- 编辑器界面
templates/index   -- 首页Portal
static/echart     -- 扩展前端数据处理函数(图形编辑中可用)
static/editor     -- 编辑器界面js
static/index      -- Portal对应js, css
static/custom     -- 你可以在此新建人个文件夹存放自定义css, js, image ..

```

#### 声明
本项目后端个人可免费使用, 未经授权不可商用. 
开发不易, 为了项目能长期维护下去, 禁止反编译、分发等行为.


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
```

-------------------------------------------------------------------------------

### 更多使用说明:
**SmartChart designed for you / SmartChart是为你而生的一个产品,** 

你只需要使用通用开发技术就可以使用, 因为她的通用性, 所以让你的知识不会因为改变而淘汰
因为她的灵活性, 你可以充分发挥你的智慧让她变得非常的Smart
抛弃繁琐的操作, 加速你的开发效率, 和BI产品相比, 如同Linux与Window的区别

- 开始使用smart chart, 您不需要任何专业知识, 无需coding, 选择模块组装即可!
- 但如果要使用好smart chart, 建意了解下javascript, H5, Echarts这些前端知识, 可以让你的应用更加得心应手,创作更炫的效果
- 如果你需要更进一步订制你的数据, 你需要了解下SQL的使用,本项目高级应用语言都是通用的技能, 象js, h5,sql 学习成本低

- [SmartChart入门文档入口](https://gitee.com/smartchart/smartchart/wikis/pages "SmartChart入门")

**参考视屏,建意观看,有些可能有些久,可进入后关注作者头条号, 查看最新视屏, 请对比最新文档**
- [Smartchart数据库与数据集SQL](https://www.ixigua.com/6910413586208653837?id=6902584882958959116 "SQL")
- [Smartchart页面快速布局](https://www.ixigua.com/6910413586208653837?id=6907784122065191438 "布局")
- [Smartchart数据库与图形的对话](https://www.ixigua.com/6910413586208653837?id=6910373199603565063 "布局")
- [SmartChart大屏模板转化](https://www.ixigua.com/6910825442245083660/ "模板")
- [SmartChart最新开发界面](https://www.ixigua.com/6936381900768412198/ "开发界面")

**Jupyter相关**
- [Smartchart与Pandas](https://www.ixigua.com/6910413586208653837?id=6918162479646245389 "smartchart")
- [Smartchart与Jupyter](https://www.ixigua.com/6910413586208653837?id=6917989046132310535 "smartchart")
- [SmartChart大屏新思路](https://www.ixigua.com/6921133676189352456 "smartchart")
- [SmartChart的Python连接器](https://www.ixigua.com/6944159294069670437 "smartchart")
