---
weight: 1
---

#### 使用场景
- 报表中涉及交互场景较多, 需要数据与页面绑定
- 开发者熟悉vue

#### 常见绑定
```html
//显示变量message
<p>{[ message ]}</p>
//循环产生li,变量sites
<ol>
<li v-for="site in sites">
  {[ site.name ]}
</li>
</ol>
//绑定输入值变量use
<input type="checkbox" v-model="use">
//显示控制
<p v-if="seen">现在你看到我了</p>
<p v-show="seen">现在你看到我了</p>
//绑定属性
<a :href="url"></a>
<div :style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
<div :class="[errorClass ,isActive ? activeClass : '']"></div>
//绑定点击方法
<a @click="doSomething"></a>


```


#### 开启VUE
需要在高级中加入“dv”:2,即可开启vue模式
![输入图片说明](https://images.gitee.com/uploads/images/2022/0726/082025_898085c8_5500438.png "屏幕截图.png")
你可以在图形编辑器中给vue的变量赋值，我们内置了17个变量，从d0, d1... d16
赋值方式 vapp.d0 = xxxx
![输入图片说明](https://images.gitee.com/uploads/images/2021/0702/100115_e2ac7de9_5500438.png "屏幕截图.png")

你可以将d0赋值为字典, 如:
vapp.d0 = { 'index1': 100, 'index2': 300}

>注意,我们修改了vue的默认引用方式, 你需要采用如下方法引用:
{[d0.index1]}

#### 使用模板可以更方便使用VUE
你也可以在 模板开发中 使用VUE
开启方法, 首先你需要在高级设定中 , 设定 "template":"diy",
然后你可以看到 模板 的菜单, 进入编辑器

如果你需要更多自定义的方法, 例如加入方法, 你可以在模板的script中加入自定义代码
```js
<script>
    var vapp = new Vue({el: '#vue_app', delimiters: ['{[', ']}'], 
      data: {
              tableData:''
        },
      methods: {
          formatter(row, column) {
            return row.address;
        }
    }
    });
</script>
```




