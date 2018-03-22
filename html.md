## 1. 说说你对语义化的理解,为什么要语义化

1.  去掉或者丢失样式的时候能够让页面呈现出清晰的结构
2.  有利于 SEO：和搜索引擎建立良好沟通，有助于爬虫抓取更多的有效信息：爬虫依赖于标签来确定上下文和各个关键字的权重；
3.  方便其他设备解析（如屏幕阅读器、盲人阅读器、移动设备）以意义的方式来渲染网页；
4.  便于团队开发和维护，语义化更具可读性，是下一步吧网页的重要动向，遵循 W3C 标准的团队都遵循这个标准，可以减少差异化。

## 2. Label 的作用是什么，是怎么用的？

> label 标签来定义表单控制间的关系,当用户选择该标签时，浏览器会自动将焦点转到和标签相关的表单控件上。

```
<label for="Name">Number:</label>
<input type=“text“name="Name" id="Name"/>
<label>Date:<input type="text" name="B"/></label>
```

## 3.html5 有哪些新特性

* 语义化更好的内容标签（header,nav,footer,aside,article,section）
* 画布(Canvas) API
* 音频、视频 API(audio,video)
* 地理(Geolocation) API
* 拖拽释放(Drag and drop) API
* 本地离线存储表单控件，calendar、date、time、email、url、search
* sessionStorage 的数据在浏览器关闭后自动删除
* 本地离线存储 localStorage 长期存储数据，浏览器关闭后数据不丢失

## 4.HTML5 用过那些东西

1.  语义标签， 如 `<header></header> <nav></nav> <footer></footer>`
2.  HTML5 的表单,如`<input />`的`type`属性，`tel,number,placeholder,date,autoFocus`
3.  在线和离线事件， 如`localStorage`
4.  使用地理位置定位,`navigator.geolocation.getCurrentPosition(success, error)`

## 5.<img>的 title 和 alt 有什么区别

1.  `title`是 global attributes 之一，用于为元素提供附加的 advisory information。通常当鼠标滑动到元素上的时候显示。
2.  `alt`是`<img>的特有属性，是图片内容的等价描述，用于图片无法加载时显示、读屏器阅读图片。可提图片高可访问性，除了纯装饰图片外都必须设置有意义的值，搜索引擎会重点分析。
