"""smartchart URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.conf.urls import include
from django.urls import path,re_path
from smart_chart.echart import index

urlpatterns = [
    path(r'', index.index, name='index'),
    path('lg/', index.LoginView.as_view(), name='lg'),
    path('admin/', admin.site.urls),
    path('echart/', include('smart_chart.echart.urls')),
    re_path(r'^([^/]+\.txt)$', index.serve_verification_file),  # 匹配所有 .txt 文件请求
]