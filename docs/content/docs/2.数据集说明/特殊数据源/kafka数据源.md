用于获取kafka指定分区的最后一条记录, 用于实时场景
使用方法参考"自定义数据源"
以下为参考代码:

```python
def dataset(*args, **kwargs):
    """
    返回查询数据集
    :return: 二维数组或JSON字典
    """
    from kafka import  KafkaConsumer, TopicPartition
    import json

    sqlList = args[0]   # 数据集编辑界面的输入已按分号拆分成数组 [sql1, sql2...]
    config = args[1]    # 相关的配置字典{'host','port','user','password','db'}
    # 插入你的数据查询及处理代码, 生成result即可
    result = {}
    consumer = KafkaConsumer(sasl_mechanism='PLAIN',
                             security_protocol='SASL_PLAINTEXT',
                             sasl_plain_username=config['user'],
                             sasl_plain_password=config['password'],
                             bootstrap_servers=config['host'],
                             auto_offset_reset='earliest',
                             api_version=(1, 0, 0),
                             consumer_timeout_ms=50,
                             value_deserializer=lambda v: json.loads(v.decode('utf-8')),
                             )
    topic = sqlList[0]
    partition = int(config['db'])
    tp = TopicPartition(topic=topic, partition=partition)
    consumer.assign([tp])
    end_offsets = consumer.end_offsets([tp]).get(tp)  # 获取当前消费者最大偏移量
    consumer.seek(tp, offset=end_offsets-1)
    for message in consumer:
        result = message.value
        break
    return result

def insert_dataset(*args, **kwargs):
    """
    数据填报实现
    """
    from kafka import KafkaProducer
    import json

    contents = args[0]  # 传入的数据集二维数组格式
    table = args[1]   # 配置中的表名
    config = args[3]  # 相关的配置字典{'host','port','user','password','db'}
    # 插入你的写入数据逻辑代码
    producer = KafkaProducer(sasl_mechanism='PLAIN',
                             security_protocol='SASL_PLAINTEXT',
                             sasl_plain_username=config['user'],
                             sasl_plain_password=config['password'],
                             bootstrap_servers=config['host'],
                             value_serializer=lambda v: json.dumps(v).encode('utf-8')
                             )
    producer.send(table, value=contents, partition=int(config['db']))

```