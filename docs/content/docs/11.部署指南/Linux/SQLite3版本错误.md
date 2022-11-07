SQLite3版本错误
在部分操作系统下（比如CentOS 7）使用SQLite3数据库运行会出现如下的错误提示：
```
django.core.exceptions.ImproperlyConfigured: SQLite 3.8.3 or later is required (found 3.7.17).
```

这表明操作系统自带的sqlite3版本过低，需要将系统的sqlite3进行升级。

以下是一种方法，来自于 StackOverlow：

1、下载新版本的SQLite3
```
wget https://www.sqlite.org/2019/sqlite-autoconf-3290000.tar.gz
```
2、解压文件
```
tar zxvf sqlite-autoconf-3290000.tar.gz
```
3、进行解压后的目录
```
cd sqlite-autoconf-3290000
```
4、配置安装目录
```
./configure --prefix=$HOME/opt/sqlite
```
5、编译安装
```
make && make install
```
6、指定环境变量
```
export PATH=$HOME/opt/sqlite/bin:$PATH
export LD_LIBRARY_PATH=$HOME/opt/sqlite/lib
export LD_RUN_PATH=$HOME/opt/sqlite/lib
```
完成之后可以运行sqlite3 --version 命令来查看当前的SQLite3版本。