## 1. display:none 和 visibility:hidden 的区别？

联系：它们都能让元素不可见

1.  `display:none;`会让元素完全从渲染树中消失，渲染的时候不占据任何空间；`visibility: hidden;`不会让元素从渲染树消失，渲染师元素继续占据空间，只是内容不可见
2.  `display: none;`是非继承属性，子孙节点消失由于元素从渲染树消失造成，通过修改子孙节点属性无法显示；`visibility: hidden;`是继承属性，子孙节点消失由于继承了 hidden，通过设置 `visibility: visible;`可以让子孙节点显式
3.  修改常规流中元素的 display 通常会造成文档**重排**。修改 visibility 属性只会造成本元素的**重绘**。
4.  读屏器不会读取 `display: none;`元素内容；会读取 `visibility: hidden;`元素内容

## 2. position:absolute 和 float 属性的异同

共同点：对内联元素设置`float`和`absolute`属性，可以让元素脱离文档流，并且可以设置其宽高。

不同点：`float`仍会占据位置，`position`会覆盖文档流中的其他元素。

**position: relative 并没有改变行内元素的 Display 属性**

## 3. 介绍一下 box-sizing 属性

`box-sizing` 属性主要用来控制元素的盒模型的解析模式。默认值是 `content-box`。

* `content-box`：让元素维持 W3C 的标准盒模型。元素的宽度/高度由 `border + padding + content` 的宽度/高度决定，设置 `width/height` 属性指的是 `content` 部分的宽/高，一旦修改了元素的边框或内距，就会影响元素的盒子尺寸，就不得不重新计算元素的盒子尺寸，从而影响整个页面的布局。
* `border-box`：让元素维持 IE 传统盒模型（IE6 以下版本和 IE6~7 的怪异模式）。设置 `width/height` 属性指的是 `border + padding + content`

## 4. position 的值

* static 默认值。没有定位，元素出现在正常的流中
* relative 生成相对定位的元素，相对于其在普通流中的位置进行定位。
* absolute 生成绝对定位的元素， 相对于最近一级的 定位不是 static 的父元素来进行定位。
* fixed （老 IE 不支持）生成绝对定位的元素，相对于浏览器窗口进行定位。
* sticky 生成粘性定位的元素，容器的位置根据正常文档流计算得出，然后相对于该元素在流中的 flow root（BFC）和 containing block（最近的块级祖先元素）定位

## 5. CSS3 新特性

* CSS3 实现圆角（border-radius），阴影（box-shadow），
* 对文字加特效（text-shadow、），线性渐变（gradient），旋转（transform）
* transform:rotate(9deg) scale(0.85,0.90) translate(0px,-30px) skew(-9deg,0deg);//旋转,缩放,定位,倾斜。
* 增加了更多的 CSS 选择器 多背景 rgba;
* 在 CSS3 中唯一引入的伪元素是::selection;
* 媒体查询，多栏布局;
* border-image;

## 6. CSS sprites

> CSS Sprites 其实就是把网页中一些背景图片整合到一张图片文件中，再利用 CSS 的`background-image`，`background- repeat`，`background-position`的组合进行背景定位，`background-position`可以用数字能精确的定位出背景图片的位置。这样可以减少很多图片请求的开销，因为请求耗时比较长；请求虽然可以并发，但是也有限制，一般浏览器都是 6 个。对于未来而言，就不需要这样做了，因为有了`http2`。

## 7. 解释下浮动和它的工作原理？清除浮动的技巧

> 浮动元素脱离文档流，不占据空间。浮动元素碰到包含它的边框或者浮动元素的边框停留。

1.  使用空标签清除浮动。这种方法是在所有浮动标签后面添加一个空标签 定义 css clear:both. 弊端就是增加了无意义标签。
2.  使用 overflow。设置 overflow 为 hidden（触发 bfc） 或者 auto，给包含浮动元素的父标签添加 css 属性 overflow:auto; zoom:1; zoom:1 用于兼容 IE6。
3.  使用 after 伪对象清除浮动。该方法只适用于非 IE 浏览器。该方法中必须为需要清除浮动元素的伪对象中设置 height:0，否则该元素会比实际高出若干像素；

### 1. 添加额外标签(不推荐)

```
<div class="wrap">
    <h2>1）添加额外标签</h2>
    <div class="box1 left">box1   float:left;</div>
    <div class="box2 left">box2   float:left;</div>
    <div style="clear:both;"></div>
</div>
```

### 2. 使用 br 标签及自身 html 属性(不推荐)

```
<div class="wrap">
    <h2>2)使用 br标签和其自身的 html属性</h2>
    <div class="box1 left">box1   float:left;</div>
    <div class="box2 left">box2   float:left;</div>
    <br clear="all" />
</div>
<div class="footer">.footer</div>
```

