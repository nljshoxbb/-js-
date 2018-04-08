## redux 源码解析

1、共享状态 -> dispatch

2、store统一管理 dispatch getState

3、性能优化 --> reducer是一个纯函数

4、最终初始化整个reducer

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

## 为什么需要状态管理库

### 1.我们要解决的是什么问题？

* 一个组件需要和另一个组件共享状态
* 一个组件需要改变另一个组件的状态

到一定程度时，推算应用的状态将会变得越来越困难

### 2.Mobx 和 Redux 的不同？

* 函数式 VS 面向对象
* redux 需要 connect，也需要 Immutable Data，reducer，action，文件、代码量较多，概念也多。 mobx 直接引用对象组织，修改数据。
* redux 数据流动很自然，任何 dispatch 都会导致广播，需要依据对象引用是否变化来控制更新粒度。mobx 数据流流动不自然，只有用到的数据才会引发绑定，局部精确更新，但免去了粒度控制烦恼。
* redux 有时间回溯，每个 action 都被记录下来，可预测性，定位错误的优势。mobx 只有一份数据引用，不会有历史记录。
* redux 引入中间件去解决异步操作，以及很多复杂的工作。mobx 没有中间件，数据改了就是改了，没有让你增加中间件的入口。

* mobx 使用的是 `@inject` 装饰器语法注入，redux 使用的是 `connect` 语法注入
* mobx 使用 `@observer` 语法，让一个 component 能响应 store 字段更新
* mobx 会动态精确绑定数据字段和对应 component 关系， redux 使用 connect 参数手动控制传递哪些字段
* mobx 直接修改 store 的状态，但是必须在 @action 修饰的函数中完成，@action 的语义，表示这是一个修改状态的操作
* redux Provider 传递 store 是强约定，mobx Provider 灵活传递 store actions，也可以是其它名字，比如 db
* redux 使用了比较难以理解的高阶函数和参数 `connect combineReducers bindActionCreators mapStateToProps mapDispatchToProps` ，mobx 方案，除了使用 decorator 语法，没有其它让人感觉理解困难的函数。
* redux 引入了数据流，mobx 没有数据流的概念，通过 actions 直接改变数据

### 3.为什么用 mobx

* 简单，概念，代码少
* class 去定义、组织 store，数据、computed、action 定义到一块，结构更清晰，面向对象的思维更适合快速的业务开发
* 某个 store 的引用不一定非在组件中才能取到，因为是对象，可以直接引用。比如在 constant.js 文件中可以定义一些来自 store 的变量。
* 据说效率更高。mobx 会建立虚拟推导图 (virtual derivation graph)，保证最少的推导依赖

### 异步 action

只需要把异步操作、请求也放到 @action 里就好了。假设我们已经封装好了一个 fetch 的方法，并返回一个 promise，现在去使用一个异步 action 请求 list 数据

```
  @observable list = [
    loading: false,
    dataSource: [],
  ];
  @action getList = async () => {
    this.list.loading = true;
    const data = await fetch();
    this.list.dataSource = data;
  }
```

### mobx 常见问题

* observable 之后的数组并不是普通数组的形式，所以有时候在组件内部做判断的时候可能会有问题，通常用 toJS() 转化一下。
* observer 不要放到顶层 Page，因为当随便一个 state 的属性都改变，整个 Page 都会 render，即使其他 children 组件的 dom 结构没变，但还是会有一些性能开销的。所以 observer 尽量去包装小组件。
* 与自定义的 hoc 连用的时候，observer 要 放到最里面。因为要包装组件的 render 函数，还要收集 state 的依赖。形如

```
@inject('store')
@myHOC
@observer
class A extends Component {

}
```

* 不必像 redux 那样，把所有的 store 都注入 Provider， 虽然 mobx 支持这么做。一些公用的 store，比如用户信息啦，可以注入 Provider，然后子组件通过 inject 注入。但是大部分不能公用的列表数据，可以直接 import

```
import listStore from 'stores/list';

@observer class List extends Component {
  render() {
    return (
      <ul>
        {listStore.list.map(item => <li>{item.name}</li>)}
      </ul>
    )
  }
}
```

* mobx 和 react 的 state

  使用了 mobx，你会发现 setState 那种写法以及不能立刻生效是很不习惯的。大部分情况下，你都可以不去写 state，而是通过 observable 去定义变量，observer 包装组件，这些变量也可以定义到组件内部（可观察的局部组件状态）。例如：

```
import {observer} from "mobx-react"
import {observable} from "mobx"

@observer class Count extends React.Component {
  @observable num = 0

  componentDidMount() {
    setInterval(() => {
      this.num++
    }, 1000)
  }

  render() {
    return <span>Count: { this.num } </span>
  }
})
```

## react-redux 实现原理

基于 context

### connect

* 有大量重复的逻辑
* 对 context 依赖性过强

实现高阶组件

```
export const connect = (mapStateToProps, mapDispatchToProps) => (WrappedComponent) => {
  class Connect extends Component {
    static contextTypes = {
      store: PropTypes.object
    }

    constructor () {
      super()
      this.state = {
        allProps: {}
      }
    }

    componentWillMount () {
      const { store } = this.context
      this._updateProps()
      store.subscribe(() => this._updateProps())
    }

    _updateProps () {
      const { store } = this.context
      let stateProps = mapStateToProps
        ? mapStateToProps(store.getState(), this.props)
        : {} // 防止 mapStateToProps 没有传入
      let dispatchProps = mapDispatchToProps
        ? mapDispatchToProps(store.dispatch, this.props)
        : {} // 防止 mapDispatchToProps 没有传入
      this.setState({
        allProps: {
          ...stateProps,
          ...dispatchProps,
          ...this.props
        }
      })
    }

    render () {
      return <WrappedComponent {...this.state.allProps} />
    }
  }
  return Connect
}
```

### Provider

它就是一个容器组件，会把嵌套的内容原封不动作为自己的子组件渲染出来。它还会把外界传给它的 `props.store` 放到 `context`，这样子组件 `connect` 的时候都可以获取到。

```
export class Provider extends Component {
  static propTypes = {
    store: PropTypes.object,
    children: PropTypes.any
  }

  static childContextTypes = {
    store: PropTypes.object
  }

  getChildContext () {
    return {
      store: this.props.store
    }
  }

  render () {
    return (
      <div>{this.props.children}</div>
    )
  }
}
```
