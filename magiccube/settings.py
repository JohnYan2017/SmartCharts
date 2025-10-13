import os

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'j^zbuxdr%wh1_dh=nzxhqo1t5no@bw*ar&t$(q9wdnc8r4_+3y'
# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True
ALLOWED_HOSTS = ['*']

INSTALLED_APPS = [
    'smart_chart.smartui',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'smart_chart.echart',
]

# LOGS
# pip install setuptools==57.5.0
# pip install ConcurrentLogHandler==0.9.1
try:
   import ConcurrentLogHandler
   LOGCLASS = 'cloghandler.ConcurrentRotatingFileHandler'
except ImportError:
   LOGCLASS = 'logging.handlers.RotatingFileHandler'

BASE_LOG_DIR = os.path.join(BASE_DIR, "log")
LOGGING = {
    'version': 1,  # 保留字
    'disable_existing_loggers': False,  # 禁用已经存在的logger实例
    # 日志文件的格式
    'formatters': {
        # 详细的日志格式
        'standard': {
            'format': '%(asctime)s|%(threadName)s:%(thread)d|task_id:%(name)s|%(filename)s:%(lineno)d|%(levelname)s|%(message)s'
        },
        # 简单的日志格式
        'simple': {
            'format': '%(levelname)s|%(asctime)s|%(filename)s:%(lineno)d|%(message)s'
        },
        # 定义一个特殊的日志格式
        'collect': {
            'format': '%(asctime)s|%(message)s'
        }
    },
    # 过滤器
    'filters': {
        'require_debug_true': {
            '()': 'django.utils.log.RequireDebugTrue',
        },
    },
    # 处理器
    'handlers': {
        # 在终端打印
        'console': {
            'level': 'DEBUG',
            'filters': ['require_debug_true'],  # 只有在Django debug为True时才在屏幕打印日志
            'class': 'logging.StreamHandler',  #
            'formatter': 'simple'
        },
        # 默认的
        'default': {
            'level': 'INFO',
            'class':LOGCLASS,
            'filename': os.path.join(BASE_LOG_DIR, "smartchart_info.log"),  # 日志文件
            'maxBytes': 1024 * 1024 * 50,  # 日志大小 50M
            'backupCount': 3,  # 最多备份几个
            'formatter': 'standard',
            'encoding': 'utf-8',
        },
        # 默认的
        'sql': {
            'level': 'INFO',
            'class':LOGCLASS,
            'filename': os.path.join(BASE_LOG_DIR, "smartchart_sql.log"),  # 日志文件
            'maxBytes': 1024 * 1024 * 50,
            'backupCount': 3,
            'formatter': 'collect',
            'encoding': 'utf-8',
        },
        'gpt': {
            'level': 'INFO',
            'class':LOGCLASS,
            'filename': os.path.join(BASE_LOG_DIR, "smartchart_gpt.log"),  # 日志文件
            'maxBytes': 1024 * 1024 * 50,
            'backupCount': 3,
            'formatter': 'collect',
            'encoding': 'utf-8',
        },
        # 专门用来记错误日志
        'error': {
            'level': 'ERROR',
            'class':LOGCLASS,
            'filename': os.path.join(BASE_LOG_DIR, "smartchart_err.log"),
            'maxBytes': 1024 * 1024 * 50,
            'backupCount': 3,
            'formatter': 'standard',
            'encoding': 'utf-8',
        },
        'collect': {
            'level': 'DEBUG',
            'class':LOGCLASS,
            'filename': os.path.join(BASE_LOG_DIR, "smartchart_collect.log"),
            'maxBytes': 1024 * 1024 * 50,
            'backupCount': 5,
            'formatter': 'collect',
            'encoding': "utf-8"
        }
    },
    'loggers': {
        # 默认的logger应用如下配置
        '': {
            'handlers': ['default', 'error'] + (['console'] if DEBUG else []),
            'level': 'INFO',
            'propagate': True,  # 向不向更高级别的logger传递
        },
        'collect': {
            'handlers': ['collect'],
            'level': 'INFO',
        },
        'sql': {
            'handlers': ['sql'],
            'level': 'INFO',
        },
        'gpt': {
            'handlers': ['gpt'],
            'level': 'INFO',
        }
    },
}