### 3. 父元素设置 overflow 属性(不推荐)

```
.clear{
    overflow:hidden;
    *zoom:1;
}

<div class="wrap clear"  >
    <h2>3) 父元素设置 overflow </h2>
    <div class="box1 left">box1   float:left;</div>
    <div class="box2 left">box2   float:left;</div>
</div>
```

> **缺点** overflow:hidden; 内容增多时候容易造成不会自动换行导致内容被隐藏掉，无法显示需要溢出的元素；不要使用 overflow:auto; 多层嵌套后，firefox 与 IE 可能会出现显示错误；不要使用

### 4. 父元素也设置浮动(不推荐)

```
<div class="wrap left"  >
    <h2>4) 父元素也设置浮动 </h2>
    <div class="box1 left">box1   float:left;</div>
    <div class="box2 left">box2   float:left;</div>
</div>
```

> **缺点** 使得与父元素相邻的元素的布局会受到影响，不可能一直浮动到 body，不推荐使用

### 5. 父元素设置 display:table(不推荐)

```
.clear{
   display:table;
}

<div class="wrap clear"  >
    <h2>5) 父元素设置display:table </h2>
    <div class="box1 left">box1   float:left;</div>
    <div class="box2 left">box2   float:left;</div>
</div>
```

> **缺点** 盒模型属性已经改变，由此造成的一系列问题，得不偿失，不推荐使用

### 6. 使用:after 伪元素(推荐)

```
.clearfix:after {
    content: ".";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
}
.clearfix{
     *zoom:1;
}
<div class="wrap clearfix"  >
    <h2>6) 使用:after伪元素 </h2>
    <div class="box1 left">box1   float:left;</div>
    <div class="box2 left">box2   float:left;</div>
</div>
```

* display:block 使生成的元素以块级元素显示,占满剩余空间;
* height:0 避免生成内容破坏原有布局的高度。
* visibility:hidden 使生成的内容不可见，并允许可能被生成内容盖住的内容可以进行点击和交互;
* 通过 content:”.”生成内容作为最后一个元素，至于 content 里面是点还是其他都是可以的，例如 oocss 里面就有经典的 content:”XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX”,有些版本可能 content 里面内容为空,不推荐这样做的,firefox 直到 7.0 content:”” 仍然会产生额外的空隙；
* zoom：1 触发 IE hasLayout。通过分析发现，除了 clear：both 用来闭合浮动的，其他代码无非都是为了隐藏掉 content 生成的内容，这也就是其他版本的闭合浮动为什么会有 font-size：0，line-height：0。

```
#box:after{
    content:".";
    height:0;
    visibility:hidden;
    display:block;
    clear:both;
}
```

> 闭合浮动的原理为什么设置父元素 overflow 或者 display:table 可以闭合浮动?
> 其原理为 Block formatting contexts （块级格式化上下文），以下简称 BFC
> CSS3 里面对这个规范做了改动，称之为： flow root ，并且对触发条件进行了进一步说明

#### 建议

在写的时候尽量用同一方向的 margin，比如都设置为 top 或者 bottom，因为你在实践的时候有时不需要为每个元素设置浮动、inline-block 或者 absolute 。

## 8. 浮动元素引起的问题

1.  父元素的高度无法被撑开，影响与父元素同级的元素
2.  与浮动元素同级的非浮动元素（内联元素）会跟随其后
3.  若非第一个元素浮动，则该元素之前的元素也需要浮动，否则会影响页面显示的结构

## 9. link 和@import 的区别?

```
<link rel="stylesheet" rev="stylesheet" href="CSS文件" type="text/css" media="all" />
<style type="text/css" media="screen">
@import url("CSS文件");
</style>
```

> **两者都是外部引用 CSS 的方式，但是存在一定的区别**

* link 是 XHTML 标签，除了加载 CSS 外，还可以定义 RSS 等其他事务；@import 属于 CSS 范畴，只能加载 CSS
* link 引用 CSS 时，在页面载入时同时加载；@import 需要页面网页完全载入以后加载
* link 是 XHTML 标签，无兼容问题；@import 是在 CSS2.1 提出的，低版本的浏览器不支持。
* link 支持使用 Javascript 控制 DOM 去改变样式；而@import 不支持。
* link 最大限度支持并行下载，@import 过多嵌套导致串行下载

## 10.如何在页面上实现一个圆形的可点击区域 3.纯 js 实现 需要求一个点在不在圆上简单算法、获取鼠标坐标等等

