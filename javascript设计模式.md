# 一、工厂模式

**优点**：能解决多个相似的问题

**缺点**：不能知道对象识别的问题(对象的类型不知道)。

**复杂的工厂模式定义是**：将其成员对象的实列化推迟到子类中，子类可以重写父类接口方法以便创建的时候指定自己的对象类型。

```
        var BicycleShop = function (name) {
            this.name = name;
            this.method = function () {
                return this.name;
            }
        }

        BicycleShop.prototype = {
            constructor: BicycleShop,
            sellBicycle: function (model) {
                var bicycle = this.createBicycle(model);
                // 执行A业务逻辑
                bicycle.A();

                //执行B业务逻辑
                bicycle.B();

                return bicycle;

            },
            createBicycle: function (model) {
                throw new Error('父类是抽象类不能直接调用，需要子类重写该方法');
            }
        };


        // 实现原型继承
        function extend(Sub, Sup) {
            // 定义一个空函数
            var F = function () { };
            // 设置空函数的原型为超类的原型
            F.prototype = Sup.prototype;
            // 实例化空函数，并把超类原型引用传递给子类
            Sub.prototype = new F();
            // 重置子类原型的构造器为子类自身
            Sub.prototype.constructor = Sub;
            // 在子类中保存超类的原型，避免子类与超类耦合
            Sub.sup = Sup.prototype;

            if (Sup.prototype.constructor === Object.prototype.constructor) {
                // 检测超类原型的构造器是否为原型自身
                Sup.prototype.constructor = Sup;
            }
        }

        var BicycleChild = function (name) {
            this.name = name;

            // 继承构造函数父类中的属性和方法
            BicycleShop.call(this, name);
        }

        // 子类继承父类原型方法
        extend(BicycleChild, BicycleShop);

        // 子类重写父类方法

        BicycleChild.prototype.createBicycle = function () {
            var A = function () {
                console.log('执行A业务操作');
            }

            var B = function () {
                console.log('执行B业务操作');
            }
            return {
                A: A,
                B: B
            }
        }

        var childClass = new BicycleChild('nlj');
        console.log(childClass);
```

1.  弱化对象间的耦合，防止代码的重复。在一个方法中进行类的实例化，可以消除重复性的代码。
2.  重复性的代码可以放在父类去编写，子类继承于父类的所有成员属性和方法，子类只专注于实现自己的业务逻辑。

# 二、单体模式

**优点**

1.  可以用来划分命名空间，减少全局变量的数量。
2.  使用单体模式可以使代码组织的更为一致，使代码容易阅读和维护。
3.  可以被实例化，且实例化一次。

```
// 创建div
var createWindow = function(){
    var div = document.createElement("div");
    div.innerHTML = "我是弹窗内容";
    div.style.display = 'none';
    document.body.appendChild(div);
    return div;
};
// 创建iframe
var createIframe = function(){
    var iframe = document.createElement("iframe");
    document.body.appendChild(iframe);
    return iframe;
};
// 获取实例的封装代码
var getInstance = function(fn) {
    var result;
    return function(){
        return result || (result = fn.call(this,arguments));
    }
};
// 测试创建div
var createSingleDiv = getInstance(createWindow);
document.getElementById("Id").onclick = function(){
    var win = createSingleDiv();
    win.style.display = "block";
};
// 测试创建iframe
var createSingleIframe = getInstance(createIframe);
document.getElementById("Id").onclick = function(){
    var win = createSingleIframe();
    win.src = "http://cnblogs.com";
};
```
