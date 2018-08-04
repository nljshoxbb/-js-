# The Basics Of ES6 Generators

https://davidwalsh.name/es6-generators


generator 是 JavaScript ES6中最令人兴奋的新功能之一。这个名字有点奇怪，但是更奇怪的是他的一些行为。这篇文章目的在于分析 generator 如何运行并帮助你了解为什么它们是JS的强大特性之一。

## Run-To-Completion

在我们谈论 generators 时要注意的第一件事是它们与正常函数在“运行到完成”方面的区别。

无论你是否意识到，你总是能够对函数有一些基础的认知：一旦函数开始运行，它将始终在任何其他JS代码运行之前运行完成

例子：

```
setTimeout(function(){
    console.log("Hello World");
},1);

function foo() {
    // NOTE: don't ever do crazy long-running loops like this
    for (var i=0; i<=1E10; i++) {
        console.log(i);
    }
}

foo();
// 0..1E10
// "Hello World"
```

这是一个`for`循环，它会花相当长的时间去执行完成，但是我们的定时器回调函数声明`console.log(...)`并不能打断正在运行的`foo()`，它只能阻塞在一个线程上（在事件循环上）并且直到循环完成才会执行。

如果`foo()`可以打断，会发生什么呢？会不会对之前的程序造成影响？

这正是多线程编程的噩梦，但我们在JavaScript中非常幸运，不必担心这些事情，因为JS总是单线程的（在任何给定时间只执行一个命令/函数）。

注意：Web Workers是一种机制，你可以为一个JS程序的一部分启动一个完整的独立线程，完全与你的主JS程序线程并行运行。 这不会在我们的程序中引入多线程复杂性的原因是两个线程只能通过正常的异步事件相互通信，这些事件始终遵循运行所需的事件循环一次性执行完成。

## Run..Stop..Run

通过 ES6 的 generators，我们有一个复杂的函数，可以在函数中暂停一次或者多次，在它暂停期间运其他的代码，并且在暂停之后恢复函数运行。

如果你曾经读过有关并发或线程编程的任何内容，你可能已经看到了“cooperate”这个术语，它基本上表明一个进程（在我们的例子中是一个函数）本身会选择何时允许中断，以便它可以 与其他代码合作。 这个概念与“preemptive”形成对比，这意味着一个 进程/函数 可能会违背其意愿而中断运行。


ES6 generators 函数在其并发行为中是“cooperative”。 在 generators 函数体内，使用新的 `yield`关键字从其内部暂停函数。函数外部任何操作都无法暂停其运行，除了内部使用`yield`之外。

但是，一旦使用`yield`暂停，它就无法自行恢复。 必须使用外部控制来重新启动 generator。 我们将在之后解释这里面发生了什么。

一个最基本的 generator 函数，你可以选择多次让它停止或者重新运行。你可以指定一个generator 函数在一个无线循环中（类似`while (true) { .. }`）,其本质就是永远不会完成。虽然这通常是普通JS程序中的错误，但使用 generator 功能它是完全理智的，有时候正是你想要做的。

更重要的是，这种停止和启动不仅仅是对 generator 功能执行的控制，而且它还使得双向消息能够随着它的进展而进出 generator。 使用普通函数，你可以在开头获取参数，在结尾处获得返回值。 使用 generator 函数，你可以在每次生成时发送消息，并在每次重新启动时重新发送消息

## 语法

新的声明语法

```
function *foo() {
    // ..
}
```

注意 * 这个符号了吗？这是新的，看起来有点奇怪。对于那些来自其他语言的人来说，它看起来很像函数返回值指针。但不要混淆！这只是一种标记 generator 函数的方法。

你可能已经看过其他文章/文档使用函数`* foo(){}`而不是函数`* foo(){}`（*的位置不同）。 两者都有效，但我最近决定我认为函数`* foo(){}`更准确，所以这就是我在这里使用的。

现在，我们来谈谈我们的 generator  函数的内容。 在大多数方面，generator 函数只是普通的JS函数。 在 generator 函数内部学习的语法很少。

如上所述，我们必须使用的主要新玩具是`yield`关键字。`yield ___`被称为“yield表达式”（而不是语句），因为当我们重新启动generator时，我们将重新发送一个值，并且我们发送的任何内容都将是该`yield ___`表达式的计算结果。

例子

```
function *foo() {
    var x = 1 + (yield "foo");
    console.log(x);
}
```

当在该点暂停 generator 函数时，`yield“foo”`表达式将发送`“foo”`字符串值，并且每当（如果有的话）generator 重新启动时，无论发送什么值将是该表达式的结果，然后加到1并分配给x变量。

看到双向通信了吗？ 你发送值`“foo”`，暂停自己，稍后（可能会立即，可能是很长一段时间！），generator 将重新启动并返回给你一个值。 这几乎就像`yield`关键字在对某个值进行请求一样。

在任何表达式位置，你只需在 表达式/语句中 单独使用`yield`，并且会产生假定的`undefined`。 所以：

```
// note: `foo(..)` here is NOT a generator!!
function foo(x) {
    console.log("x: " + x);
}

function *bar() {
    yield; // just pause
    foo( yield ); // pause waiting for a parameter to pass into `foo(..)`
}
```


