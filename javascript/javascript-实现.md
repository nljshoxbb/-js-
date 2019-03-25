## 请用代码写出(今天是星期 x)其中 x 表示当天是星期几,如果当天是星期一,输出应该是"今天是星期一"

```
var days = ['日','一','二','三','四','五','六'];
var date = new Date();

console.log('今天是星期' + days[date.getDay()]);
```

## 现有一个 Page 类,其原型对象上有许多以 post 开头的方法(如 postMsg);另有一拦截函数 chekc,只返回 ture 或 false.请设计一个函数,该函数应批量改造原 Page 的 postXXX 方法,在保留其原有功能的同时,为每个 postXXX 方法增加拦截验证功能,当 chekc 返回 true 时继续执行原 postXXX 方法

```
function Page() {}

Page.prototype = {
  constructor: Page,

  postA: function (a) {
    console.log('a:' + a);
  },
  postB: function (b) {
    console.log('b:' + b);
  },
  postC: function (c) {
    console.log('c:' + c);
  },
  check: function () {
    return Math.random() > 0.5;
  }
}

function checkfy(obj){
    for(var key in obj){
        if(key.indexOf('post)===0 && typeof obj[key] === 'function'){
            (function(key){
                var fn  = obj[key];
                obj[key] = function(){
                    if(obj.check()){
                        fn.apply(obj,arguments);
                    }
                }
            })(key)
        }
    }
}


checkfy(Page.prototype);

var obj = new Page();

obj.postA('checkfy');
obj.postB('checkfy');
obj.postC('checkfy');
```

## 补充代码,鼠标单击 Button1 后将 Button1 移动到 Button2 的后面

- 如果要插入的 newElement 已经在 DOM 树中存在，那么执行此方法会将该节点从 DOM 树中移除。

```
<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <title>TEst</title>
</head>
<body>

<div>
   <input type="button" id ="button1" value="1" />
   <input type="button" id ="button2" value="2" />
</div>

<script type="text/javascript">
    var btn1 = document.getElementById('button1');
    var btn2 = document.getElementById('button2');

    addListener(btn1, 'click', function (event) {
        btn1.parentNode.insertBefore(btn2, btn1);
    });

    function addListener(elem, type, handler) {
        if (elem.addEventListener) {
            elem.addEventListener(type, handler, false);
            return handler;
        } else if (elem.attachEvent) {
            function wrapper() {
                var event = window.event;
                event.target = event.srcElement;
                handler.call(elem, event);
            }
            elem.attachEvent('on' + type, wrapper);
            return wrapper;
        }
    }

</script>
</body>
</html>
```

## 数组降维。完成一个函数,接受数组作为参数,数组元素为整数或者数组,数组元素包含整数或数组,函数返回扁平化后的数组

如：[1, [2, [ [3, 4], 5], 6]] => [1, 2, 3, 4, 5, 6]

```
    var data =  [1, [2, [ [3, 4], 5], 6]];

    function flat(data, result) {
        var i, d, len;
        for (i = 0, len = data.length; i < len; ++i) {
            d = data[i];
            if (typeof d === 'number') {
                result.push(d);
            } else {
                flat(d, result);
            }
        }
    }

    // 另一种
    function flatten(arr) {
        while (arr.some(item => Array.isArray(item))) {
            arr = [].concat(...arr);
        }
        return arr;
    }

    var result = [];
    flat(data, result);

    console.log(result);
```

## 请评价以下事件监听器代码并给出改进意见

```
if (window.addEventListener) {
  var addListener = function (el, type, listener, useCapture) {
    el.addEventListener(type, listener, useCapture);
  };
}
else if (document.all) {
  addListener = function (el, type, listener) {
    el.attachEvent('on' + type, function () {
      listener.apply(el);
    });
  };
}
```

作用：浏览器功能检测实现跨浏览器 DOM 事件绑定

优点：

1.  测试代码只运行一次，根据浏览器确定绑定方法
2.  通过`listener.apply(el)`解决 IE 下监听器 this 与标准不一致的地方
3.  在浏览器不支持的情况下提供简单的功能，在标准浏览器中提供捕获功能

缺点：

