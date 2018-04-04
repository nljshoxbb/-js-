#创建对象

## 一、工程模式

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

### 1.构造函数当作函数调用

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

### 2.构造函数问题

优点：实例标识为一种特定的类型

缺点：每个方法都要在每个实例上重新创建一遍

> person1 和 person2 都有一个名为 sayName()的方法，但那两个方法不是同一个 Function 实例。js 函数是对象，因此每定义一个函数，也就实例化了一个对象。类似以下

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

## 原型模式

创建的每一个函数都有一个 prototype（原型）属性，这个属性是一个指针，指向一个对象，而这个对象的用途是包含可以由特定类型的所有实例共享的属性和方法

### 1.

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

### 2.简单的原型语法

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
