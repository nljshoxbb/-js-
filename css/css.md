# display:none 和 visibility:hidden 的区别？

联系：它们都能让元素不可见

1.  `display:none;`会让元素完全从渲染树中消失，渲染的时候不占据任何空间；`visibility: hidden;`不会让元素从渲染树消失，渲染师元素继续占据空间，只是内容不可见
2.  `display: none;`是非继承属性，子孙节点消失由于元素从渲染树消失造成，通过修改子孙节点属性无法显示；`visibility: hidden;`是继承属性，子孙节点消失由于继承了 hidden，通过设置 `visibility: visible;`可以让子孙节点显式
3.  修改常规流中元素的 display 通常会造成文档 **重排**。修改 visibility 属性只会造成本元素的 **重绘**。
4.  读屏器不会读取 `display: none;`元素内容；会读取 `visibility: hidden;`元素内容

# position:absolute 和 float 属性的异同

共同点：对内联元素设置`float`和`absolute`属性，可以让元素脱离文档流，并且可以设置其宽高。

不同点：`float`仍会占据位置，`position`会覆盖文档流中的其他元素。

`position: relative`并没有改变行内元素的 `display`属性

# 介绍一下 box-sizing 属性

设置 CSS 盒模型为标准模型或 IE 模型。标准模型的宽度只包括`content`，IE 模型包括`border`和`padding` `box-sizing`属性可以为三个值之一：

- `content-box`，默认值，只计算内容的宽度，`border`和`padding`不计算入`width`之内
- `padding-box`，`padding`计算入宽度内
- `border-box`，`border`和`padding`计算入宽度之内

# position 的值

- `static` 默认值。没有定位，元素出现在正常的流中。(此时会忽略任何 `top`、 `bottom`、`left` 或 `right` 声明)
- `relative` 生成相对定位的元素，相对于其在普通流中的位置进行定位。它偏移的值都以它原来的位置为基准偏移，而不管其他元素会怎么样。注意 `relative` 移动后的元素在原来的位置仍占据空间。
- `absolute` 父容器设置了 position 属性，并且 position 的属性值为 `absolute` 或者 `relative`，那么就会依据父容器进行偏移。如果其父容器没有设置 position 属性，那么偏移是以 body 为依据。注意设置 `absolute` 属性的元素在标准流中不占位置。
- fixed （老 IE 不支持）生成绝对定位的元素，相对于浏览器窗口进行定位。
- sticky 生成粘性定位的元素，容器的位置根据正常文档流计算得出，然后相对于该元素在流中的 flow root（BFC）和 containing block（最近的块级祖先元素）定位

# CSS3 新特性

- CSS3 实现圆角（`border-radius`），阴影（`box-shadow`），
- 对文字加特效（`text-shadow`），线性渐变（`gradient`），旋转（`transform`）
- `transform:rotate(9deg) scale(0.85,0.90) translate(0px,-30px) skew(-9deg,0deg);`//旋转,缩放,定位,倾斜。
- 增加了更多的 CSS 选择器 多背景 `rgba`;
- 在 CSS3 中唯一引入的伪元素是`::selection`;
- 伪类选择器：`:target`, `:enabled`, `:disabed`, `:first-child`, `last-child`
- 媒体查询（`@media`），多栏布局（`columns`）;
- border-image;
- `animation`:动画，3D 可以调用硬件渲染。
- 新的长度单位：`rem`， `ch`，`vw`，`vh`，`vmax`，`vmin` 等。
- `flex`: `flex`布局

# CSS sprites

CSS Sprites 其实就是把网页中一些背景图片整合到一张图片文件中，再利用 CSS 的`background-image`，`background-repeat`，`background-position`的组合进行背景定位，`background-position`可以用数字能精确的定位出背景图片的位置。

- 这样可以减少很多图片请求的开销，因为请求耗时比较长；
- 请求虽然可以并发，但是也有限制，一般浏览器都是 6 个。对于未来而言，就不需要这样做了，因为有了`http2`。