1.  `document.all`作为 IE 检测不可靠，应该使用`if(el.attachEvent)`
2.  addListener 在不同浏览器下 API 不一样
3.  `listener.apply`使 this 与标准一致但监听器无法移除
4.  未解决 IE 下 listener 参数`event.target`问题

改进:

```
var addListener;

if (window.addEventListener) {
  addListener = function (el, type, listener, useCapture) {
    el.addEventListener(type, listener, useCapture);
    return listener;
  };
}
else if (window.attachEvent) {
  addListener = function (el, type, listener) {
    // 标准化this，event，target
    var wrapper = function () {
      var event = window.event;
      event.target = event.srcElement;
      listener.call(el, event);
    };

    el.attachEvent('on' + type, wrapper);
    return wrapper;
    // 返回wrapper。调用者可以保存，以后remove
  };
}
```

## 编写一个函数接受 url 中 query string 为参数,返回解析后的 Object,query string 使用 application/x-www-form-urlencoded 编码

```
function parseQuery(query) {
    var result = {};

    // 如果不是字符串返回空对象
    if (typeof query !== 'string') {
        return result;
    }

    // 去掉字符串开头可能带的?
    if (query.charAt(0) === '?') {
        query = query.substring(1);
    }
    var pairs = query.split('&');
    var pair, key, value, i, len;

    for (i = 0, len = pairs.length; i < len; ++i) {
        pair = pairs[i].split('=');
        // application/x-www-form-urlencoded编码会将' '转换为+
        key = decodeURIComponent(pair[0]).replace(/\+/g, ' ');
        value = decodeURIComponent(pair[1]).replace(/\+/g, ' ');

        // 如果是新key,直接添加
        if (!(key in result)) {
            result[key] = value;
        } else if (isArray(result[key])) { //如果key已经出现一次以上，直接向数组添加value
            result[key].push(value);
        } else {  // key第二次出现，将结果改为数组
            var arr = [result[key]];
            arr.push(value);
            result[key] = arr;
        } // end if-else
    }
    return result;
}

function isArray(arg) {
    if (arg && typeof arg === 'object') {
        return Object.prototype.toString.call(arg) === '[object Array]';
    }
    return false;
}

console.log(parseQuery('sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8&espv=3&espv=5'));
```

## 完成函数 getViewportSize 返回指定窗口的视口尺寸

```
function getViewportSize(w) {
    w = w || window;

    // ie9 及标准浏览器中可使用此标准方法
    if ('innerHeight' in w) {
        return {
            width: w.innerWidth,
            height: w.innerHight
        }
    }

    var d = w.document;

    // ie8 以及浏览器在标准模式下
    // 表明当前文档的渲染模式是混杂模式还是"标准模式",如果文档处于“混杂模式”，则该属性值为"BackCompat"
    if (document.compatMode === 'CSS1Compat') {
        return {
            width: d.documentElement.clientWidth,
            height: d.documentElement.clientHeight
        };
    }

    // ie8及以下浏览器在怪癖模式下
    return {
        width: d.body.clientWidth,
        height: d.body.clientHeight
    }
}
```

## 完成函数 getScrollOffset 返回窗口滚动条偏移量

```
function getScrollOffset(w) {
    w = w || window;

    //如果是标准浏览器
    if (w.pageXOffset != null) {
        return {
            x: w.pageXOffset,
            y: y.pageYOffset
        }
    }

    // 老版本IE，根据兼容性不同访问不同元素
    var d = w.document;
    if (d.compatMode === 'CSS1Compat') {
        return {
            x: d.documentElement.scrollLeft,
            y: d.documentElement.scrollTop
        }
    }

    return {
        x: d.body.scrollLeft,
        y: d.body.scrollTop
    };
}
```

## 现有一个字符串 richText,是一段富文本,需要显示在页面上.有个要求,需要给其中只包含一个 img 元素的 p 标签增加一个叫 pic 的 class.请编写代码实现.可以使用 jQuery 或 KISSY.

