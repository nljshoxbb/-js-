## 1. 说说你对语义化的理解,为什么要语义化

> 1、去掉或者丢失样式的时候能够让页面呈现出清晰的结构
> 2、有利于 SEO：和搜索引擎建立良好沟通，有助于爬虫抓取更多的有效信息：爬虫依赖于标签来确定上下文和各个关键字的权重；
> 3、方便其他设备解析（如屏幕阅读器、盲人阅读器、移动设备）以意义的方式来渲染网页；
> 4、便于团队开发和维护，语义化更具可读性，是下一步吧网页的重要动向，遵循 W3C 标准的团队都遵循这个标准，可以减少差异化。

## 2. Label 的作用是什么，是怎么用的？

> label 标签来定义表单控制间的关系,当用户选择该标签时，浏览器会自动将焦点转到和标签相关的表单控件上。

```
<label for="Name">Number:</label>
<input type=“text“name="Name" id="Name"/>
<label>Date:<input type="text" name="B"/></label>
```

## 3.html5 有哪些新特性

> 语义化更好的内容标签（header,nav,footer,aside,article,section）音频、视频 API(audio,video)
> 画布(Canvas) API
> 地理(Geolocation) API
> 拖拽释放(Drag and drop) API
> 本地离线存储表单控件，calendar、date、time、email、url、search