# 解释下浮动和它的工作原理？清除浮动的技巧

## (1) 浮动的特性

浮动元素脱离文档流，不占据空间。浮动元素碰到包含它的边框或者浮动元素的边框停留。

- 浮动元素会从普通文档流中脱离，但浮动元素影响的不仅是自己，它会影响周围的元素对齐进行环绕。
- 不管一个元素是行内元素还是块级元素，如果被设置了浮动，那浮动元素会生成一个块级框，可以设置它的 width 和 height，因此 float 常常用于制作横向配列的菜单，可以设置大小并且横向排列

## (2) 浮动元素的展示在不同情况下会有不同的规则：

- 浮动元素在浮动的时候，其 `margin` 不会超过包含块的 `padding`。PS：如果想要元素超出，可以设置 `margin` 属性
- 如果两个元素一个向左浮动，一个向右浮动，左浮动元素的 `marginRight` 不会和右浮动元素的 `marginLeft` 相邻。
- 如果有多个浮动元素，浮动元素会按顺序排下来而不会发生重叠的现象。
- 如果有多个浮动元素，后面的元素高度不会超过前面的元素，并且不会超过包含块。
- 如果有非浮动元素和浮动元素同时存在，并且非浮动元素在前，则浮动元素不会高于非浮动元素
- 浮动元素会尽可能地向顶端对齐、向左或向右对齐

## (3) 重叠问题

- **行内元素**与浮动元素发生重叠，其边框，背景和内容都会显示在浮动元素之上
- **块级元素**与浮动元素发生重叠，边框和背景会显示在浮动元素之下，内容会显示在浮动元素之上

## (4) 父元素高度塌陷问题

一个块级元素如果没有设置 `height`，其 `height` 是由子元素撑开的。对子元素使用了浮动之后，子元素会脱离标准文档流，也就是说，父级元素中没有内容可以撑开其高度，这样父级元素的 `height` 就会被忽略，这就是所谓的高度塌陷。

## (5) 清除浮动的方法

- 使用空标签清除浮动。这种方法是在所有浮动标签后面添加一个空标签 定义 css `clear:both`. 弊端就是增加了无意义标签。
- 使用`overflow`。设置 `overflow` 为 `hidden`（触发 bfc） 或者 `auto`，给包含浮动元素的父标签添加 css 属性 `overflow:auto; zoom:1`; zoom:1 用于兼容 IE6。
- 使用 `after` 伪对象清除浮动。该方法只适用于非 IE 浏览器。该方法中必须为需要清除浮动元素的伪对象中设置 `height:0`，否则该元素会比实际高出若干像素；

### 5.1 添加额外标签(不推荐)

```
<div class="wrap">
    <h2>1）添加额外标签</h2>
    <div class="box1 left">box1   float:left;</div>
    <div class="box2 left">box2   float:left;</div>
    <div style="clear:both;"></div>
</div>
```

### 5.2 使用 br 标签及自身 html 属性(不推荐)

```
<div class="wrap">
    <h2>2)使用 br标签和其自身的 html属性</h2>
    <div class="box1 left">box1   float:left;</div>
    <div class="box2 left">box2   float:left;</div>
    <br clear="all" />
</div>
<div class="footer">.footer</div>
```

### 5.3 父元素设置 overflow 属性(不推荐)

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

**优点** 代码简洁，不存在结构和语义化问题

**缺点** `overflow:hidden`; 内容增多时候容易造成不会自动换行导致内容被隐藏掉，无法显示需要溢出的元素；不要使用 `overflow:auto`; 多层嵌套后，firefox 与 IE 可能会出现显示错误

### 5.4 父元素也设置浮动(不推荐)

```
<div class="wrap left"  >
    <h2>4) 父元素也设置浮动 </h2>
    <div class="box1 left">box1   float:left;</div>
    <div class="box2 left">box2   float:left;</div>
</div>
```