```
function richText(text) {
    var div = document.createElement('div');
    div.innerHTML = text;
    var p = div.getElementsByTagName('p');
    var i, len;

    for (i = 0, len = p.length; i < len; ++i) {
        if (p[i].getElementsByTagName('img').length === 1) {
            p[i].classList.add('pic');
        }
    }

    return div.innerHTML;
}
```

## 编写一个函数将列表子元素顺序反转

```
<ul id="target">
    <li>1</li>
    <li>2</li>
    <li>3</li>
    <li>4</li>
</ul>

<script>
    var target = document.getElementById('target');
    var i;
    //创建一个新的空白的文档片段
    var frag = document.createDocumentFragment();

    for (i = target.children.length - 1; i >= 0; --i) {
        frag.appendChild(target.children[i]);
    }
    target.appendChild(frag);
</script>
```

## 使用原生 javascript 给下面列表中的 li 节点绑定点击事件,点击时创建一个 Object 对象,兼容 IE 和标准浏览器

```
<ul id="nav">
    <li><a href="http://11111">111</a></li>
    <li><a href="http://2222">222</a></li>
    <li><a href="http://333">333</a></li>
    <li><a href="http://444">444</a></li>
</ul>

Object:
{
    "index": 1,
    "name": "111",
    "link": "http://1111"
}
```

script:

```
var EventUtil = {
    getEvent: function (event) {
        return event || window.event;
    },
    getTarget: function (event) {
        return event.target || event.srcElement;
    },
    // 返回注册成功的监听器，IE中需要使用返回值来移除监听器
    on: function (elem, type, handler) {
        if (elem.addEventListener) {
            elem.addEventListener(type, handler, false);
            return handler;
        } else if (elem.attachEvent) {
            function wrapper(event) {
                return handler.call(elem, event);
            };
            elem.attachEvent('on' + type, wrapper);
            return wrapper;
        }
    },
    off: function (elem, type, handler) {
        if (elem.removeEventListener) {
            elem.removeEventListener(type, handler, false);
        } else if (elem.detachEvent) {
            elem.detachEvent('on' + type, handler);
        }
    },
    preventDefault: function (event) {
        if (event.preventDefault) {
            event.preventDefault();
        } else if ('returnValue' in event) {
            event.returnValue = false;
        }
    },
    stopPropagation: function (event) {
        if (event.stopPropagation) {
            event.stopPropagation();
        } else if ('cancelBubble' in event) {
            event.cancelBubble = true;
        }
    }
};
var DOMUtil = {
    text: function (elem) {
        if ('textContent' in elem) {
            return elem.textContent;
        } else if ('innerText' in elem) {
            return elem.innerText;
        }
    },
    prop: function (elem, propName) {
        return elem.getAttribute(propName);
    }
};

var nav = document.getElementById('nav');

EventUtil.on(nav, 'click', function (event) {
    var event = EventUtil.getEvent(event);
    var target = EventUtil.getTarget(event);

    var children = this.children;
    var i, len;
    var anchor;
    var obj = {};

    for (i = 0, len = children.length; i < len; ++i) {
        if (children[i] === target) {
            obj.index = i + 1;
            anchor = target.getElementsByTagName('a')[0];
            obj.name = DOMUtil.text(anchor);
            obj.link = DOMUtil.prop(anchor, 'href');
        }
    }

    alert('index: ' + obj.index + ' name: ' + obj.name +
        ' link: ' + obj.link);
});
```

## 有一个大数组,var a = ['1', '2', '3', ...];a 的长度是 100,内容填充随机整数的字符串.请先构造此数组 a,然后设计一个算法将其内容去重

```
    /**
    * 数组去重
    **/
    function normalize(arr) {
        if (arr && Array.isArray(arr)) {
            var i, len, map = {};
            for (i = arr.length; i >= 0; --i) {
                if (arr[i] in map) {
                    arr.splice(i, 1);
                } else {
                    map[arr[i]] = true;
                }
            }
        }
        return arr;
    }

    /**
    * 用100个随机整数对应的字符串填充数组。
    **/
    function fillArray(arr, start, end) {
        start = start == undefined ? 1 : start;
        end = end == undefined ?  100 : end;

        if (end <= start) {
            end = start + 100;
        }

        var width = end - start;
        var i;
        for (i = 100; i >= 1; --i) {
            arr.push('' + (Math.floor(Math.random() * width) + start));
        }
        return arr;
    }

    var input = [];
    fillArray(input, 1, 100);
    input.sort(function (a, b) {
        return a - b;
    });
    console.log(input);

    normalize(input);
    console.log(input);
```

