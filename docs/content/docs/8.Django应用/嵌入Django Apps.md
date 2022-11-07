---
weight: 1
type : docs
bookFlatSection : false
---
### 应用场景
你可以在你的django项目中直接使用smartchart做为插件的方式
 [你可以查看相关视屏](https://www.bilibili.com/video/BV1wr4y1i7rM)

### 使用方法
1. 在你的setting.py的INSTALL_APPS中加入'smart_chart.echart'
   如果你需要simpleui,  **你可以在最上行加入我们适配好的'smart_chart.smartui'** 
```
INSTALLED_APPS = [
    'smart_chart.smartui',
    ....
    ....
    'smart_chart.echart'
]
```

2. MIDDLEWARE 中注释掉XFrameOptionsMiddleware

3. 检查确保在Templates的设定处有DIRS的相关设定
```
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],   #此处需要有
        'APP_DIRS': True,   #也要有
        .....
    },
]
```

4. setting.py中设定为中国时区, 支持中文基础平台建设!
```
    LANGUAGE_CODE = 'zh-hans'
    TIME_ZONE = 'Asia/Shanghai'
    USE_I18N = True
    USE_L10N = True
    USE_TZ = False  # 此处必须为False
```
5. 在你的url.py中加入引用
```
    from django.conf.urls import include
    from django.views.generic import RedirectView
```
6. url.py的urlpatterns中加入路由
```
    path('echart/', include('smart_chart.echart.urls')),
    path('', RedirectView.as_view(url='echart/index/')),  #首页,可自定义路由
```


7. 初始化DB, 命令行输入: 
```
    python manage.py makemigrations
    python manage.py migrate
```
8. 建立管理员帐号, 如果已有可忽略
```
   python manage.py createsuperuser
```

9. 启动服务
```
   python manage.py runserver
```

 **10. 点击首页的组件升级进行初始化**  :cupid:  !!!! 重要！！！
<img src="https://images.gitee.com/uploads/images/2021/1218/130309_5b16a30f_5500438.png" width="40%">

### 注意
一般来说如果你使用django遇到的问题，都不是smartchart导致的， 
作者也很难给你解答， 建议你可以进行有偿问答