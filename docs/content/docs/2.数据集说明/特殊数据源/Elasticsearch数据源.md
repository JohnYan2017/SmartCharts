#### 数据源配置方法
![输入图片说明](https://foruda.gitee.com/images/1660641374573749500/屏幕截图.png "屏幕截图.png")


#### 查询方法
![输入图片说明](https://foruda.gitee.com/images/1660641278541734118/屏幕截图.png "屏幕截图.png")

##### 更多查询方法参考
```
模糊查询
body = {
    'query': {  # 查询命令
        'match': {  # 查询方法：模糊查询（会被分词）。比如此代码，会查到只包含：“我爱你”， “中国”的内容
            'name': '刘'
        }
    },
　　'size': 20  # 不指定默认是10，最大值不超过10000（可以修改，但是同时会增加数据库压力）
}

term，精准单值查询
# 注：此方法只能查询一个字段，且只能指定一个值。类似于mysql中的where ziduan='a'
body ={   
    'query':{
        'term':{
            'ziduan1.keyword': '刘婵'  # 查询内容等于“我爱你中国的”的数据。查询中文，在字段后面需要加上.keyword
　　　　     # 'ziduan2': 'liuchan'
        }
    }
}
erms，精准多值查询
#此方法只能查询一个字段，但可以同时指定多个值。类似于mysql中的where ziduan in (a, b,c...)
body ={   
    "query":{
        "terms":{
            "ziduan1.keyword": ["刘婵", "赵云"]  # 查询ziduan1="刘婵"或=赵云...的数据
        }
    }
}
multi_match，多字段查询
# 查询多个字段中都包含指定内容的数据
body = {
    "query":{
        "multi_match":{
            "query":"我爱你中国",  # 指定查询内容，注意：会被分词
            "fields":["ziduan1", "ziduan2"]  # 指定字段
        }
    }
}

prefix，前缀查询
body = {
    'query': {
        'prefix': { 
            'ziduan.keyword': '我爱你'  # 查询前缀是指定字符串的数据
        }
    }
}

# 注：英文不需要加keyword

wildcard，通配符查询
body = {
    'query': {
        'wildcard': {
            'ziduan1.keyword': '?刘婵*'  # ?代表一个字符，*代表0个或多个字符
        }
    }
}
# 注：此方法只能查询单一格式的（都是英文字符串，或者都是汉语字符串）。两者混合不能查询出来。

regexp，正则匹配
body = {
    'query': {
        'regexp': {
            'ziduan1': 'W[0-9].+'   # 使用正则表达式查询
        }
    }
}
bool，多条件查询
# must：[] 各条件之间是and的关系
body = {
        "query":{
            "bool":{
                'must': [{"term":{'ziduan1.keyword': '我爱你中国'}},
                         {'terms': {'ziduan2': ['I love', 'China']}}]
            }
        }
    }

# should: [] 各条件之间是or的关系
body = {
        "query":{
            "bool":{
                'should': [{"term":{'ziduan1.keyword': '我爱你中国'}},
                         {'terms': {'ziduan2': ['I love', 'China']}}]
            }
        }
    }

# must_not：[]各条件都不满足
body = {
        "query":{
            "bool":{
                'must_not': [{"term":{'ziduan1.keyword': '我爱你中国'}},
                         {'terms': {'ziduan2': ['I love', 'China']}}]
            }
        }
    }



# bool嵌套bool
# ziduan1、ziduan2条件必须满足的前提下，ziduan3、ziduan4满足一个即可
body = {
    "query":{
        "bool":{
            "must":[{"term":{"ziduan1":"China"}},  #  多个条件并列  ，注意：must后面是[{}, {}],[]里面的每个条件外面有个{}
                    {"term":{"ziduan2.keyword": '我爱你中国'}},
                    {'bool': {
                        'should': [
                            {'term': {'ziduan3': 'Love'}},
                            {'term': {'ziduan4': 'Like'}}
                        ]
                    }}
            ]
        }
    }
}


```