## 请实现一个 Event 类,继承自此类的对象都会拥有两个方法 on,off,once 和 trigger

```
function Event() {
    if (!(this instanceof Event)) {
        return new Event();
    }
    this._callbacks = {};
}
Event.prototype.on = function (type, handler) {
    this_callbacks = this._callbacks || {};
    this._callbacks[type] = this.callbacks[type] || [];
    this._callbacks[type].push(handler);

    return this;
};

Event.prototype.off = function (type, handler) {
    var list = this._callbacks[type];

    if (list) {
        for (var i = list.length; i >= 0; --i) {
            if (list[i] === handler) {
                list.splice(i, 1);
            }
        }
    }

    return this;
};

Event.prototype.trigger = function (type, data) {
    var list = this._callbacks[type];

    if (list) {
        for (var i = 0, len = list.length; i < len; ++i) {
            list[i].call(this, data);
        }
    }
};

Event.prototype.once = function (type, handler) {
    var self = this;

    // 强绑定this （？？）
    function wrapper() {
        handler.apply(self, arguments);
        self.off(type, wrapper);
    }
    this.on(type, wrapper);
    return this;
};
```

## 观察者模式

```
var events = (function() {
  var topics = {};

  return {
    publish: function(topic, info) {
      console.log('publish a topic:' + topic);
      if (topics.hasOwnProperty(topic)) {
        topics[topic].forEach(function(handler) {
          handler(info ? info : {});
        })
      }
    },
    subscribe: function(topic, handler) {
      console.log('subscribe an topic:' + topic);
      if (!topics.hasOwnProperty(topic)) {
        topics[topic] = [];
      }

      topics[topic].push(handler);
    },
    remove: function(topic, handler) {
      if (!topics.hasOwnProperty(topic)) {
        return;
      }

      var handlerIndex = -1;
      topics[topic].forEach(function(element, index) {
        if (element === handler) {
          handlerIndex = index;
        }
      });

      if (handlerIndex >= 0) {
        topics[topic].splice(handlerIndex, 1);
      }
    },
    removeAll: function(topic) {
      console.log('remove all the handler on the topic:' + topic);
      if (topics.hasOwnProperty(topic)) {
        topics[topic].length = 0;
      }
    }
  }
})();

//主题监听函数
var handler = function(info) {
    console.log(info);
}
//订阅hello主题
events.subscribe('hello', handler);

//发布hello主题
events.publish('hello', 'hello world');
```

## 用 setTimeout 实现 setInterval

```
function mySetInterval(fn, millisec){
  function interval(){
    setTimeout(interval, millisec);
    fn();
  }
  setTimeout(interval, millisec)
}

console.log(mySetInterval(function(){console.log('xxx')},1000))
```

## lazyload

场景：涉及到图片，falsh 资源 , iframe, 网页编辑器(类似 FCK)等占用较大带宽，且这些模块暂且不在浏览器可视区内,因此可以使用 lazyload 在适当的时候加载该类资源.

优点：提升用户的体验，如果图片数量较大，打开页面的时候要将将页面上所有的图片全部获取加载，很可能会出现卡顿现象，影响用户体验。因此，有选择性地请求图片，这样能明显减少了服务器的压力和流量，也能够减小浏览器的负担。

原理:首先在渲染时，图片引用默认图片，然后把真实地址放在 `data-\*`属性上面。`<image src='./../assets/default.png' :data-src='item.allPics' class='lazyloadimg'>`然后是监听滚动，直接用`window.onscroll` 就可以了，但是要注意一点的是类似于 `window`的 `scroll` 和 `resize`，还有 `mousemove`这类触发很频繁的事件，最好用节流(throttle)或防抖函数(debounce)来控制一下触发频率。接着要判断图片是否出现在了视窗里面，主要是三个高度：1，当前 body 从顶部滚动了多少距离。2，视窗的高度。3，当前图片距离顶部的距离