**缺点** 使得与父元素相邻的元素的布局会受到影响，不可能一直浮动到 body，不推荐使用

### 5.5 父元素设置 display:table(不推荐)

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

**缺点** 盒模型属性已经改变，由此造成的一系列问题，得不偿失，不推荐使用

### 5.6 使用:after 伪元素(推荐)

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

- `display:block` 使生成的元素以块级元素显示,占满剩余空间;
- `height:0` 避免生成内容破坏原有布局的高度。
- `visibility:hidden` 使生成的内容不可见，并允许可能被生成内容盖住的内容可以进行点击和交互;
- 通过 `content:”.”`生成内容作为最后一个元素，至于 content 里面是点还是其他都是可以的，例如 oocss 里面就有经典的 `content:”XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX”`,有些版本可能 content 里面内容为空,不推荐这样做的,firefox 直到 7.0 content:”” 仍然会产生额外的空隙；
- `zoom：1` 触发 IE hasLayout。通过分析发现，除了 `clear：both` 用来闭合浮动的，其他代码无非都是为了隐藏掉 content 生成的内容，这也就是其他版本的闭合浮动为什么会有 `font-size：0`，`line-height：0`。

## (6) 闭合浮动的原理为什么设置父元素 overflow 或者 display:table 可以闭合浮动?

其原理为 Block formatting contexts （块级格式化上下文），以下简称 BFC。CSS3 里面对这个规范做了改动，称之为： flow root ，并且对触发条件进行了进一步说明

### 建议

在写的时候尽量用同一方向的 margin，比如都设置为 top 或者 bottom，因为你在实践的时候有时不需要为每个元素设置浮动、inline-block 或者 absolute 。

# 浮动元素引起的问题

1.  父元素的高度无法被撑开，影响与父元素同级的元素
2.  与浮动元素同级的非浮动元素（内联元素）会跟随其后
3.  若非第一个元素浮动，则该元素之前的元素也需要浮动，否则会影响页面显示的结构

# link 和@import 的区别?

```
<link rel="stylesheet" rev="stylesheet" href="CSS文件" type="text/css" media="all" />
<style type="text/css" media="screen">
@import url("CSS文件");
</style>
```

> **两者都是外部引用 CSS 的方式，但是存在一定的区别**

- link 是 XHTML 标签，除了加载 CSS 外，还可以定义 RSS 等其他事务；@import 属于 CSS 范畴，只能加载 CSS
- link 引用 CSS 时，在页面载入时同时加载；@import 需要页面网页完全载入以后加载
- link 是 XHTML 标签，无兼容问题；@import 是在 CSS2.1 提出的，低版本的浏览器不支持。
- link 支持使用 Javascript 控制 DOM 去改变样式；而@import 不支持。
- link 最大限度支持并行下载，@import 过多嵌套导致串行下载

# 如何在页面上实现一个圆形的可点击区域 3.纯 js 实现 需要求一个点在不在圆上简单算法、获取鼠标坐标等等

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

# 实现不使用 border 画出 1px 高的线，在不同浏览器的标准模式与怪异模式下都能保持一致的效果？

```
<div style="height:1px;overflow:hidden;background:red"></div>
```

# px/em/rem 区别

- `px` 在缩放页面时无法调整那些使用它作为单位的字体、按钮等的大小
- `em` 的值并不是固定的，会继承父级元素的字体大小，代表倍数；
- `rem` 的值并不是固定的，始终是基于根元素 `<html>` 的，也代表倍数。

## (1) em

em 的使用是相对于其父级的字体大小的，即倍数。浏览器的默认字体高都是 16px，未经调整的浏览器显示 1em = 16px。但是有一个问题，如果设置 1.2em 则变成 19.2px，问题是 px 表示大小时数值会忽略掉小数位的（你想像不出来半个像素吧）。而且 1em = 16px 的关系不好转换，因此，常常人为地使 1em = 10px。这里要借助字体的 % 来作为桥梁。

