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

# 三、模块模式

```
function CustomType() {
    this.name = "tugenhua";
};
CustomType.prototype.getName = function(){
    return this.name;
}
var application = (function(){
    // 定义私有
    var privateA = "aa";
    // 定义私有函数
    function A(){};

    // 实例化一个对象后，返回该实例，然后为该实例增加一些公有属性和方法
    var object = new CustomType();

    // 添加公有属性
    object.A = "aa";
    // 添加公有方法
    object.B = function(){
        return privateA;
    }
    // 返回该对象
    return object;
})();


console.log(application.A);// aa

console.log(application.B()); // aa

console.log(application.name); // tugenhua

console.log(application.getName());// tugenhua
```

## 使用场景

当必须创建一个对象并以某些数据进行初始化，同时还要公开一些能够访问这些私有数据的方法

# 四、代理模式

## 优点

1.  代理对象可以代替本体被实例化，并使其可以被远程访问；
2.  它还可以把本体实例化推迟到真正需要的时候；对于实例化比较费时的本体对象，或者因为尺寸比较大以至于不用时不适于保存在内存中的本体，我们可以推迟实例化该对象

## 使用虚拟代理实现图片的预加载

```
// 不使用代理的预加载图片函数如下
var myImage = (function(){
    var imgNode = document.createElement("img");
    document.body.appendChild(imgNode);
    var img = new Image();
    img.onload = function(){
        imgNode.src = this.src;
    };
    return {
        setSrc: function(src) {
            imgNode.src = "http://img.lanrentuku.com/img/allimg/1212/5-121204193Q9-50.gif";
            img.src = src;
        }
    }
})();
// 调用方式
myImage.setSrc("https://img.alicdn.com/tps/i4/TB1b_neLXXXXXcoXFXXc8PZ9XXX-130-200.png");
```

```
// 代理模式
var myImage = (function(){
    var imgNode = document.createElement("img");
    document.body.appendChild(imgNode);
    return {
        setSrc: function(src) {
            imgNode.src = src;
        }
    }
})();
// 代理模式
var ProxyImage = (function(){
    var img = new Image();
    img.onload = function(){
        myImage.setSrc(this.src);
    };
    return {
        setSrc: function(src) {
                         myImage.setSrc("http://img.lanrentuku.com/img/allimg/1212/5-121204193Q9-50.gif");
        img.src = src;
        }
    }
})();
// 调用方式
ProxyImage.setSrc("https://img.alicdn.com/tps/i4/TB1b_neLXXXXXcoXFXXc8PZ9XXX-130-200.png");
```

1.  第一种方案一般的方法代码的耦合性太高
2.  第二种方案使用代理模式，其中 myImage 函数只负责做一件事,可复用，不使用代理可以移除，灵活

## 虚拟代理合并 http 请求

```
// 本体函数
var mainFunc = function(ids) {
    console.log(ids); // 即可打印被选中的所有的id
    // 再把所有的id一次性发ajax请求给服务器端
};
// 代理函数 通过代理函数获取所有的id 传给本体函数去执行
var proxyFunc = (function(){
    var cache = [],  // 保存一段时间内的id
        timer = null; // 定时器
    return function(checkboxs) {
        // 判断如果定时器有的话，不进行覆盖操作
        if(timer) {
            return;
        }
        timer = setTimeout(function(){
            // 在2秒内获取所有被选中的id，通过属性isflag判断是否被选中
            for(var i = 0,ilen = checkboxs.length; i < ilen; i++) {
                if(checkboxs[i].hasAttribute("isflag")) {
                    var id = checkboxs[i].getAttribute("data-id");
                    cache[cache.length] = id;
                }
            }
            mainFunc(cache.join(',')); // 2秒后需要给本体函数传递所有的id
            // 清空定时器
            clearTimeout(timer);
            timer = null;
            cache = [];
        },2000);
    }
})();
var checkboxs = document.getElementsByClassName("j-input");
for(var i = 0,ilen = checkboxs.length; i < ilen; i+=1) {
    (function(i){
        checkboxs[i].onclick = function(){
            if(this.checked) {
                // 给当前增加一个属性
                this.setAttribute("isflag",1);
            }else {
                this.removeAttribute('isflag');
            }
            // 调用代理函数
            proxyFunc(checkboxs);
        }
    })(i);
}
```