实现：lazyload 的难点在如何在适当的时候加载用户需要的资源(这里用户需要的资源指该资源呈现在浏览器可视区域)。因此我们需要知道几点信息来确定目标是否已呈现在客户区,其中包括：

1.  当前 body 从顶部滚动了多少距离
2.  视窗的高度.
3.  当前图片距离顶部的距离

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

## jsDOM 操作有原生的 insertBefore 函数，但是没有 insertAfter，实现一个 insertAfter 函数

> js 原生方法 insertBefore 用于在某个元素之前插入新元素语法：`parentElement.insertBefore(newElement, referElement)`

- 1.  如果要插入的 newElement 已经在 DOM 树中存在，那么执行此方法会将该节点从 DOM 树中移除。
- 2.  如果`referElement`为 null，那么`newElement` 会被添加到父节点的子节点末尾

实现 insertAfter 功能

```
function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}
```

## 创建 ajax 过程

1.  创建 XMLHttpRequest 对象,也就是创建一个异步调用对象.
2.  创建一个新的 HTTP 请求,并指定该 HTTP 请求的方法、URL 及验证信息.
3.  设置响应 HTTP 请求状态变化的函数.
4.  发送 HTTP 请求.
5.  获取异步调用返回的数据.
6.  使用 JavaScript 和 DOM 实现局部刷新.

```
function createXHR() {
    if (typeof XMLHttpRequest != 'undefined') {
        return new XMLHttpRequest();
    } else if (typeof ActiveXObject != 'undefined') {
        if (typeof arguments.callee.activeXString != 'string') {
            var versions = [
                "MSXML2.XMLHtpp.6.0", "MSXML2.XMLHttp.3.0", "MSXML2.XMLHttp"
            ], i, len;
            for (i = 0, len = versions.length; i < len; i++) {
                try {
                    new ActiveXObject(versions[i]);
                    arguments.callee.activeXString = versions[i];
                    break;
                } catch (ex) {
                    // 跳过
                }
            }
            return new ActiveXObject(arguments.callee.activeXString);
        }
    } else {
        throw new Error('no xhr object')
    }
}

var xhr = createXHR();
xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
            alert(xhr.responseText);
        } else {
            alert('Request was unsuccessful' + xhr.status);
        }
    }
}

xhr.open('get', '/index', true);
xhr.send(null);

xhr.open('post', '/index', true);
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
var form = document.getElementById('form');
xhr.send(form);
```

## 编写一个方法 求一个字符串的字节长度

```
function GetBytes(str) {
    var len = str.length;
    var bytes = len;
    for (var i = 0; i < len; i++) {
        if (str.charCodeAt(i) > 255) bytes++;
    }
    return bytes;
}
alert(GetBytes("你好,as"));
```

## DOM 事件模型是如何的,编写一个 EventUtil 工具类实现事件管理兼容

- DOM 事件包含捕获（capture）和冒泡（bubble）两个阶段：捕获阶段事件从 `window` 开始触发事件然后通过祖先节点一次传递到触发事件的 DOM 元素上；冒泡阶段事件从初始元素依次向祖先节点传递直到 `window`
- 标准事件监听 `elem.addEventListener(type, handler, capture)/elem.removeEventListener(type, handler, capture)：handler` 接收保存事件信息的 event 对象作为参数，`event.target` 为触发事件的对象，`handler` 调用上下文 `this` 为绑定监听器的对象，`event.preventDefault()`取消事件默认行为，`event.stopPropagation()/event.stopImmediatePropagation()`取消事件传递
- 老版本 IE 事件监听`elem.attachEvent('on'+type, handler)/elem.detachEvent('on'+type, handler)：handler`不接收 `event` 作为参数，事件信息保存在 `window.event` 中，触发事件的对象为 `event.srcElement`，`handler` 执行上下文 `this` 为 `window` 使用闭包中调用 `handler.call(elem, event)`可模仿标准模型，然后返回闭包，保证了监听器的移除。`event.returnValue` 为 `false` 时取消事件默认行为，`event.cancleBubble` 为 `true` 时取消时间传播
- 通常利用事件冒泡机制托管事件处理程序提高程序性能。

