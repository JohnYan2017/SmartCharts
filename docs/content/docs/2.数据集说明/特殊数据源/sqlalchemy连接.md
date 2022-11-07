常规的连接池的设定, 大家应该都很清楚了, 
Smartchart也支持sqlalchemy连接, 对于一些smartchart不支持的数据源可以使用此方法
配置方法:
![输入图片说明](https://images.gitee.com/uploads/images/2021/0708/191425_5fbb4e8d_5500438.png "屏幕截图.png")
只用填以上内容, 其它可留空
连接地址的写法参考sqlalchemy说明:
```
可选参数。一个标准的链接URL是这样的：
dialect+driver://username:password@host:port/database
dialect，是数据库类型，大概包括：sqlite, mysql, postgresql, oracle, or mssql.
driver，是使用的数据库API，驱动，连接包，随便叫什么吧。
username，用户名
password，密码
host，网络地址，可以用ip，域名，计算机名，当然是你能访问到的。
port，数据库端口。
databas，数据库名。
其实这些也就dialect和dirver需要解释。

二：连接sqlite3
1，驱动
sqlite3是个文件数据库，不需要什么驱动，或者说python内置了驱动。
2，标准连接参数
# sqlite://<nohostname>/<path>
没有hostname
3，各种链接参数
# 相对路径，就是这个python文件同目录下foo.db
engine = create_engine('sqlite:///foo.db')
#绝对路径
#Unix/Mac下用四条////表示
engine = create_engine('sqlite:////absolute/path/to/foo.db')
#Windows下用三条///加盘符路径用两条\\
engine = create_engine('sqlite:///C:\\path\\to\\foo.db')
#Windows 也可以这么用三条///加盘符路径用一条\
engine = create_engine(r'sqlite:///C:\path\to\foo.db')
#数据库建在内存里。URI保持为空即可
engine = create_engine('sqlite://')

三：连接mysql（mariadb）
sqlalchemy默认使用mysql-python作为链接驱动，既default模式
选哪种驱动，就装哪个包。
1，default默认链接方式
engine = create_engine('mysql://scott:tiger@localhost/foo')
2，# mysql-python，声明使用mysql-python驱动
engine = create_engine('mysql+mysqldb://scott:tiger@localhost/foo')
3，MySQL-connector-python 声明使用MySQL-connector-python驱动（推荐使用）
engine = create_engine('mysql+mysqlconnector://scott:tiger@localhost/foo')
4，OurSQL 声明使用OurSQL驱动
engine = create_engine('mysql+oursql://scott:tiger@localhost/foo')

四：连接Microsoft SQL Server
sqlalchemy默认使用 pyodbc作为链接驱动。
1，pyodbc
engine = create_engine('mssql+pyodbc://scott:tiger@mydsn')
2，pymssql
engine = create_engine('mssql+pymssql://scott:tiger@hostname:port/dbname')

 
五：连接PostgreSQL
PostgreSQL默认使用 psycopg2作为链接驱动，既default模式
1， default
engine = create_engine('postgresql://scott:tiger@localhost/mydatabase')
2，psycopg2
engine = create_engine('postgresql+psycopg2://scott:tiger@localhost/mydatabase')
3， pg8000
engine = create_engine('postgresql+pg8000://scott:tiger@localhost/mydatabase')

 六：连接Oracle
Oracle可能只有 cx_oracle一个驱动包，既default模式和声明模式一样。
1，default
engine = create_engine('oracle://scott:tiger@127.0.0.1:1521/sidname')
2，cx_oracle
engine = create_engine('oracle+cx_oracle://scott:tiger@tnsname')

```

