### FAQ
- 启动显示 以一种访问权限不允许的方式做了一个访问套接字的尝试
出现这种情况在Windows中很常见，就是端口被占用，酷狗音乐会占用8000端口
使用netstat -ano|findstr 8000 找到进程号
使用taskkill /pid 进程号 /F

- 输入命令找不到smartchart
检查你是否有安装多个python环境出现环境变量冲突,请卸载一个或取消一个环境变量

- 如法安装pip
请确认在安装python时,有没有加入环境变量, 可自行加入, 或卸载重装

- 关于mac版本安装后的各种问题
目前来看最大的可能是，/Library/Developer/CommandLineTools这个目录下有python3，应该是在某一个版本的Xcode command line tools安装时生成的
可以先把python3全部卸载，再重新按说明安装，命令行中输入python3 和 pip3， 找不到command时才说明完全卸载成功
    ```
    sudo rm -rf /Library/Developer/CommandLineTools
    sudo rm -f /usr/bin/python3
    ```
- 如果密码忘记了怎么办
命令行输入smartchart changepassword 你的用户名