# Application definition

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    # 'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'magiccube.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'magiccube.wsgi.application'

# Password validation
# https://docs.djangoproject.com/en/2.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
# https://docs.djangoproject.com/en/2.1/topics/i18n/

LANGUAGE_CODE = 'zh-hans'
TIME_ZONE = 'Asia/Shanghai'
USE_I18N = True
USE_L10N = True
USE_TZ = False


# ============  登录认证配置  =================

LOGIN_URL = '/lg'

DEFAULT_AUTO_FIELD = 'django.db.models.AutoField'
SECURE_CROSS_ORIGIN_OPENER_POLICY = None


# 上传路径
UPLOAD_PATH = os.path.join(BASE_DIR, '_files')

# Database
# https://docs.djangoproject.com/en/2.1/ref/settings/#databases
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    },
    # 'default': {
    #     'ENGINE': 'django.db.backends.mysql',  # postgresql_psycopg2, postgresql
    #     'NAME': 'xxxx',  # 数据库名
    #     'USER': 'xx',
    #     'PASSWORD': 'xxxx',
    #     'HOST': 'localhost',
    #     'PORT': '3306',
    # },
}
# Static files (CSS, JavaScript, Images)
# python manage.py collectstatic to collect admin css
STATIC_ROOT = os.path.join(BASE_DIR, "static")
# STATICFILES_DIRS = [
#     os.path.join(BASE_DIR, "static"),
# ]
STATIC_URL = '/static/'


MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media').replace('\\', '/')



# ============  登录认证配置  =================
# import ldap
# from django_auth_ldap.config import LDAPSearch
# LDAP_AUTHUSER = ''
# DOMINNAME = ''
# BASEDN = 'ou=xx,dc=xx,dc=com'
# # Baseline configuration.
# AUTH_LDAP_SERVER_URI = 'ldap://xx:389/'
# AUTH_LDAP_BIND_DN = 'cn=xx,ou=xx,dc=xx,dc=com'
# AUTH_LDAP_BIND_PASSWORD = 'xx'
# AUTH_LDAP_USER_SEARCH = LDAPSearch(
#     BASEDN,
#     ldap.SCOPE_SUBTREE,
#     '(cn=%(user)s)',
# )
# # Populate the Django user from the LDAP directory.
# AUTH_LDAP_USER_ATTR_MAP = {
#     'first_name': 'DisplayName',
#     'role': 'Department',
#     'email': 'mail',
#     'department': 'manager',
# }
# AUTH_LDAP_ALWAYS_UPDATE_USER = True
# AUTH_LDAP_FIND_GROUP_PERMS = False
# AUTH_LDAP_CACHE_TIMEOUT = 3600
AUTHENTICATION_BACKENDS = (
    # 'django_auth_ldap.backend.LDAPBackend',
    'django.contrib.auth.backends.ModelBackend',
)

LOGIN_REDIRECT_URL = '/'

# ============  邮件配置项  =================
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = ''
EMAIL_PORT = 25
EMAIL_HOST_USER = ''
EMAIL_HOST_PASSWORD = ''
EMAIL_USE_TLS = False

# ==============  开启CACHE =================
# CACHES = {
#      'default': {
#          'BACKEND': 'django_redis.cache.RedisCache',
#          'LOCATION': 'redis://localhost:6379/1',
#          "OPTIONS": {
#              "CLIENT_CLASS": "django_redis.client.DefaultClient",
#               # "PASSWORD": "yoursecret",
#          },
#      },
#  }
REDIS_TIMEOUT=7*24*60*60
# CUBES_REDIS_TIMEOUT=60*60
# NEVER_REDIS_TIMEOUT=365*24*60*60


