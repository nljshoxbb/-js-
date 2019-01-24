## [[Prototype]]

JavaScript 中的对象有一个内部属性，在语言规范中称为`[[Prototype]]`，它只是一个其他对象的引用。几乎所有的对象在被创建时，它的这个属性都被赋予了一个非`null`值。

```
var anotherObject = {
a: 2
};

// 创建一个链接到`anotherObject`的对象
var myObject = Object.create( anotherObject );

for (var k in myObject) {
console.log("found: " + k);
}
// 找到: a

("a" in myObject); // true
```

所以，当你以各种方式进行属性查询时，`[[Prototype]]`链就会一个链接一个链接地被查询。一旦找到属性或者链条终结，这种查询会就会停止。

## Object.prototype

每个 普通 的`[[Prototype]]`链的最顶端，是内建的 Object.prototype。这个对象包含各种在整个 JS 中被使用的共通工具，因为 JavaScript 中所有普通（内建，而非被宿主环境扩展的）的对象都“衍生自”（也就是，使它们的`[[Prototype]]`顶端为）Object.prototype 对象。

## 设置与遮蔽属性

1. 如果一个普通的名为`foo`的数据访问属性在`[[Prototype]]`链的高层某处被找到，而且没有被标记为只读（`writable:false`），那么一个名为`foo`的新属性就直接添加到`myObject`上，形成一个 **遮蔽属性**。

2. 如果一个`foo`在`[[Prototype]]`链的高层某处被找到，但是它被标记为 只读（`writable:false`） ，那么设置既存属性和在`myObject`上创建遮蔽属性都是 **不允许** 的。如果代码运行在`strict mode`下，一个错误会被抛出。否则，这个设置属性值的操作会被无声地忽略。不论怎样，**没有发生遮蔽**。

3. 如果一个`foo`在`[[Prototype]]`链的高层某处被找到，而且它是一个`setter`（见第三章），那么这个`setter`总是被调用。没有`foo`会被添加到（也就是遮蔽在）`myObject`上，这个`foo`setter 也不会被重定义。

_只读_ 属性的存在会阻止同名属性在`[[Prototype]]`链的低层被创建（遮蔽）。这个限制的主要原因是为了增强类继承属性的幻觉

```
var anotherObject = {
	a: 2
};

var myObject = Object.create( anotherObject );

anotherObject.a; // 2
myObject.a; // 2

anotherObject.hasOwnProperty( "a" ); // true
myObject.hasOwnProperty( "a" ); // false

myObject.a++; // 噢，隐式遮蔽！

anotherObject.a; // 2
myObject.a; // 3

myObject.hasOwnProperty( "a" ); // true
```

虽然看起来 `myObject.a++`应当（通过委托）查询并 _原地_ 递增 `anotherObject.a` 属性，但是`++`操作符相当于 `myObject.a = myObject.a + 1`。结果就是在`[[Prototype]]`上进行 `a` 的`[[Get]]`查询，从 `anotherObject.a` 得到当前的值 `2`，将这个值递增 `1`，然后将值 `3` 用`[[Put]]`赋值到 `myObject` 上的新遮蔽属性 `a` 上
