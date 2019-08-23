#每日问题



## 用递归算法实现，数组长度为 5 且元素的随机数在 2-32 间不重复的值

```javascript
function buildArray(arr = [], length, min, max) {
    var num = Math.floor(Math.random() * (max - min + 1)) + min;
    if (!arr.includes(num)) {
        arr.push(num);
    }
    return arr.length === length ? arr : buildArray(arr, length, min, max);
}

var result = buildArray([], 5, 2, 32);
console.table(result);

```



## 写一个方法去掉字符串中的空格

```javascript
var str = ' 1 2 3445 6    ';
console.log(str.split(' ').join('')) // 输出"1234456"		
console.log(str.trim()) // 输出"1 2 3445 6"	这个是删去两端的空格，而不会删去字符中间的空格

var trim = function(str){
return str.replace(/\s*/g,"");
}
str.replace(/\s*/g,""); //去除字符串内所有的空格
str.replace(/^\s*|\s*$/g,""); //去除字符串内两头的空格
str.replace(/^\s*/,""); //去除字符串内左侧的空格
str.replace(/(\s*$)/g,""); //去除字符串内右侧的空格

```



## 写一个方法把下划线命名转成大驼峰命名



```javascript
function toCamel(str){
  str = str.replace(/(\w)/,(match,$1)=> `${$1.toUpperCase()}`)
  while(str.match(/\w_\w/)){
    str = str.replace(/(\w)(_)(\w)/,(match,$1,$2,$3)=>`${$1}${$3.toUpperCase()}`)
  }
  return str
}

console.log(toCamel('a_c_def')) // ACDef 

```

