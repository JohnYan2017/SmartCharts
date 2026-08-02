

from django.contrib import admin
from django.conf.urls import include
from django.urls import path,re_path
from smart_chart.echart import index

urlpatterns = [
    path(r'', index.index, name='index'),
    path('m/', index.mobile, name='mobile'),
    path('lg/', index.LoginView.as_view(), name='lg'),
    path('admin/', admin.site.urls),
    path('echart/', include('smart_chart.echart.urls')),
    path('oa/', include('smart_chart.oa.urls')),
    path('scheduler/', include('smart_chart.scheduler.urls')),
    re_path(r'^([^/]+\.txt)$', index.serve_verification_file),  # 匹配所有 .txt 文件请求
]