但是由于 em 是相对于其父级字体的倍数的，当出现有多重嵌套内容时，使用 em 分别给它们设置字体的大小往往要重新计算

```
body { font-size: 62.5%; }
span { font-size: 1.6em; }
<span>Outer <span>inner</span> outer</span>
```

> 结果：外层 `<span>` 为 body 字体 10px 的 1.6 倍 = 16px，内层 `<span>` 为外层内容字体 16px 的 1.6 倍 = 25px（或 26px，不同浏览器取舍小数不同）明显地，内部 `<span>`内的文字受到了父级 `<span>` 的影响。基于这点，在实际使用中给我们的计算带来了很大的不便。

## (2) rem

rem 的出现再也不用担心还要根据父级元素的 `font-size` 计算 em 值了，因为它始终是基于根元素`<html>`的。比如默认的 html `font-size=16px`，那么想设置 `12px` 的文字就是：12÷16=0.75(rem)仍然是上面的例子，CSS 改为

```
html { font-size: 62.5%; }
span { font-size: 16px; font-size: 1.6rem; }
```

需要注意的是，为了兼容不支持 rem 的浏览器，我们需要在各个使用了 rem 地方前面写上对应的 px 值，这样不支持的浏览器可以优雅降级

# 有没有遇到过 margin 重叠的现象

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

# Boostrap 清除浮动的 css

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

## (1) `:after` 伪类在元素末尾插入了一个包含空格的字符，并设置 display 为 `table`

- `display:table` 会创建一个匿名的 `table-cell`，从而触发块级上下文（BFC），因为容器内 `float` 的元素也是 BFC，**由于 BFC 有不能互相重叠的特性**，并且设置了 `clear: both`，`:after` 插入的元素会被挤到容器底部，从而将容器撑高。并且设置`display:table`后，content 中的空格字符会被渲染为 `0\*0`的空白元素，不会占用页面空间。
- `content` 包含一个空格，是为了解决 Opera 浏览器的 BUG。当 HTML 中包含 contenteditable 属性时，如果 `content` 没有包含空格，会造成清除浮动元素的顶部、底部有一个空白（设置 `font-size`：0 也可以解决这个问题）。

## (2) `:after` 伪类的设置已经达到了清除浮动的目的，但还要设置`:before 伪类`，原因如下

- `:before` 的设置也触发了一个 BFC，由于 BFC 有内部布局不受外部影响的特性，因此`:before` 的设置可以阻止 `margin-top` 的合并。
- 这样做，其一是为了和其他清除浮动的方式的效果保持一致；其二，是为了与 ie6/7 下设置 `zoom：1` 后的效果一致（即阻止 `margin-top` 合并的效果）。

## (3) `zoom: 1` 用于在 ie6/7 下触发 `haslayout` 和 `contain floats`

# CSS 选择符有哪些？哪些属性可以继承？优先级算法如何计算？ CSS3 新增伪类有那些？

1.  id 选择器（`# myid`）
2.  类选择器（`.myclassname`）
3.  标签选择器（`div, h1, p`）
4.  相邻选择器（`h1 + p`）
5.  子选择器（`ul > li`）
6.  后代选择器（`li a`）
7.  通配符选择器（ `\*` ）
8.  属性选择器（`a[rel = "external"]`）
9.  伪类选择器（`a: hover, li:nth-child`）

优先级为:
`!important > id > class > tag`

`important` 比 内联优先级高,但内联比 `id` 要高

## CSS3 新增伪类举例：

1.  `p:first-of-type` 选择属于其父元素的首个 `<p>` 元素的每个 `<p>` 元素。
2.  `p:last-of-type` 选择属于其父元素的最后 `<p>` 元素的每个 `<p>` 元素。
3.  `p:only-of-type` 选择属于其父元素唯一的 `<p>` 元素的每个 `<p>` 元素。
4.  `p:only-child` 选择属于其父元素的唯一子元素的每个 `<p>` 元素。
5.  `p:nth-child(2)` 选择属于其父元素的第二个子元素的每个 `<p>` 元素。
6.  `:enabled :disabled` 控制表单控件的禁用状态。
7.  `:checked` 单选框或复选框被选中。

