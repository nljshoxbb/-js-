#创建对象

## 一、工厂模式

```
function createPerson(name,age,obj){
    var o = new Object();
    o.name = name;
    o.age = age;
    o.job = job;
    o.sayName = function(){
        alert(this.name);
    }
    return o;
}

var person1 = createPerson('name1',21,'job1');
var person2 = createPerson('name2',22,'job2');
```

优点：解决了创建多个相似对象的问题

缺点：没有解决对象识别的问题（怎么样知道一个对象的类型）

## 二、构造函数模式

构造函数可以用来创建特定类型的对象。像 Object 和 Array

```
function Person(name, age, job) {
    this.name = name;
    this.age = age;
    this.job = job;
    this.sayName = function () {
        alert(this.name);
    }
}

var person1 =new Person('name1', 21, 'job1');
var person2 =new Person('name2', 22, 'job2');

console.log(person1.constructor == Person);
console.log(person2.constructor == Person);
console.log(
    person1 instanceof Object,
    person1 instanceof Person,
    person2 instanceof Object,
    person2 instanceof Person
)
```

### (1) 构造函数当作函数调用

```
person1.sayName();

//作为普通函数
Person('nlj3',28,'web');
window.sayName();// 在全局作用域调用一个函数，this对象总是指向global，所以就是通过window对象调用

//在另一个对象的作用域中调用
var o = new Object();
Person.call(o,'nlj4',29,'web');
o.sayName();
```

### (2) 构造函数问题

优点：实例标识为一种特定的类型

缺点：每个方法都要在每个实例上重新创建一遍

> `person1` 和 `person2` 都有一个名为 `sayName()`的方法，但那两个方法不是同一个 Function 实例。js 函数是对象，因此每定义一个函数，也就实例化了一个对象。类似以下

```
function Person(name, age, job) {
    this.name = name;
    this.age = age;
    this.job = job;
    this.sayName = new Function(){"alert(this.name)"}
}
```

每一个 Person 实例都包含一个不同的 Function 实例，即会创建时导致不同的作用域链和标识符解析，因此不同实例上的同名函数是不相等的

```
console.log(person1.sayName==person2.sayName)
```

优化：

```
function Person(name, age, job) {
    this.name = name;
    this.age = age;
    this.job = job;
    this.sayName = sayName;
}

function sayName(){
    alert(this.name);
}
```

虽然共享了函数，但是变为了全局函数，毫无封装性可言

## 三、原型模式

创建的每一个函数都有一个 prototype（原型）属性，这个属性是一个指针，指向一个对象，而这个对象的用途是包含可以由特定类型的所有实例共享的属性和方法

### (1) 写法

```
function Person(){

}

Person.prototype.name = 'name1';
Person.prototype.sayName = function(){
    alert(this.name);
}
var person = new Person();
```

检测属性在对象中还是在原型中

```
function hasPrototypeProperty(object,name){
    return !object.hasOwnProperty(name) && (name in object);
}
```

### (2) 简单的原型语法

```
function Person(){}

Person.prototype = {
    name:'name1',
    age:29,
    sayName:function(){
        alert(this.name)
    }
}
```

每创建一个函数，就会同时创建它的`prototype`对象，这个对象也会自动获得`constructor`属性。这里的写法，本质上完全重写了默认的`prototype`对象，因此`constructor`属性也就变成了新对象的`constructor`属性（指向`Object`函数），不再指向`Person`函数

如果要`constructor`指向正确,

```
Person.prototype = {
    constructor:Person, // 这种可枚举，原生的不可枚举
    name:'name1',
    age:29,
    sayName:function(){
        alert(this.name)
    }
}
```

### (3) 原型的动态性

由于在原型中查找值的过程是一次搜索，因此对原型对象所做的任何修改都能够立即从实例上反应出来，即使是先创建了实例后修改原型也是如此

```
var friend = new Person();

Person.prototype.sayHi= function(){
    alert('hi');
}

friend.sayHi(); // hi;(没有问题)
```

实例与原型之间松散的链接关系。实例与原型之间的连接只不过是一个指针，而非一个副本。因此就可以在原型中找到新的`sayHi`属性并返回保存在那里的函数。

但是重写原型情况就不一样了。调用构造函数时会为实例添加一个指向最初原型的`[[Prototype]]`(`__proto__`)指针，而把原型修改为另一个对象就等于切断了构造函数与最初原型之间的联系。**实例中的指针仅指向原型，而不指向构造函数**