```
1.map+area或者svg
<img id="blue" class="click-area" src="blue.gif" usemap="#Map" />
<map name="Map" id="Map" class="click-area">  <area shape="circle" coords="50,50,50"/>
</map>

2.border-radius
#red{
 cursor:pointer;
 background:red;
 width:100px;
 height:100px;
 border-radius:50%;
}

3.使用js检测鼠标位置
$("#yellow").on('click',function(e) {
  var r = 50;
  var x1 = $(this).offset().left+$(this).width()/2;
  var y1 = $(this).offset().top+$(this).height()/2;
  var x2= e.clientX;
  var y2= e.clientY;
  var distance = Math.abs(Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)));
  if (distance <= 50)
    alert("Yes!");
});
```

## 11. 实现不使用 border 画出 1px 高的线，在不同浏览器的标准模式与怪异模式下都能保持一致的效果？

```
<div style="height:1px;overflow:hidden;background:red"></div>
```

## 12. px/em/rem 区别

> * `px` 在缩放页面时无法调整那些使用它作为单位的字体、按钮等的大小
> * `em` 的值并不是固定的，会继承父级元素的字体大小，代表倍数；
> * `rem` 的值并不是固定的，始终是基于根元素 `<html>` 的，也代表倍数。

### em

> em 的使用是相对于其父级的字体大小的，即倍数。浏览器的默认字体高都是 16px，未经调整的浏览器显示 1em = 16px。但是有一个问题，如果设置 1.2em 则变成 19.2px，问题是 px 表示大小时数值会忽略掉小数位的（你想像不出来半个像素吧）。而且 1em = 16px 的关系不好转换，因此，常常人为地使 1em = 10px。这里要借助字体的 % 来作为桥梁。

> 但是由于 em 是相对于其父级字体的倍数的，当出现有多重嵌套内容时，使用 em 分别给它们设置字体的大小往往要重新计算

```
body { font-size: 62.5%; }
span { font-size: 1.6em; }
<span>Outer <span>inner</span> outer</span>
```

> 结果：外层 `<span>` 为 body 字体 10px 的 1.6 倍 = 16px，内层 `<span>` 为外层内容字体 16px 的 1.6 倍 = 25px（或 26px，不同浏览器取舍小数不同）明显地，内部 `<span>`内的文字受到了父级 `<span>` 的影响。基于这点，在实际使用中给我们的计算带来了很大的不便。

### rem

> rem 的出现再也不用担心还要根据父级元素的 font-size 计算 em 值了，因为它始终是基于根元素`<html>`的。比如默认的 html font-size=16px，那么想设置 12px 的文字就是：12÷16=0.75(rem)仍然是上面的例子，CSS 改为

```
html { font-size: 62.5%; }
span { font-size: 16px; font-size: 1.6rem; }
```

> 需要注意的是，为了兼容不支持 rem 的浏览器，我们需要在各个使用了 rem 地方前面写上对应的 px 值，这样不支持的浏览器可以优雅降级

## 13.有没有遇到过 margin 重叠的现象

> 当相邻元素都设置了 `margin` 边距时，`margin` 将取最大值，舍弃小值。为了不让边距重叠，可以给子元素加一个父元素，并设置该父元素为 BFC：`overflow: hidden`;

```
<div class="box" id="box">
  <p>Lorem ipsum dolor sit.</p>

  <div style="overflow: hidden;">
    <p>Lorem ipsum dolor sit.</p>
  </div>

  <p>Lorem ipsum dolor sit.</p>
</div>
```

## 14.Boostrap 清除浮动的 css

```
.clearfix:before,
.clearfix:after {
    content: " ";
    display: table;
}

.clearfix:after {
    clear: both;
}

/**
 * For IE 6/7 only
 */
.clearfix {
    *zoom: 1;
}
```

### `:after` 伪类在元素末尾插入了一个包含空格的字符，并设置 display 为 `table`

* `display:table` 会创建一个匿名的 `table-cell`，从而触发块级上下文（BFC），因为容器内 `float` 的元素也是 BFC，**由于 BFC 有不能互相重叠的特性**，并且设置了 `clear: both`，`:after` 插入的元素会被挤到容器底部，从而将容器撑高。并且设置`display:table`后，content 中的空格字符会被渲染为 `0\*0`的空白元素，不会占用页面空间。
* `content` 包含一个空格，是为了解决 Opera 浏览器的 BUG。当 HTML 中包含 contenteditable 属性时，如果 `content` 没有包含空格，会造成清除浮动元素的顶部、底部有一个空白（设置 `font-size`：0 也可以解决这个问题）。

### `:after` 伪类的设置已经达到了清除浮动的目的，但还要设置`:before 伪类`，原因如下