```
/**
 * 跨浏览器事件处理工具。只支持冒泡。不支持捕获
 * @author  (qiu_deqing@126.com)
 */

var EventUtil = {
    getEvent: function (event) {
        return event || window.event;
    },
    getTarget: function (event) {
        return event.target || event.srcElement;
    },
    // 返回注册成功的监听器，IE中需要使用返回值来移除监听器
    on: function (elem, type, handler) {
        if (elem.addEventListener) {
            elem.addEventListener(type, handler, false);
            return handler;
        } else if (elem.attachEvent) {
            var wrapper = function () {
              var event = window.event;
              event.target = event.srcElement;
              handler.call(elem, event);
            };
            elem.attachEvent('on' + type, wrapper);
            return wrapper;
        }
    },
    off: function (elem, type, handler) {
        if (elem.removeEventListener) {
            elem.removeEventListener(type, handler, false);
        } else if (elem.detachEvent) {
            elem.detachEvent('on' + type, handler);
        }
    },
    preventDefault: function (event) {
        if (event.preventDefault) {
            event.preventDefault();
        } else if ('returnValue' in event) {
            event.returnValue = false;
        }
    },
    stopPropagation: function (event) {
        if (event.stopPropagation) {
            event.stopPropagation();
        } else if ('cancelBubble' in event) {
            event.cancelBubble = true;
        }
    },
    /**
     * keypress事件跨浏览器获取输入字符
     * 某些浏览器在一些特殊键上也触发keypress，此时返回null
     **/
     getChar: function (event) {
        if (event.which == null) {
            return String.fromCharCode(event.keyCode);  // IE
        }
        else if (event.which != 0 && event.charCode != 0) {
            return String.fromCharCode(event.which);    // the rest
        }
        else {
            return null;    // special key
        }
     }
};
```

## es6 中的扩展运算符...的实现原理

```
var a = {aa:1,bb:2,cc:3};

const {aa,...b} = a;

// babel解构实现
function _objectWithoutProperties(obj, keys) {
    var target = {};
    for (var i in obj) {
        if (keys.indexOf(i) >= 0) continue;
        if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
        target[i] = obj[i];
    }
    return target;
}

var a = { aa: 1, bb: 2, cc: 3 };

var aa = a.aa,
    b = _objectWithoutProperties(a, ["aa"]);
```

原理就是 es6 直接采用 `for of`，也就是说，所有总有迭代器的对象都能使用扩展运算符，在 es6 里说不能放前面的，但是在 es7 里如果**用于对象**是可以放前面

## 实现 destructuringArray 方法，达到如下效果

```
// destructuringArray( [1,[2,4],3], "[a,[b],c]" );
// result
// { a:1, b:2, c:3 }

const targetArray = [1, [2, 3], 4];
const formater = "[a, [b], c]";
const formaterArray = ['a', ['b'], 'c'];

const destructuringArray = (values, keys) => {
  try {
    const obj = {};
    if (typeof keys === 'string') {
      keys = JSON.parse(keys.replace(/\w+/g, '"$&"'));
    }

    const iterate = (values, keys) =>
      keys.forEach((key, i) => {
        if(Array.isArray(key)) iterate(values[i], key)
        else obj[key] = values[i]
      })

    iterate(values, keys)

    return obj;
  } catch (e) {
    console.error(e.message);
  }
}

console.dir(destructuringArray(targetArray,formater));
console.dir(destructuringArray(targetArray,formaterArray));
```

## 数字格式化 1234567890 -> 1,234,567,890

```
function formatNum (num) {
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
var num = '1234567890';
var res = formatNum(num);
console.log(res);
```

## 简单的字符串模板

```
var TemplateEngine = function (tpl, data) {
    var re = /<%([^%>]+)?%>/g, match;

    while (match = re.exec(tpl)) {
        tpl = tpl.replace(match[0], data[match[1]]);
    }
    return tpl;
}


var template = '<p>Hello, my name is <%name%>. I\'m <%age%> years old.</p>';
console.log(TemplateEngine(template, {
    name: "Yeaseon",
    age: 24
}));
```
