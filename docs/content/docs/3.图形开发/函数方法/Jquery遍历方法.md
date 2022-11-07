---
weight: 2
type : docs
bookFlatSection : false
---

在做自定义html组件的时候你可能需要用得上：

一、向上遍历

1. parent() 获取元素的直接父元素
```
$("span").parent().css({
	"color":"red",
	"border":"1px solid red"
})
```

2. parents() 获取元素的祖先元素，直到根元素html
```
$("span").parents().css({
	"color":"red",
	"border":"1px solid red"
})
```
3. parentsUntil() 向上查找直到遇见某个祖先元素为止
```
 $("span").parentsUntil("div").css({	//向上查找直到遇见div元素为止
	"color":"red",
	"border":"1px solid red"
})
```
二、向下遍历
```
1. children() 查找子元素[按照从属关系]

$("ul").children("li:first-child")

2. find() 按照指定的条件向下查找

$("ul").find("span")

```
三、水平遍历

```
1. siblings() 获取元素的所有兄弟元素

$(".start").siblings().css({color:"red",border:"2px solid red"})

2. next() 获取元素的下一个兄弟元素

$(".start").next().css({color:"red",border:"2px solid red"})

3. nextAll() 获取其后的所有兄弟元素

$(".start").nextAll().css({color:"red",border:"2px solid red"})

4. nextUntil() 查找后面所有的兄弟元素，直到遇见某个元素为止

$(".start").nextUntil("li:last-child").css({color:"red",border:"2px solid red"})

5. prev() 查找上一个兄弟元素

$("li.start").prev().css({color:"red",border:"2px solid red"})

6. prevAll() 查找上面所有的兄弟元素

$("li.start").prevAll().css({color:"red",border:"2px solid red"})

prevUntil() 查找上面所有的兄弟元素，直到遇见某个元素为止
$(".start").prevUntil("li:first").css({"color":"red","border":"2px solid red"})

```

四、过滤

```
1. first() 获取第一个元素

$("li").first().css("color","red");

2. last() 获取最后一个元素

$("li").last().css("color","red");

3. not() 获取不是…的元素

$("li").not(":eq(2)").css("font-size","26px");

4. eq(n) 获取索引为n的元素

$("li").eq(3).css("background","green");

5. has() 检测某个子元素是否存在

$("li").eq(1).has("span").length)

6. filter() 筛选出与符合条件的DOM元素

$("div")..filter(".middle")

7. is() 用来判断是否符合条件

$("p").parent().is("div")	//判断p的父元素是不是div,是就返回true,不是就返回false

```

五、each遍历

```
1. each() 方法为每个匹配元素规定要运行的函数。

$(selector).each(function(index,element){
	.....
})
//index 表示当前遍历元素的索引
  element 当前的元素（也可使用 "this" 选择器）

2. $.each(obj,function( index,value){})
```