* `:before` 的设置也触发了一个 BFC，由于 BFC 有内部布局不受外部影响的特性，因此`:before` 的设置可以阻止 `margin-top` 的合并。
* 这样做，其一是为了和其他清除浮动的方式的效果保持一致；其二，是为了与 ie6/7 下设置 `zoom：1` 后的效果一致（即阻止 `margin-top` 合并的效果）。

### `zoom: 1` 用于在 ie6/7 下触发 `haslayout` 和 `contain floats`

## 15. CSS 选择符有哪些？哪些属性可以继承？优先级算法如何计算？ CSS3 新增伪类有那些？

```
1.  id 选择器（ # myid）
2.  类选择器（.myclassname）
3.  标签选择器（div, h1, p）
4.  相邻选择器（h1 + p）
5.  子选择器（ul > li）
6.  后代选择器（li a）
7.  通配符选择器（ \* ）
8.  属性选择器（a[rel = "external"]）
9.  伪类选择器（a: hover, li:nth-child）
```

优先级为:
`!important > id > class > tag`

`important` 比 内联优先级高,但内联比 `id` 要高

### CSS3 新增伪类举例：

```
1.  p:first-of-type 选择属于其父元素的首个 <p> 元素的每个 <p> 元素。
2.  p:last-of-type 选择属于其父元素的最后 <p> 元素的每个 <p> 元素。
3.  p:only-of-type 选择属于其父元素唯一的 <p> 元素的每个 <p> 元素。
4.  p:only-child 选择属于其父元素的唯一子元素的每个 <p> 元素。
5.  p:nth-child(2) 选择属于其父元素的第二个子元素的每个 <p> 元素。
6.  :enabled :disabled 控制表单控件的禁用状态。
7.  :checked 单选框或复选框被选中。
```

## 16.`display: block;`和`display: inline;`的区别

`block`元素特点：

1.  处于常规流中时，如果`width`没有设置，会自动填充满父容器
2.  可以应用`margin/padding`
3.  在没有设置高度的情况下会扩展高度以包含常规流中的子元素
4.  处于常规流中时布局时在前后元素位置之间（独占一个水平空间）
5.  忽略`vertical-align`

`inline`元素特点

1.  水平方向上根据`direction`依次布局
2.  不会在元素前后进行换行
3.  受`white-space`控制
4.  `margin/padding`在竖直方向上无效，水平方向上有效
5.  `width/height`属性对非替换行内元素无效，宽度由元素内容决定
6.  非替换行内元素的行框高由`line-height`确定，替换行内元素的行框高由`height`,`margin`,`padding`,`border`决定
7.  浮动或绝对定位时会转换为`block`
8.  `vertical-align`属性生效

## 18 对 BFC 规范的理解？

BFC，块级格式化上下文，一个创建了新的 BFC 的盒子是独立布局的，盒子里面的子元素的样式不会影响到外面的元素。在同一个 BFC 中的两个毗邻的块级盒在垂直方向（和布局方向有关系）的 margin 会发生折叠。（W3C CSS 2.1 规范中的一个概念，它决定了元素如何对其内容进行布局，以及与其他元素的关系和相互作用。

> 创建 BFC 的初衷只是为了让元素本身（包括它的子元素）能够正确的计算自己的宽高。

### BFC 的特性

* 块级格式化上下文会阻止外边距叠加(有争议)
* 块级格式化上下文不会重叠浮动元素
* 块级格式化上下文通常可以包含浮动

### 如何触发 BFC?

1.  根元素
2.  浮动元素（`float`不是`none`）
3.  绝对定位元素（`position`取值为`absolute`或`fixed`）
4.  `display`取值为`inline-block`,`table-cell`, `table-caption`,`flex`, `inline-flex`之一的元素
5.  `overflow`不是`visible`的元素

### 作用

1.  可以包含浮动元素
2.  不被浮动元素覆盖
3.  阻止父子元素的 margin 折叠

> 相邻元素不发生折叠的因素是触发 BFC 因素的子集，也就是说如果我为上下相邻的元素设置了 overflow:hidden，虽然触发了 BFC，但是上下元素的上下 margin 还是会发生折叠创建 BFC 的初衷只是为了让元素本身（包括它的子元素）能够正确的计算自己的宽高。

## 19 display,float,position的关系

1. 如果``display``为none，那么position和float都不起作用，这种情况下元素不产生框
2. 否则，如果position值为absolute或者fixed，框就是绝对定位的，float的计算值为none，display根据下面的表格进行调整。
3. 否则，如果float不是none，框是浮动的，display根据下表进行调整
4. 否则，如果元素是根元素，display根据下表进行调整
5. 其他情况下display的值为指定值
总结起来：**绝对定位、浮动、根元素都需要调整``display``**
![display转换规则](img/display-adjust.png)