## 1. new 操作符具体干了什么呢?

> 1、创建一个新对象
> 2、将构造函数的作用域赋给新对象（因此 this 就指向了这个新对象）
> 3、执行构造函数中的代码（为这个新对象添加属性）
> 4、返回新对象

## 2. null 和 undefined 的区别？

> 1、null 是一个表示”无”的对象，转为数值时为 0；undefined 是一个表示”无”的原始值，转为数值时为 NaN。
> 2、undefined 表示”缺少值”，就是此处应该有一个值，但是还没有定义。
> 3、null 表示”没有对象”，即该处不应该有值。

## 3. call、apply、bind 的区别

> 三者都是用来改变函数的 this 对象的指向的。三者第一个参数都是 this 要指向的对象，也就是想指定的上下文。
> call 传入的参数数量不固定，第二部分参数要一个一个传，用，隔开。
> apply 接受两个参数，第二个参数为一个带下标的集合，可以为数组，也可以为类数组。
> bind 是返回一个改变了上下文的函数副本，便于稍后调用；apply 、call 则是立即调用 。

```
this.x = 9;
var module = {
x: 81,
getX: function() { return this.x; }
};

module.getX(); // 返回 81

var retrieveX = module.getX;
retrieveX(); // 返回 9, 在这种情况下，"this"指向全局作用域

// 创建一个新函数，将"this"绑定到 module 对象
// 新手可能会被全局的 x 变量和 module 里的属性 x 所迷惑
var boundGetX = retrieveX.bind(module);
boundGetX(); // 返回 81
```

## 5. 请解释一下 JavaScript 的同源策略。

> 这里的同源策略指的是：协议，域名，端口相同，同源策略是一种安全协议。指一段脚本只能读取来自同一来源的窗口和文档的属性。

## 6. 如何解决跨域问题?

> 这里说的 js 跨域是指通过 js 在不同的域之间进行数据传输或通信，比如用 ajax 向一个不同的域请求数据，或者通过 js 获取页面中不同域的框架中(iframe)的数据。只要协议、域名、端口有任何一个不同，都被当作是不同的域。

> 当一个资源从与该资源本身所在的服务器不同的域或端口请求一个资源时，资源会发起一个**跨域 HTTP 请求**。出于安全原因，浏览器限制从脚本内发起的跨源 HTTP 请求。 例如，`XMLHttpRequest` 和 `Fetch API` 遵循同源策略。 这意味着使用这些 API 的 Web 应用程序只能从加载应用程序的同一个域请求 HTTP 资源，除非使用 跨域资源共享`CORS`(跨域资源共享) 头文件。

### 1.通过 jsonp 跨域

```
<script>
    function dosomething(jsondata){

    }
</script>
<script src="http://example.com/data.php?callback=dosomething"></script>
```

我们看到获取数据的地址后面还有一个 callback 参数，按惯例是用这个参数名，但是你用其他的也一样。当然如果获取数据的 jsonp 地址页面不是你自己能控制的，就得按照提供数据的那一方的规定格式来操作了。所以通过http://example.com/data.php?callback=dosomething得到的js文件，就是我们之前定义的dosomething函数,并且它的参数就是我们需要的json数据，这样我们就跨域获得了我们需要的数据。

### 2.通过修改 document.domain 来跨子域

使用条件：

1.  有其他页面 window 对象的引用。
2.  二级域名相同。
3.  协议相同。
4.  端口相同

`document.domain` 默认的值是整个域名，所以即使两个域名的二级域名一样，那么他们的 `document.domain` 也不一样。

使用方法就是将符合上述条件页面的 `document.domain` 设置为同样的二级域名。这样我们就可以使用其他页面的 `window` 对象引用做我们想做的任何事情了。