```
function Person(){}

var friend = new Person();

Person.prototype = {
    constructor:Person,
    name:'name1',
    age:29,
    sayName:function(){
        alert(this.name)
    }
}

// 因为friend指向的原型中不包含该名字命名的属性
friend.sayName(); // error
```

### (4) 问题

- 省略了为构造函数传递初始化参数，所有实例默认情况都是相同属性
- 共享本性。实例之间的属性修改其一则另一个也被修改(引用类型 array 之类)

## 四、组合使用构造函数模式和原型模式

```
function Person(name,age){
    this.name = name;
    this.age = age;
    this.friends = ['aaa','bbb'];
}

Person.prototype = {
    constructor:Person,
    sayName:function(){
        console.log(this.name);
    }
}

var person1 = new Person("name1",26);
var person2 = new Person("name2",27);

person1.friends.push("van");
console.log(person1.friends); // ["aaa", "bbb", "van"]
console.log(person2.friends);// ["aaa", "bbb"]
console.log(person1.sayName == person2.sayName) // true
```

## 五、寄生构造函数模式

```
function Person(name,age,job){
    var o = new Object();
    o.name = name;
    o.job = job;
    o.sayName = function(){
        console.log(this.name);
    }
    return o;
}
```

区别：

- 返回对象与构造函数或者与构造函数的原型属性之间没有关系

# 继承

## 一、原型链继承

### (1) 写法

```
function SuperType(){
    this.property = true;
    this.colors = ['red','blue'];
}

SuperType.prototype.getSuperValue = function(){
    return this.property;
}

function SubType(){
    this.subproperty = false;
}

// 继承了SuperType
SubType.prototype = new SuperType();

SubType.prototype.getSubValue = function(){
    return this.subprototype
}

var instance = new SubType();
console.log(instance.getSuperValue) // true
```

本质：重写原型对象，代之以一个新类型的实例。原来存在与 `SuperType` 的实例中的所有属性和方法，现在也存在于 `SubType.prototype` 中。

- 现原型不仅具有作为一个 `SuperType` 的实例所拥有的全部属性和方法，而且其内部还有一个指针，指向 `SuperType` 的原型。
- `instance` 指向 `SubType` 的原型
- `SubType` 的原型又指向 `SuperType` 的原型
- `instance.contructor` 指向 `SuperType`,因为原来的 `SubType` 的原型指向了 `SuperType` 原型，而这个原型对象的 constructor 属性指向的是 `SuperType`

### (2) 谨慎定义方法

```
function SuperType(){
    this.property = true;
    this.colors = ['red','blue'];
}

SuperType.prototype.getSuperValue = function(){
    return this.property;
}

function SubType(){
    this.subproperty = false;
}

// 继承了SuperType
SubType.prototype = new SuperType();

// 添加新方法
SubType.prototype.getSubValue = function(){
    return this.subprototype
}

// 重写超类原型中的方法
SubType.prototype.getSuperValue = function(){
    return false;
}

var instance = new SubType();
console.log(instance.getSuperValue) // false
```

- 第二个方法`getSubperValue()`是原型链中已经存在的一个方法，重写这个方法将会屏蔽原来的那个方法
- `SubType`实例调用，是调用重新定义的方法
- `SuperType`实例调用，是调用原来定义的方法
- 必须在用 `SuperType`的实例替换原型之后
- 不能使用对象字面量创建原型方法，会重写原型链

```
SubType.prototype = {
    getSubValue:function(){
        return this.subproperty;
    },
}
```

原型包含的是一个 `Object` 的实例，而非 `SuperType` 的实例。`SubType` 和 `SuperType` 之间已经没有关系了

### (3) 问题

```
function SuperType(){
    this.colors = ['red','blue'];
}

function SubType(){

}

//继承了SuperType
SubType.prototype = new SuperType();

var instance1 = new SubType();

instance.colors.push('black');

var instance2 = new SubType();
console.log(instance1.colors); // red,blue,black
console.log(instance2.colors); // red,blue,black
```

- 包含引用类型值的原型属性会被所有实例共享
- SubType 的所有实例都会共享这一个 colors（引用类型）属性
- 创建子类型的实例时，不能向超类型的构造函数中传递参数

### (3) 总结

优点：非常纯粹的继承关系、简单易用、父类新增的原型方法原型属性子类都可以访问到。

