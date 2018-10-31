## 调用点（Call-site）

函数在代码中被调用的位置（不是被声明的位置）

## 规则

###　默认绑定（Default Binding）

```
function foo() {
	console.log( this.a );
}

var a = 2;

foo(); // 2
```

在这种情况下，对此方法调用的 `this` 实施了 **默认绑定**，所以使 `this` 指向了全局对象。

### 隐含绑定（Implicit Binding）

调用点是否有一个环境对象（context object），也称为拥有者（owning）或容器（containing）对象

```
function foo() {
	console.log( this.a );
}

var obj = {
	a: 2,
	foo: foo
};

obj.foo(); // 2
```

在`foo()`被调用的位置上，它被冠以一个指向`obj`的对象引用。当一个方法引用存在一个环境对象时，**隐含绑定** 规则会说：是这个对象应当被用于这个函数调用的`this`绑定

#### 隐含地丢失（Implicitly Lost）

当一个 **隐含绑定** 丢失了它的绑定，这通常意味着它会退回到 **默认绑定**， 根据`strict mode` 的状态，结果不是全局对象就是 `undefined`

尽管 `bar` 似乎是 `obj.foo` 的引用，但实际上它只是另一个 `foo` 自己的引用而已。另外，起作用的调用点是 `bar()`，一个直白，毫无修饰的调用，因此 **默认绑定** 适用于这里。

另一个例子：

```
function foo() {
	console.log( this.a );
}

function doFoo(fn) {
	// `fn` 只不过`foo`的另一个引用

	fn(); // <-- 调用点!
}

var obj = {
	a: 2,
	foo: foo
};

var a = "oops, global"; // `a`也是一个全局对象的属性

doFoo( obj.foo ); // "oops, global"
```

参数传递仅仅是一种隐含的赋值，而且因为我们在传递一个函数，它是一个隐含的引用赋值，所以最终结果和我们前一个代码段一样。

### 明确绑定（Explicit Binding）

```
function foo() {
	console.log( this.a );
}

var obj = {
	a: 2
};

foo.call( obj ); // 2
```

通过 `foo.call(..)`使用 明确绑定 来调用`foo`，允许我们强制函数的 `this` 指向 `obj`。

单独依靠 **明确绑定** 仍然不能为我们先前提到的问题提供解决方案，也就是函数“丢失”自己原本的 `this` 绑定，或者被第三方框架覆盖，等等问题

#### 硬绑定（Hard Binding）

```
function foo(something) {
	console.log( this.a, something );
	return this.a + something;
}

var obj = {
	a: 2
};

var bar = function() {
	return foo.apply( obj, arguments );
};

var b = bar( 3 ); // 2 3
console.log( b ); // 5
```

#### API 调用的“环境”

```
function foo(el) {
	console.log( el, this.id );
}

var obj = {
	id: "awesome"
};

// 使用`obj`作为`this`来调用`foo(..)`
[1, 2, 3].forEach( foo, obj ); // 1 awesome  2 awesome  3 awesome
```

### new 绑定（new Binding）

```
function foo(a) {
	this.a = a;
}

var bar = new foo( 2 );
console.log( bar.a ); // 2
```

通过在前面使用 `new` 来调用 `foo(..)`，我们构建了一个新的对象并将这个新对象作为 `foo(..)`调用的 `this`。 `new` 是函数调用可以绑定 `this` 的最后一种方式，我们称之为 `new` 绑定`（new binding）`。

## 一切皆有顺序

明确绑定->new 绑定->隐含绑定->默认绑定

_硬绑定_（明确绑定的一种）的优先级要比 _new 绑定_ 高，而且不能被 `new` 覆盖。

## 绑定的特例

### 被忽略的`this`

如果你传递 `null` 或 `undefined` 作为 `call，apply` 或 `bind` 的 `this` 绑定参数，那么这些值会被忽略掉，取而代之的是 **默认绑定** 规则将适用于这个调用。

```
function foo() {
	console.log( this.a );
}

var a = 2;

foo.call( null ); // 2
```

作用：用来 curry 参数

```
function foo(a,b) {
	console.log( "a:" + a + ", b:" + b );
}

// 将数组散开作为参数
foo.apply( null, [2, 3] ); // a:2, b:3

// 用`bind(..)`进行柯里化
var bar = foo.bind( null, 2 );
bar( 3 ); // a:2, b:3
```

这两种工具都要求第一个参数是 `this` 绑定。如果想让使用的函数不关心 `this`，你就需要一个占位值，而且正如这个代码段中展示的，`null` 看起来是一个合理的选择。
