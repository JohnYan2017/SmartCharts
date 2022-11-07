---
weight: 7
type : docs
bookFlatSection : false
---
### 应用场景
对于实时程度要求比较高的情况下, 如果你后端已有实现websocket的接口, smartchart也可以很方便的接入
参考以下步骤即可
1. 在"模板"中定义一个全局变量, 如ws_data
2. 编写连接和接收代码段逻辑
3. 在接收代码段加入ds_refresh, 如要刷新0号图形, 则加入ds_refresh(0)
4. 在"高级"设定中加入共享数据集设定, 把ws_data映射到0号图形即可

![输入图片说明](https://images.gitee.com/uploads/images/2022/0331/095209_3dde4cd3_5500438.png "屏幕截图.png")

### 代码段参考
```js
    let ws_data = [['初始化','V'],['A','2']];
    let ws = null;
    
    if('webSocket' in window){
        print('支持webSocket');
        ws = new webSocket('ws://127.0.0.1:2222/abc');
        //连接成功
        ws.onopen = function(){
            print('ws连接成功');
        }
        //接收消息
        ws.onmessage = function(evt){
            ws_data = evt.data;
            ds_refresh(0);
        }
    }
    else{
        print('浏览器不支持ws')
    }

```