缺点：要为子类新增属性和方法，必须要放到 new SubType（）之后，不能放到构造器中，来自原型对象的引用类型被所有实力共享，创建子类，无法向构造函数传参。

## 二、借用构造函数

### (1) 实现

```
function SuperType(name){
    this.name = name;
    this.colors = ['red','blue'];
}

function SubType(){
    //继承SuperType
    SuperType.call(this,'name1');

    // 实例属性
    this.age = 29
}

var instance1 = new SubType();
var instance2 = new SubType();

instance1.colors.push("black");
console.log(instance1.colors); // red,blue,black
console.log(instance2.colors); // red,blue
console.log(instance1.name) // name1
```

本质：在（未来将要）新创建的`SubType`实例的环境下调用了`SuperType`构造函数。会在新`SubTyoe`对象上执行`SuperTyoe()`函数中定义的所有对象初始化代码,`SubType`的每个实例就都会有自己的`colors`属性的副本了

- 在`SubType`构造函数内调用`SuperType`构造函数，实际上是为`SuperType`的实例设置了`name`属性
- 确保不被父类重写子类属性，可以在调用超类构造函数后再添加子类中定义的属性

### (2) 总结

优点：解决了共享引用类型的问题，可以在构造函数里面传参，可以实现多继承。

缺点：实例不是父类实例，只能继承父类的属性和方法，不能继承父类原型的方法和属性、无法实现函数的复用。

## 三、组合继承

通过调用父类的构造函数，继承父类的属性并保留参数，通过父类的实例作为子类原型，实现函数复用。

### (1) 实现

```
function SuperType(name){
    this.name = name;
    this.colors = ['red','blue'];
}
SuperType.prototype.sayName = function(){
    console.log(this.name);
}

function SubType(name,age){
    //继承属性
    SuperType.call(this,name);
    this.age = age;
}

//继承方法
SubType.prototype = new SuperType();

SubType.prototype.sayAge = function(){
    console.log(this.age);
}

var instance1 = new SubType('name1',26);
instance1.colors.push("black");
console.log(instance1.colors); // red,blue,black
instance1.sayName(); // name1
instance1.sayAge(); // 26

var instance2 = new SubType('name2',27);
console.log(instance2.colors); // red,blue
instance2.sayName(); // name2
instance2.sayAge(); // 27
```

### (2) 总结

优点：可以继承属性和方法以及原型上的属性和方法、即是子类实例也是父类实例、不存在属性共享的问题、函数可复用。

缺点：调用了两次构造函数，生成了两份实例。

## 四、寄生组合式继承

组合继承最大问题是无论什么情况下，都会调用两次超类型构造函数

1.  在创建子类型原型的时候
2.  在子类型构造函数内部
3.  子类型最终会包含超类型对象的全部实例属性，但在调用子类型构造函数时重写了这些属性

```
function SuperType(name) {
    this.name = name;
    this.colors = ['red', 'blue'];
}
SuperType.prototype.sayName = function () {
    console.log(this.name);
}

function SubType(name, age) {
    SuperType.call(this, name); // 第二次调用
    this.age = age;
}

SubType.prototype = new SubperType(); // 第一次调用
SubType.prototype.constructor = SubType;
SubType.prototype.sayAge = function(){
    console.log(this.age);
}
```

通过借用构造函数来继承 **属性**，通过原型链混成形式来继承 **方法**

思路：不必为了指定子类型的原型而调用超类型的构造函数，所需的无非就是超类型原型的一个副本而已。

```
function SuperType(name) {
    this.name = name;
    this.colors = ['red', 'blue'];
}
SuperType.prototype.sayName = function () {
    console.log(this.name);
}

function SubType(name, age) {
    SuperType.call(this, name);
    this.age = age;
}
function inheritPrototype(subType, superType) {
    var prototype = Object.create(superType.prototype);//创建对象
    prototype.constructor = subType; //增强对象
    subType.prototype = prototype; //指定对象
}
inheritPrototype(SubType,SuperType);
SubType.prototype.sayAge = function(){
    console.log(this.age);
}

var instance = new SubType('nlj',24);
console.log(instance,instance.sayAge(),instance.sayName());
```

- 只调用一次`SuperType`构造函数,避免在`SubType.prototype`上面创建不必要的、多余的属性
- 原型链还能保持不变
- 还可以正常使用`instanceof`和`isPrototypeOf()`

### 总结

砍掉父类的实例属性，这样，在调用两次父类的构造时候，就不会初始化两次实例方法和属性，避免组合继承的缺点
