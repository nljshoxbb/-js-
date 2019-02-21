# 1. 边框

- 阴影 `box-shadow`
- 边框图片
- `border-radius`

# 2. 背景

- `background-size`
- `background-origin`
- `background-clip`
- 多重背景图片

```
body{
  background-image:url(bg_flower.gif),url(bg_flower_2.gif);
}
```

# 3. CSS3 文本效果

- `text-shadow`
- `text-wrap`

# 4. CSS3 字体

- 字体定义

```
/* 定义字体 */
@font-face{
  font-family: myFont;
  src: url('Sansation_Light.ttf'),
       url('Sansation_Light.eot');     /* IE9+ */
}

div{
  font-family:myFont;
}
```

# 5. CSS3 2D 转换

- `translate()`
- `rotate()`
- `scale()`
- `skew()`
- `matrix()`

# 6. 3d 转换

- `rotateX()`
- `rotateY()`

# 7. CSS3 过渡

- `transition`

# 8. CSS3 动画

```
/* 当动画为 25% 及 50% 时改变背景色，然后当动画 100% 完成时再次改变 */
@keyframes myfirst{
  0%   {background: red;}
  25%  {background: yellow;}
  50%  {background: blue;}
  100% {background: green;}
}

/* 同时改变背景色和位置 */
@keyframes myfirst{
  0%   {background: red; left:0px; top:0px;}
  25%  {background: yellow; left:200px; top:0px;}
  50%  {background: blue; left:200px; top:200px;}
  75%  {background: green; left:0px; top:200px;}
  100% {background: red; left:0px; top:0px;}
}
```

# 9.CSS3 多列

- `column-count`
- `column-gap`
- `column-rule`

# 10.CSS3 用户界面

- resize

```
/* 设置div可以由用户调整大小 */
div{
  resize:both;
  overflow:auto;
}
```

- box-sizing