## 缓存代理

```
// 计算乘法
var mult = function(){
    var a = 1;
    for(var i = 0,ilen = arguments.length; i < ilen; i+=1) {
        a = a*arguments[i];
    }
    return a;
};
// 计算加法
var plus = function(){
    var a = 0;
    for(var i = 0,ilen = arguments.length; i < ilen; i+=1) {
        a += arguments[i];
    }
    return a;
}
// 代理函数
var proxyFunc = function(fn) {
    var cache = {};  // 缓存对象
    return function(){
        var args = Array.prototype.join.call(arguments,',');
        if(args in cache) { // 如果参数相同
            return cache[args];   // 使用缓存代理
        }
        return cache[args] = fn.apply(this,arguments);
    }
};
var proxyMult = proxyFunc(mult);
console.log(proxyMult(1,2,3,4)); // 24
console.log(proxyMult(1,2,3,4)); // 缓存取 24

var proxyPlus = proxyFunc(plus);
console.log(proxyPlus(1,2,3,4));  // 10
console.log(proxyPlus(1,2,3,4));  // 缓存取 10
```

# 五、职责链模式

## 优点

消除请求的发送者与接收者之间的耦合

## 流程

1.  发送者知道链中的第一个接收者，它向这个接收者发送该请求。

2.  每一个接收者都对请求进行分析，然后要么处理它，要么它往下传递。

3.  每一个接收者知道其他的对象只有一个，即它在链中的下家(successor)。

4.  如果没有任何接收者处理请求，那么请求会从链中离开。

```
function order500(orderType,isPay,count){
    if(orderType == 1 && isPay == true)    {
        console.log("亲爱的用户，您中奖了100元红包了");
    }else {
        //我不知道下一个节点是谁,反正把请求往后面传递
        return "nextSuccessor";
    }
};
function order200(orderType,isPay,count) {
    if(orderType == 2 && isPay == true) {
        console.log("亲爱的用户，您中奖了20元红包了");
    }else {
        //我不知道下一个节点是谁,反正把请求往后面传递
        return "nextSuccessor";
    }
};
function orderNormal(orderType,isPay,count){
    // 普通用户来处理中奖信息
    if(count > 0) {
        console.log("亲爱的用户，您已抽到10元优惠卷");
    }else {
        console.log("亲爱的用户，请再接再厉哦");
    }
}
// 下面需要编写职责链模式的封装构造函数方法
var Chain = function(fn){
    this.fn = fn;
    this.successor = null;
};
Chain.prototype.setNextSuccessor = function(successor){
    return this.successor = successor;
}
// 把请求往下传递
Chain.prototype.passRequest = function(){
    var ret = this.fn.apply(this,arguments);
    if(ret === 'nextSuccessor') {
        return this.successor && this.successor.passRequest.apply(this.successor,arguments);
    }
    return ret;
}
//现在我们把3个函数分别包装成职责链节点：
var chainOrder500 = new Chain(order500);
var chainOrder200 = new Chain(order200);
var chainOrderNormal = new Chain(orderNormal);

// 然后指定节点在职责链中的顺序
chainOrder500.setNextSuccessor(chainOrder200);
chainOrder200.setNextSuccessor(chainOrderNormal);

//最后把请求传递给第一个节点：
chainOrder500.passRequest(1,true,500);  // 亲爱的用户，您中奖了100元红包了
chainOrder500.passRequest(2,true,500);  // 亲爱的用户，您中奖了20元红包了
chainOrder500.passRequest(3,true,500);  // 亲爱的用户，您已抽到10元优惠卷
chainOrder500.passRequest(1,false,0);   // 亲爱的用户，请再接再厉哦
```
