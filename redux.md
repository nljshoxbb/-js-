## 什么是柯里化，举 React 和 Redux 的例子

### 1. 柯里化

如果一个函数可以接收多个参数，将这个函数转化为每次只接收一部分参数的函数的多次调用形式，就是柯里化

```
function sum(x,y,z,q){
 return x+y+z+q;
}

sum(1,2,3,4);//得到10
```

我们从上可以看出，sum 函数传递了 4 个参数，函数的柯里化，是指将函数的参数变为 1 个，并且返回新的函数，柯里化后：

```
function sum(x){

  return function(y){
     return function (z){
       return function(q){
         return x+y+z+q
       }
     }
  }
}

// es6

var sum=(x)=>(y)=>(z)=>(q)=>(x+y+z+q)

sum(1)(2)(3)(4) //得到sum为10
```

### 2. Redux 中的 applyMiddleware 的实现原理：

applyMiddleware 是为了改造 dispatch

```
import compose from './compose';

export default function applyMiddleware(...middlewares){

    // 2.
    return (next)=>(reducer,initialState)=>{
        let store = next(reducer,initialState);
        let dispatch = store.dispatch;
        let chain = [];

        var middlewareAPI = {
            getState:store.getState,
            dispatch:(action)=>dispatch(action)
        };

        chain = middlewares.map(middleware=>middleware(middlewareAPI)); //

        // 3.
        dispatch = compose(...chain)(store.dispatch);

        return {
            ...store,
            dispatch
        }
    }
}
```

#### 1.函数式编程思想设计

柯里化的`middleware`结构的好处主要有

* **易串联**:currying 函数具有延迟执行的特性，通过不断 currying 形成的 middleware 可以累计参数，在配合(compose)的方式，很容易形成 pipeline 来处理数据
* **共享 store**:在 applyMiddleware 执行的过程中，store 还是旧的，但是因为闭包的存在，applyMiddleware 完成后，所有的 middelware 内部拿到的 store 是最新的且相同

增强`createStore`函数

```
const finalCreateStore = compose(
    applyMiddleware(d1,d2,d3),
    DevTools.instrument()
)(createStore);
```

#### 2.给 middleware 分发 store

创建一个普通 store:

```
let newStore = applyMiddleware(mid1,mid2,mid3,...)(createStore)(reducer,null);
```

applyMiddleware 方法陆续获得 3 个参数，第一个数组`[mid1,mid2,mid3]`,第二个 redux 原生的`createStore`,最后一个是`reducer`。让每个 middleware 带着 `middlewareAPI` 这个参数执行一遍。执行完后，获得 `chain` 数组，保存的对象是第二个箭头函数返回的匿名函数。以为是闭包，每个匿名函数都可以访问相同的 `store`,即 `middlewareAPI`;

#### 3.组合串联 middleware

redux 中 compose 实现是下面这样的，实现方式并不唯一

chain 中的所有匿名函数[f1,f2,f3,...,fx,...,fn];

```
function compose(...funcs){
    return arg => funcs.reduceRight((composed,f)=>f(composed),arg);
}
```

`compose(...funcs)`返回的是一个匿名函数，其中`funcs`就是`chain`数组。当调用`reduceRight`时，依次从`funcs`数组的右端取一个函数`fx`拿来执行，`fx`的参数`composed`就是前一次`fx+1`执行的结果，而第一次执行的`fn`(n 代表 chain 长度)的参数 arg 就是 store.dispatch。所以，当`compose`执行完后，我们得到的 dispatch 是这样的 。假设 n =3:

```
dispatch  = f1(f2(f3(store.dispatch)));
```

这时调用新的`dispatch`,每一个 middleware 就依次执行了

#### 4.在 middleware 中调用 dispatch

middleware 中 store 的 dispatch 通过匿名函数的方式和最终 compose 结束后的新 dispatch 保持一致,所以在 middleware 中调用`store.dispatch()`和在其他任何地方调用的效果一样。而在 middleware 中调用`next()`，效果是进入下一个 middleware。

在 middleware 中使用`dispatch`的场景一般是接受到一个定向 action,这个 action 并不希望到达原生的分发 action,往往用在异步请求的需求

### 3.Redux 中，中间件的定义。

在 applyMiddleware 中，执行中间件的原理是为了依次封装 `dispatch` 方法。我们来看一个中间件的简单定义：

```
const logger = store => next => action => {
  console.log('dispatching', action)
  let result = next(action)
  console.log('next state', store.getState())
  return result
}
```

这里的 logger 就是一个中间件，当我们调用`applyMiddleware`方法时：

```
applyMiddleware(store,[logger]);
```

## 异步流