例如页面 (http://one.example.com/index....`<iframe>`

```
<iframe id="iframe" src="http://two.example.com/iframe.html"></iframe>
```

在 iframe.html 中使用 JavaScript 将 `document.domain` 设置好，也就是 example.com。

```
var iframe = document.getElementById('iframe');

document.domain = 'example.com';

iframe.contentDocument; // 框架的 document 对象
iframe.contentWindow; // 框架的 window 对象
```

这样，我们就可以获得对框架的完全控制权了。

### 3.使用 window.name 来进行跨域

```
window.name = "My window's name";
location.href = "http://www.qq.com/";

// 再检测 window.name

window.name; // My window's name
```

在一个标签里面跳转网页的话，我们的 `window.name` 是不会改变的。由于安全原因，浏览器始终会保持 `window.name` 是 `string` 类型。

基于这个思想，我们可以在某个页面设置好 `window.name` 的值，然后跳转到另外一个页面。在这个页面中就可以获取到我们刚刚设置的 `window.name` 了。

```
var iframe = document.getElementById('iframe');
var data = '';

iframe.onload = function() {
    data = iframe.contentWindow.name;
};
```

> 因为两个页面完全不同源，出现了报错由于 window.name 不随着 URL 的跳转而改变，所以我们使用一个暗黑技术来解决这个问题：

```
var iframe = document.getElementById('iframe');
var data = '';

iframe.onload = function() {
    iframe.onload = function(){
        data = iframe.contentWindow.name;
    }
    iframe.src = 'about:blank';
};
```

> 或者将里面的 about:blank 替换成某个同源页面（最好是空页面，减少加载时间）。这种方法与 `document.domain` 方法相比，放宽了域名后缀要相同的限制，可以从任意页面获取 `string` 类型的数据。

### 4.使用 HTML5 中新引进的 window.postMessage 方法来跨域传送数据

```
windowObj.postMessage(message, targetOrigin);
```

* `windowObj`: 接受消息的 Window 对象。
* `message`: 在最新的浏览器中可以是对象。
* `targetOrigin`: 目标的源，`*` 表示任意。

这个方法非常强大，无视协议，端口，域名的不同

```
var windowObj = window; // 可以是其他的 Window 对象的引用
var data = null;

addEventListener('message', function(e){
    if(e.origin == 'http://jasonkid.github.io/fezone') {
        data = e.data;

        e.source.postMessage('Got it!', '*');
    }
});
```

`message` 事件就是用来接收 `postMessage` 发送过来的请求的。函数参数的属性有以下几个：

* `origin`: 发送消息的 window 的源。
* `data`: 数据。
* `source`: 发送消息的 Window 对象。

## 7. 说说严格模式的限制

> 变量必须声明后再使用函数的参数不能有同名属性，否则报错禁止 this 指向全局对象不能使用 with 语句增加了保留字
> arguments 不会自动反映函数参数的变化设立”严格模式”的目的：消除 Javascript 语法的一些不合理、不严谨之处，减少一些怪异行为;
> 消除代码运行的一些不安全之处，保证代码运行的安全；提高编译器效率，增加运行速度；为未来新版本的 Javascript 做好铺垫。

## 8. 请解释什么是事件代理

> 事件代理（Event Delegation），又称之为事件委托。即是把原本需要绑定的事件委托给父元素，让父元素担当事件监听的职务。事件代理的原理是 DOM 元素的事件冒泡。使用事件代理的好处是可以提高性能

## 9. Event Loop、消息队列、事件轮询

> 异步函数在执行结束后，会在事件队列中添加一个事件（回调函数）(遵循先进先出原则)，主线程中的代码执行完毕后（即一次循环结束），下一次循环开始就在事件队列中“读取”事件，然后调用它所对应的回调函数。这个过程是循环不断的，所以整个的这种运行机制又称为 Event Loop（事件循环）

> 主线程运行的时候，产生堆（heap）和栈（stack），栈中的代码（同步任务）调用各种外部 API，它们在”任务队列”中加入各种事件（click，load，done）。只要栈中的代码执行完毕，主线程就会去读取”任务队列”，依次执行那些事件所对应的回调函数。

> 执行栈中的代码（同步任务），总是在读取”任务队列”（异步任务）之前执行。

## 10. ES6 的了解

> es6 是一个新的标准，它包含了许多新的语言特性和库，是 JS 最实质性的一次升级。比如’箭头函数’、’字符串模板’、’generators(生成器)’、’async/await’、’解构赋值’、’class’等等，还有就是引入 module 模块的概念。

> **箭头函数**可以让 this 指向固定化，这种特性很有利于封装回调函数
> (1) 函数体内的 this 对象，就是定义时所在的对象，而不是使用时所在的对象。
> (2) 不可以当作构造函数，也就是说，不可以使用 new 命令，否则会抛出一个错误。
> (3) 不可以使用 arguments 对象，该对象在函数体内不存在。如果要用，可以用 Rest 参数代替
> (4) 不可以使用 yield 命令，因此箭头函数不能用作 Generator 函数。

> **async/await** 是写异步代码的新方式，以前的方法有回调函数和 Promise。
> async/await 是基于 Promise 实现的，它不能用于普通的回调函数。
> async/await 与 Promise 一样，是非阻塞的。
> async/await 使得异步代码看起来像同步代码，这正是它的魔力所在。

## 11. 说说你对 Promise 的理解

> Promise 是异步编程的一种解决方案，比传统的解决方案——回调函数和事件监听——更合理和更强大。

> 所谓 Promise，简单说就是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果。从语法上说，Promise 是一个对象，从它可以获取异步操作的消息。Promise 提供统一的 API，各种异步操作都可以用同样的方法进行处理。

> Promise 对象有以下两个特点:
>
> * 对象的状态不受外界影响，Promise 对象代表一个异步操作，有三种状态：Pending（进行中）、Resolved（已完成，又称 Fulfilled）和 Rejected（已失败）
> * 一旦状态改变，就不会再变，任何时候都可以得到这个结果。

## 12. 说说你对 AMD 和 Commonjs 的理解

> 1.  CommonJS

> CommonJS 规范是诞生比较早的。NodeJS 就采用了 CommonJS

> ```
> var clock = require('clock');
> clock.start();
> ```

> 这种写法适合服务端，因为在服务器读取模块都是在本地磁盘，加载速度很快。但是如果在客户端，加载模块的时候有可能出现“假死”状况。比如上面的例子中 clock 的调用必须等待 clock.js 请求成功，加载完毕。那么，能不能异步加载模块呢？

> 2.  AMD

> AMD，即 (Asynchronous Module Definition)，这种规范是异步的加载模块，requireJs 应用了这一规范。先定义所有依赖，然后在加载完成后的回调函数中执行
>
> ```
> require(['clock'],function(clock){
>   clock.start();
> });
> ```

> 3.  CMD

> CMD (Common Module Definition), 是 seajs 推崇的规范，CMD 则是依赖就近，用的时候再 require

> ```
> define(function(require, exports, module) {
>    var clock = require('clock');
>    clock.start();
> });
> ```

## 13.lazyload

> 场景：涉及到图片，falsh 资源 , iframe, 网页编辑器(类似 FCK)等占用较大带宽，且这些模块暂且不在浏览器可视区内,因此可以使用 lazyload 在适当的时候加载该类资源.

> 优点：提升用户的体验，如果图片数量较大，打开页面的时候要将将页面上所有的图片全部获取加载，很可能会出现卡顿现象，影响用户体验。因此，有选择性地请求图片，这样能明显减少了服务器的压力和流量，也能够减小浏览器的负担。

> 原理:首先在渲染时，图片引用默认图片，然后把真实地址放在 `data-\*`属性上面。`<image src='./../assets/default.png' :data-src='item.allPics' class='lazyloadimg'>`然后是监听滚动，直接用`window.onscroll` 就可以了，但是要注意一点的是类似于 `window`的 `scroll` 和 `resize`，还有 `mousemove`这类触发很频繁的事件，最好用节流(throttle)或防抖函数(debounce)来控制一下触发频率。接着要判断图片是否出现在了视窗里面，主要是三个高度：1，当前 body 从顶部滚动了多少距离。2，视窗的高度。3，当前图片距离顶部的距离

> 实现：lazyload 的难点在如何在适当的时候加载用户需要的资源(这里用户需要的资源指该资源呈现在浏览器可视区域)。因此我们需要知道几点信息来确定目标是否已呈现在客户区,其中包括：

> 1.  当前 body 从顶部滚动了多少距离
> 2.  视窗的高度.
> 3.  当前图片距离顶部的距离

```
window.onscroll =_.throttle(this.watchscroll, 200);
watchscroll () {
  var bodyScrollHeight =  document.body.scrollTop;// body滚动高度
  var windowHeight = window.innerHeight;// 视窗高度
  var imgs = document.getElementsByClassName('lazyloadimg');
  for (var i =0; i < imgs.length; i++) {
    var imgHeight = imgs[i].offsetTop;// 图片距离顶部高度  
    if (imgHeight  < windowHeight  + bodyScrollHeight) {
       imgs[i].src = imgs[i].getAttribute('data-src');
       img[i].className = img[i].className.replace('lazyloadimg','')
    }
  }
}
```

## 14. Debounce、throttle

> 以下场景往往由于事件频繁被触发，因而频繁执行 DOM 操作、资源加载等重行为，导致 UI 停顿甚至浏览器崩溃。
>
> 1.  window 对象的 resize、scroll 事件
> 2.  拖拽时的 mousemove 事件
> 3.  射击游戏中的 mousedown、keydown 事件
> 4.  文字输入、自动完成的 keyup 事件

### Debounce(防抖)

#### 定义

> 当调用动作 n 毫秒后，才会执行该动作，若在这 n 毫秒内又调用此动作则将重新计算执行时间。可以把多个顺序地调用合并成一次。

#### 实例

> 1.  调整桌面浏览器窗口大小的时候，会触发很多次 resize 事件
> 2.  基于 AJAX 请求的自动完成功能，通过 keypress 触发

#### 实现

```
/**
* 空闲控制 返回函数连续调用时，空闲时间必须大于或等于 idle，action 才会执行
* @param idle   {number}    空闲时间，单位毫秒
* @param action {function}  请求关联函数，实际应用需要调用的函数
* @return {function}    返回客户调用函数
*/
debounce(idle,action)

var debounce = function(idle, action){
  var last
  return function(){
    var _this = this, args = arguments
    clearTimeout(last)
    last = setTimeout(function(){
        action.apply(_this, args)
    }, idle)
  }
}
```

### Throttle（节流阀）

#### 定义

> 预先设定一个执行周期，当调用动作的时刻大于等于执行周期则执行该动作，然后进入下一个新周期。只允许一个函数在 X 毫秒内执行一次。

> 不同点:跟 debounce 主要的不同在于，throttle 保证 X 毫秒内至少执行一次。

> #### 实例：
>
> 1.  无限滚动

#### 实现

```
/**
* 频率控制 返回函数连续调用时，action 执行频率限定为 次 / delay
* @param delay  {number}    延迟时间，单位毫秒
* @param action {function}  请求关联函数，实际应用需要调用的函数
* @return {function}    返回客户调用函数
*/
throttle(delay,action)

var throttle = function(delay, action){
  var last = 0;
  return function(){
    var curr = +new Date()
    if (curr - last > delay){
      action.apply(this, arguments)
      last = curr
    }
  }
}
```

### requestAnimationFrame

> 告诉浏览器您希望执行动画并请求浏览器在下一次重绘之前调用指定的函数来更新动画。该方法使用一个回调函数作为参数，这个回调函数会在浏览器重绘之前调用。是另一种限速执行的方式。跟 `_.throttle(dosomething, 16)` 等价。它是高保真的，如果追求更好的精确度的话，可以用浏览器原生的 API 。

#### 优点

* 动画保持 60fps（每一帧 16 ms），浏览器内部决定渲染的最佳时机
* 简洁标准的 API，后期维护成本低

#### 缺点

* 动画的开始/取消需要开发者自己控制，不像 ‘.debounce’ 或 ‘.throttle’由函数内部处理。
* 浏览器标签未激活时，一切都不会执行。
* 尽管所有的现代浏览器都支持 rAF ，IE9，Opera Mini 和 老的 Android 还是需要打补丁。
* Node.js 不支持，无法在服务器端用于文件系统事件。

实现如下：

```
var latestKnownScrollY = 0,
    ticking = false,
  item = document.querySelectorAll('.item');


function update() {
    // reset the tick so we can
    // capture the next onScroll
    ticking = false;

  item[0].style.width = latestKnownScrollY + 100 + 'px';
}


function onScroll() {
    latestKnownScrollY = window.scrollY; //No IE8
    requestTick();
}

function requestTick() {
    if(!ticking) {
        requestAnimationFrame(update);
    }
    ticking = true;
}

 window.addEventListener('scroll', onScroll, false);


/// THROTTLE

function throttled_version() {
   item[1].style.width = window.scrollY + 100 + 'px';
}

 window.addEventListener('scroll', _.throttle(throttled_version, 16), false);
```

### 如何使用 debounce 和 throttle 以及常见的坑

> 1.  不止一次地调用 \_.debounce 方法：

```
// 错误
$(window).on('scroll', function() {
   _.debounce(doSomething, 300);
});
// 正确
$(window).on('scroll', _.debounce(doSomething, 200));
```

### 总结

> * `debounce`：把触发非常频繁的事件（比如按键）合并成一次执行。
> * `throttle`：保证每 X 毫秒恒定的执行次数，比如每 200ms 检查下滚动位置，并触发 CSS 动画。
> * `requestAnimationFrame`：可替代 `throttle` ，函数需要重新计算和渲染屏幕上的元素时，想保证动画或变化的平滑性，可以用它。注意：IE9 不支持。

## 15