# `display: block;`和`display: inline;`的区别

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

# 对 BFC 规范的理解？

## (1) 定义

BFC(Block formatting context)直译为"块级格式化上下文"。它是一个独立的渲染区域，只有 Block-level box 参与， 它规定了内部的 Block-level Box 如何布局，并且与这个区域外部毫不相干。

> 创建 BFC 的初衷只是为了让元素本身（包括它的子元素）能够正确的计算自己的宽高。

## (2) BFC 布局规则

- BFC 这个元素的垂直方向的边距会发生重叠，垂直方向的距离由`margin`决定，取最大值
- BFC 的区域不会与浮动盒子重叠（清除浮动原理）
- 计算 BFC 的高度时，浮动元素也参与计算。

## (3) BFC 的特性

- 块级格式化上下文会阻止外边距叠加(有争议)
- 块级格式化上下文不会重叠浮动元素
- 块级格式化上下文通常可以包含浮动

## (4) 如何触发(生成) BFC?

1.  根元素
2.  浮动元素（`float`不是`none`）
3.  绝对定位元素（`position`取值为`absolute`或`fixed`）
4.  `display`取值为`inline-block`,`table-cell`, `table-caption`,`flex`, `inline-flex`之一的元素
5.  `overflow`不是`visible`的元素

## (5) 作用

1.  可以包含浮动元素
2.  不被浮动元素覆盖
3.  阻止父子元素的 margin 折叠

> 相邻元素不发生折叠的因素是触发 BFC 因素的子集，也就是说如果我为上下相邻的元素设置了 overflow:hidden，虽然触发了 BFC，但是上下元素的上下 margin 还是会发生折叠创建 BFC 的初衷只是为了让元素本身（包括它的子元素）能够正确的计算自己的宽高。

# display,float,position 的关系

1.  如果`display`为 none，那么 position 和 float 都不起作用，这种情况下元素不产生框
2.  否则，如果 position 值为 absolute 或者 fixed，框就是绝对定位的，float 的计算值为 none，display 根据下面的表格进行调整。
3.  否则，如果 float 不是 none，框是浮动的，display 根据下表进行调整
4.  否则，如果元素是根元素，display 根据下表进行调整
5.  其他情况下 display 的值为指定值总结起来：**绝对定位、浮动、根元素都需要调整`display`**
    ![display转换规则](img/display-adjust.png)

# CSS 隐藏元素的几种方式及区别

## (1) display:none

- 元素在页面上将彻底消失，元素本来占有的空间就会被其他元素占有，也就是说它会导致浏览器的重排和重绘。
- 不会触发其点击事件

## (2) visibility:hidden

- 和`display:none`的区别在于，元素在页面消失后，其占据的空间依旧会保留着，所以它只会导致浏览器重绘而不会重排
- 无法触发其点击事件
- 适用于那些元素隐藏后不希望页面布局会发生变化的场景

## (3) opacity:0

- 和 `visibility:hidden` 的一个共同点是元素隐藏后依旧占据着空间，但我们都知道，设置透明度为 0 后，元素只是隐身了，它依旧存在页面中
- 可以触发点击事件

## (4) 设置 height，width 等盒模型属性为 0

# rem

## (1)原理

其实 rem 布局的本质是等比缩放，一般是基于宽度

1.  如何让 html 字体大小一直等于屏幕宽度的百分之一呢？ 可以通过 js 来设置，一般需要在页面 dom ready、resize 和屏幕旋转中设置

```
document.documentElement.style.fontSize = document.documentElement.clientWidth / 100 + 'px';
```

2.  那么如何把 UE 图中的获取的像素单位的值，转换为已 rem 为单位的值呢？

`公式是元素宽度 / UE图宽度 * 100`，让我们举个例子，假设 UE 图尺寸是 640px，UE 图中的一个元素宽度是 100px，根据公式 `100/640*100 = 15.625`