## Generator 迭代器

迭代器是一种特殊的行为，实际上是一种设计模式，我们通过调用`next()`逐步遍历一组有序的值。 想象一下，例如在一个有五个值的数组上使用迭代器：[1,2,3,4,5]。 第一个`next()`调用将返回1，第二个`next()`调用将返回2，依此类推。 返回所有值后，`next()`将返回`null`或`false`，或以其他方式向你发出信号，通知你已迭代数据容器中的所有值。

我们从外部控制 generator 函数的方式是构造 generator 迭代器并与之交互。这听起来比实际复杂得多。考虑这个愚蠢的例子

```
function *foo() {
    yield 1;
    yield 2;
    yield 3;
    yield 4;
    yield 5;
}
```

要逐步执行`* foo()`的值，我们需要构造一个迭代器

```
var it = foo();
```

因此，以正常方式调用 generator 函数实际上并不执行其任何内容。

你可能会有点奇怪，你也可能想知道，为什么不是`var it = new foo()`。耸耸肩。语法背后的原因是复杂的，超出了我们的讨论范围。

所以现在，开始迭代我们的 generator 函数

```
var message = it.next();
```

我们可以从 `yield 1` 表达式中获得 1,但并不止只返回这个值。
```
console.log(message); // { value:1, done:false }
```

我们实际上从每个`next()`调用中返回一个对象，它具有`yielded-out`值的`value`属性，`done`是一个布尔值，指示generator函数是否已完全完成。

让我们继续我们的迭代：

```
console.log( it.next() ); // { value:2, done:false }
console.log( it.next() ); // { value:3, done:false }
console.log( it.next() ); // { value:4, done:false }
console.log( it.next() ); // { value:5, done:false }
```

有趣的是，当我们得到5的值时，`done`仍然是`false`。 那是因为从技术上讲， generator 功能并不完整。 我们仍然需要在最后调用一次`next()`，如果我们发送一个值，则必须将其设置为`yield 5`表达式的结果。 只有这样才算执行完整个generator 函数。

```
console.log( it.next() ); // { value:undefined, done:true }
```

因此，我们的 generator 函数的最终结果是我们完成了函数，但是没有给出结果（因为我们已经用尽所有`yield ___`语句）。

您可能想知道在这一点上，在 generator 函数中`return`，如果我这样做，那么该值是否会在`value`属性中发送出去？

```
function *foo() {
    yield 1;
    return 2;
}

var it = foo();

console.log( it.next() ); // { value:1, done:false }
console.log( it.next() ); // { value:2, done:true }
```

依赖 generator 的`reuren`值可能不是一个好主意，因为当使用`for..of`循环迭代  generator 函数时（见下文），最终的返回值将被丢弃。

为了完整起见，我们还要看一下在迭代它时向 generator 函数发送消息和从 generator 函数发出消息

```
function *foo(x) {
    var y = 2 * (yield (x + 1));
    var z = yield (y / 3);
    return (x + y + z);
}

var it = foo( 5 );

// note: not sending anything into `next()` here
console.log( it.next() );       // { value:6, done:false }
console.log( it.next( 12 ) );   // { value:8, done:false }
console.log( it.next( 13 ) );   // { value:42, done:true }
```

您可以看到我们仍然可以使用初始`foo（5）`iterator-instantiation调用传入参数（在我们的示例中为`x`），就像使用普通函数一样，设置`x`为值`5`。

第一个`next(...)`调用，我们没有发送任何东西，为什么呢？因为这里没有`yield`表达式去接收我们传过来的值。

但是如果我们在第一个`next()`中传了值，并不会发生什么事情。 generator 会默认丢弃。ES6表示 generator 函数在这种情况下忽略未使用的值。

`yield（x + 1）`是发出值`6`的函数。第二个`next（12）`调用将`12`发送到等待的`yield（x + 1）`表达式，因此`y`赋值为`12 * 2`，值为`24`。然后是后续的`yield （y / 3）`（`yield（24/3）`）是发出值`8`的内容。第三个`next（13）`调用将`13`发送到等待的`yield（y / 3）`表达式，使`z`设置为`13`。

重读几次。这对大多数人来说很奇怪，他们看到的前几次都是如此。

## for..of

ES6还通过提供直接支持运行迭代器来完成语法级别的迭代器模式：`for..of`循环

```
function *foo() {
    yield 1;
    yield 2;
    yield 3;
    yield 4;
    yield 5;
    return 6;
}

for (var v of foo()) {
    console.log( v );
}
// 1 2 3 4 5

console.log( v ); // still `5`, not `6` :(
```

正如您所看到的，`foo（）`创建的迭代器由`for..of`循环自动捕获，它会自动为您迭代，每个值迭代一次，直到`done：true`出现。 只要`done为false`，它就会自动提取`value`属性并将其分配给迭代变量（在我们的例子中为`v`）。 一旦完成，则循环迭代停止（并且不返回任何返回的最终值，如果有的话）。

如上所述，您可以看到`for..of`循环忽略并抛弃 `return 6`。 此外，由于没有公开的`next（）`调用，因此`for..of`循环不能用于需要将值传递给生成器步骤的情况，如上所述。