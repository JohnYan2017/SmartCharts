import time
import hashlib
import os

"""
参数说明：
id: 用户名（在smartchart平台中管理）
stamp: 时间戳(1970年1月1日到生成时间的毫秒数)
token: 采用sha1加密, token=SHA1(链接秘钥+stamp+id)
	   链接秘钥默认smartchart,
	   请在环境变量设定SMART_KEY替换（重要）
url: 登录成功后跳转链接
"""

SMART_CHART_URL = 'http://127.0.0.1:8000'
LOGIN_URL = SMART_CHART_URL + '/echart/smart_login?id={id}&stamp={stamp}&token={token}&url={url}'
SMART_KEY = os.environ.get('SMART_KEY', 'smartchart')


def get_smarturl(username, url='/'):
    stamp = int(time.time() * 1000)
    id = username
    res = SMART_KEY + str(stamp) + id
    token = hashlib.sha1(res.encode('utf-8')).hexdigest()
    LOGIN_DICT = {
        "id": id,
        "stamp": stamp,
        "token": token,
        "url": url
    }

    # 拼接好的url,直接访问
    visit_url = LOGIN_URL.format(**LOGIN_DICT)
    return visit_url