`p {width: 15.625rem}`

## (2) 比 Rem 更好的方案

> vw —— 视口宽度的 1/100；vh —— 视口高度的 1/100

```
/* rem方案 */
html {fons-size: width / 100}
p {width: 15.625rem}

/* vw方案 */
p {width: 15.625vw}
```

vw 还可以和 rem 方案结合，这样计算 html 字体大小就不需要用 js 了

```
html {fons-size: 1vw} /* 1vw = width / 100 */
p {width: 15.625rem}
```

缺点：兼容性不如 rem 好

## (3) Rem 的问题

rem 是弹性布局的一种实现方式，弹性布局可以算作响应式布局的一种，但响应式布局不是弹性布局，弹性布局强调 **等比缩放**，100%还原；响应式布局强调 **不同屏幕要有不同的显示**，比如媒体查询。

- 字体大小并不能使用 rem，字体的大小和字体宽度，并不成线性关系
- 由于设置了根元素字体的大小，会影响所有没有设置字体大小的元素，因为字体大小是会继承的。不可能每个元素都显示设置字体大小

# viewport

## (1) 利用 meta 标签对 viewport 进行控制

`<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">`

- width:设置 layout viewport 的宽度，为一个正整数，或字符串"width-device"

## (2) 把当前的 viewport 宽度设置为 ideal viewport 的宽度

`<meta name="viewport" content="initial-scale=1">`和`<meta name="viewport" content="width=device-width">`效果相同

原因：缩放是相对于 ideal viewport 来进行缩放的，当对 ideal viewport 进行 100%的缩放，也就是缩放值为 1 的时候，得到了 ideal viewport

`<meta name="viewport" content="width=400, initial-scale=1">`当遇到这种情况时，浏览器会取它们两个中较大的那个值。例如，当 width=400，ideal viewport 的宽度为 320 时，取的是 400；当 width=400， ideal viewport 的宽度为 480 时，取的是 ideal viewport 的宽度。

## (3) 关于缩放以及 initial-scale 的默认值

- 在 iphone 和 ipad 上，无论你给 viewport 设的宽的是多少，如果没有指定默认的缩放值，则 iphone 和 ipad 会自动计算这个缩放值，以达到当前页面不会出现横向滚动条(或者说 viewport 的宽度就是屏幕的宽度)的目的。

# margin 为负值产生

## 对于自身的影响

当元素不存在 `width` 属性或者（`width：auto`）的时候，负 `margin` 会增加元素的宽度

> - margin-top 为负值不会增加高度，只会产生向上位移
> - margin-bottom 为负值不会产生位移，会减少自身的供 css 读取的高度

### 1.对文档流的影响

元素如果用了`margin-left:-20px`;毋庸置疑的自身会向左偏移 20px 和定位（`position：relative`）有点不一样的是，在其后面的元素会补位，也就是后面的行内元素会紧贴在此元素的之后。总结，不脱离文档流不使用`float`的话，负`margin`元素是不会破坏页面的文档流。

> 所以如果你使用负 margin 上移一个元素，所有跟随的元素都会被上移。

### 2.对浮动元素的影响

负`margin`会改变浮动元素的显示位置，即使元素写在 DOM 的后面，也能让它显示在最前面。圣杯布局、双飞翼布局啊什么的，都是利用这个原理实现的。

### 3.对绝对定位影响

对于绝对定位元素，负 `margin` 会基于其绝对定位坐标再偏移。

- 需要知道定位元素宽度的和高度才能并设置负 `margin` 值使其居中浏览器窗口，
- 不确定宽度和高度可以用`transform: translate3d(-50%,-50%,0);`

## margin 为负值的常见布局应用

### 1.左右固定，中间自适应（双飞翼）

### 2.去除列表右边框

### 3.负边距+定位：水平垂直居中

### 4.去除列表最后一个 li 元素的 border-bottom

### 5.多列等高
