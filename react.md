# 1.React setState 会触发哪些操作？

新的 state 存到一个队列（`batchUpdate`）中。上面三次执行`setState`只是对传进去的对象进行了合并,然后再统一处理（批处理），触发重新渲染过程，因此只重新渲染一次，结果只增加了一次。这样做是非常明智的，因为在一个函数里调用多个`setState`是常见的，如果每一次调用`setState`都要引发重新渲染，显然不是最佳实践。

那么调用 `this.setState()`后什么时候 `this.state` 才会更新？
答案是即将要执行下一次的 `render` 函数时。

`setState`调用后，React 会执行一个事务（Transaction），在这个事务中，React 将新`state`放进一个队列中，当事务完成后，React 就会刷新队列，然后启动另一个事务，这个事务包括执行 `shouldComponentUpdate` 方法来判断是否重新渲染，如果是，React 就会进行`state`合并（`state merge`）,生成新的`state`和`props`；如果不是，React 仍然会更新`this.state`，只不过不会再 render 了。

# 2.平常开发怎么设计 react 组件的。比如 container 组件，业务组件等等的。

用重构去改善设计

# 3.react 组件的结构（实例对象的结构）

- this.props.children 可以是任何类型

**实例**

```
Button:{
    context:{},
    props:{},
    refs:{},
    state:null,
    updater:{isMounted: ƒ, enqueueCallback: ƒ, enqueueCallbackInternal: ƒ, enqueueForceUpdate: ƒ, enqueueReplaceState: ƒ, …},
    _reactInternalInstance:ReactCompositeComponentWrapper {_currentElement: {…}, _rootNodeID: 0, _compositeType: 0, _instance: Button, _hostParent: null, …},
    isMounted:(...),
    replaceState:(...),
    __proto__:ReactComponent,
}
```

**react 元素**

```
$$typeof:Symbol(react.element),
key:null,
props:{children: "1"},
ref:null,
type:"p",
_owner:ReactCompositeComponentWrapper {_currentElement: {…}, _rootNodeID: 0, _compositeType: 0, _instance: Button, _hostParent: null, …},
_store:{validated: true},
_self:null,
_source:null,
__proto__:Object,
```

## (1)用元素来描述树形结构

一个元素就是一个普通的对象，用来描述组件实例或 DOM 节点或它所需的属性。元素不是一个真实的实例。相反，它是告诉 React 在屏幕上展示哪些内容的一种方式。不能在元素上调用任何方法。它只是一个不可变的描述性的对象，拥有两个字段：`type`（string 或 ReactClass）和`props`（object）。

### DOM 元素

```
{
	type: 'button',
	props: {
		className: 'button button-blue',
		children: {
			type: 'b',
			props: {
				children: 'OK!'
			}
		}
	}
}

<button class='button button-blue'>
	<b>
		OK!
	</b>
</button>
```

React 元素很容易遍历，不需要进行解析，相对于实际 DOM 元素它们很轻量，它们只是对象而已。

### 组件元素

描述组件的元素也是一个元素，就像描述 DOM 节点的元素。它们可以彼此嵌套和混合

```
{
	type: Button,
	props: {
		color: 'blue',
		children: 'OK!'
	}
}

// 一个元素树形结构中可以混合和匹配DOM元素和组件元素。
const DeleteAccount = () => ({
	type: 'div',
	props: {
		children: [{
			type: 'p',
			props: {
				children: 'Are you sure?'
			}
		}, {
			type: DangerButton,
			props: {
				children: 'Yep'
			}
		}, {
			type: Button,
			props: {
				color: 'blue',
				children: 'Cancel'
			}
		}]
	}
});
```

jsx:

```
const DeleteAccount = () => (
	<div>
		<p>Are you sure?</p>
		<DangerButton>Yep</DangerButton>
		<Button color='blue'>Cancel</Button>
	</div>
);
```

## (2)组件封装元素树

当 React 看到一个有 function 或 class 类型的元素时，它就会询问这个组件会渲染出什么元素，并提供了哪些对应的 props。

```
{
	type: Button,
	props: {
		color: 'blue',
		children: 'OK!'
	}
}

// React将会问Button组件会渲染出什么，这个Button组件将会返回以下元素：

{
	type: 'button',
	props: {
		className: 'button button-blue',
		children: {
			type: 'b',
			props: {
				children: 'OK!'
			}
		}
	}
}
```

React 将会重复这个过程，直到页面上所有的组件都被替换为底层 DOM 标签元素为止。

## 自上而下的协同

```
ReactDOM.render({
	type: Form,
	props: {
		isSubmitted: false,
		buttonText: 'OK!'
	}
}, document.getElementById('container'));

// React会问这个Form组件返回什么样的元素树及其提高的props。React将会根据在简单的原语层面对React组件的理解来逐步完善它。

//React: You told me this...
{
	type: Form,
	props: {
		isSubmitted: false,
		buttonText: 'OK!'
	}
}

//React: Form提供的信息
{
	type: Button,
	props: {
		children: 'OK!',
		color: 'blue'
	}
}

//React: Button提供的信息
{
	type: 'button',
	props: {
		className: 'button button-blue',
		children: {
			type: 'b',
			props: {
				children: 'OK!'
			}
		}
	}
}
```

当调用 ReactDOM.render()或 setState()时，这就是被 React 成为协同的过程。协同的过程结束以后，React 已经知道了 DOM 树的结果，react-dom 或 react-native 根据需要更新的 DOM 节点进行一次最小的渲染。

# 4. 组件之间的通信

## (1)父子组件

### 1. 父 → 子

### 2.子 → 父

- state 定义在 parent 组件

```
// parent

class Parent extends Component {
  constructor() {
    super();
    this.state = {
      value: '',
    }
  }

  setValue = value => {
    this.setState({
      value,
    })
  }

  render() {
    return (
      <div>
        <div>我是parent, Value是：{this.state.value}</div>
        <Child setValue={this.setValue} />
      </div>
    );
  }
}

class Child extends Component {

  handleChange = e => {
    this.value = e.target.value;
  }

  handleClick = () => {
    const { setValue } = this.props;
    setValue(this.value);
  }

  render() {
    return (
      <div>
        我是Child
        <div className="card">
          state 定义在 parent
          <input onChange={this.handleChange} />
          <div className="button" onClick={this.handleClick}>通知</div>
        </div>
      </div>
    );
  }
}
```

- state 定义在 child 组件

```
// parent

class Parent extends Component {

  onChange = value => {
    console.log(value, '来自 child 的 value 变化');
  }

  render() {
    return (
      <div>
        <div>我是parent
        <Child onChange={this.onChange} />
      </div>
    );
  }
}

class Child extends Component {

  constructor() {
    super();
    this.state = {
      childValue: ''
    }
  }

  childValChange = e => {
    this.childVal = e.target.value;
  }

  childValDispatch = () => {
    const { onChange } = this.props;
    this.setState({
      childValue: this.childVal,
    }, () => { onChange(this.state.childValue) })
  }

  render() {
    return (
      <div>
        我是Child
        <div className="card">
          state 定义在 child
          <input onChange={this.childValChange} />
          <div className="button" onClick={this.childValDispatch}>通知</div>
        </div>
      </div>
    );
  }
}
```

## (2)兄弟组件

### 1.利用共有的 Container

```
// container
class Container extends Component {
  constructor() {
    super();
    this.state = {
      value: '',
    }
  }

  setValue = value => {
    this.setState({
      value,
    })
  }

  render() {
    return (
      <div>
        <A setValue={this.setValue}/>
        <B value={this.state.value} />
      </div>
    );
  }
}

// 兄弟A
class A extends Component {

  handleChange = (e) => {
    this.value = e.target.value;
  }

  handleClick = () => {
    const { setValue } = this.props;
    setValue(this.value);
  }

  render() {
    return (
      <div className="card">
        我是Brother A, <input onChange={this.handleChange} />
        <div className="button" onClick={this.handleClick}>通知</div>
      </div>
    )
  }
}

// 兄弟B
const B = props => (
  <div className="card">
    我是Brother B, value是：
    {props.value}
  </div>
);
```

### 2.利用 Context

```
// 顶级公共组件
class Wrapper extends Component {

  constructor() {
    super();
    this.state = {
      value: '',
    };
  }

  setValue = value => {
    this.setState({
      value,
    })
  }

  getChildContext() { // 必需
    return {
      value: this.state.value,
      setValue: this.setValue,
    };
  }
  render() {
    return (
      <div>
        <AParent />
        <BParent />
      </div>
    );
  }
}
// 必需
Wrapper.childContextTypes = {
  value: PropTypes.string,
  setValue: PropTypes.func,
};
```

```
// A 的 parent
class AParent extends Component {
  render() {
    return (
      <div className="card">
        <A />
      </div>
    );
  }
}
// A
class A extends Component {

  handleChange = (e) => {
    this.value = e.target.value;
  }

  handleClick = () => {
    const { setValue } = this.context;
    setValue(this.value);
  }

  render() {
    return (
      <div>
        我是parentA 下的 A, <input onChange={this.handleChange} />
        <div className="button" onClick={this.handleClick}>通知</div>
      </div>
    );
  }
}
// 必需
A.contextTypes = {
  setValue: PropTypes.func,
};
```

```
// B 的 parent
class BParent extends Component {
  render() {
    return (
      <div className="card">
        <B />
      </div>
    );
  }
}

// B
class B extends Component {

  render() {
    return (
      <div>
        我是parentB 下的 B, value是：
        {this.context.value}
      </div>
    );
  }
}
// 必需
B.contextTypes = {
  value: PropTypes.string,
};
```

问题：

当 context 发生改变的时候，比如数据流向是从 Container(context 定义) -> A -> B -> C(接收 context)，组件 A, B 也会发生 render，这样 C 组件才能拿到更新后的 context。万一你在 A, B 使用 shouldComponentUpdate: false 拦截了，或者某个组件是 PureComponent，context 发生变化，C 没有重新渲染，故拿不到最新的 context。

解决：

针对这种情况，我们要做的不是想方设法让 A，B render，而是通过其他手段，来实现 C 的重新渲染。通常是使用 context 做依赖注入，即 context 只注入一次，后续不会发生变化，这样各种无视组件层级透传属性。context 里面的数据进行改造，添加 subscribe 这样的函数，然后当某个数据变化的时候做 patch。子组件可能会加这样的代码：

```
// 子组件
  componentDidMount() {
    this.context.theme.subscribe(() => this.forceUpdate())
  }
```

### 3.发布订阅

### 4.Redux || Mobx

## 6.单页面应用路由实现原理

### Hash

当 url 的 hash 发生变化时，触发 hashchange 注册的回调，回调中去进行不同的操作，进行不同的内容的展示

```
function Router() {
    this.routes = {};
    this.currentUrl = '';
}
Router.prototype.route = function (path, callback) {
    this.routes[path] = callback || function () {
        };
};
Router.prototype.refresh = function () {
    console.log('触发一次 hashchange，hash 值为', location.hash);
    this.currentUrl = location.hash.slice(1) || '/';
    this.routes[this.currentUrl]();
};
Router.prototype.init = function () {
    window.addEventListener('load', this.refresh.bind(this), false);
    window.addEventListener('hashchange', this.refresh.bind(this), false);
};
window.Router = new Router();
window.Router.init();
var content = document.querySelector('body');
// change Page anything
function changeBgColor(color) {
    content.style.backgroundColor = color;
}
Router.route('/', function () {
    changeBgColor('white');
});
Router.route('/blue', function () {
    changeBgColor('blue');
});
Router.route('/green', function () {
    changeBgColor('green');
});
```

- init 监听浏览器 url hash 更新事件
- route 存储路由更新时的回调到回调数组 routes 中，回调函数将负责对页面的更新
- refresh 执行当前 url 对应的回调函数，更新页面

### History

```
// 这部分可参考红宝书 P215
history.go(-1);       // 后退一页
history.go(2);        // 前进两页
history.forward();     // 前进一页
history.back();      // 后退一页


// HTML5
history.pushState();         // 添加新的状态到历史状态栈
history.replaceState();     // 用新的状态代替当前状态
history.state             // 返回当前状态对象


// push 页面
history.pushState(state, title, url);
// pop 页面
window.onpopstate = (e) => {
};
```

通过`history.pushState`或者`history.replaceState`，也能做到：改变 `url` 的同时，不会刷新页面。所以 `history` 也具备实现路由控制的潜力。

- `hash` 的改变会触发 `onhashchange` 事件
- `history` 的改变不会触发任何事件呢。解决方案：罗列出所有可能改变 `history` 的途径，然后在这些途径一一进行拦截
- HTML5 规范中新增了一个 `onpopstate` 事件，通过它便可以监听到前进或者后退按钮的点击。但是调用`history.pushState`和`history.replaceState`并不会触发 `onpopstate` 事件

### react-router 与 history 结合形式

```
// 原对象
var historyModule = {
    listener: [],
    listen: function (listener) {
        this.listener.push(listener);
        console.log('historyModule listen..')
    },
    updateLocation: function(){
        this.listener.forEach(function(listener){
            listener('new localtion');
        })
    }
}
// Router 将使用 historyModule 对象，并对其包装
var Router = {
    source: {},
    init: function(source){
        this.source = source;
    },
    // 对 historyModule的listen进行了一层包装
    listen: function(listener) {
        return this.source.listen(function(location){
            console.log('Router listen tirgger.');
            listener(location);
        })
    }
}
// 将 historyModule 注入进 Router 中
Router.init(historyModule);
// Router 注册监听
Router.listen(function(location){
    console.log(location + '-> Router setState.');
})
// historyModule 触发回调
historyModule.updateLocation();
```

这种包装形式能够充分利用原对象（historyModule ）的内部机制，减少开发成本，也更好的分离包装函数（Router）的逻辑，减少对原对象的影响。

### 从点击 Link 到 render 对应 component ，路由中发生了什么

#### (1) 为何能够触发 render component ？

主要是因为触发了 react setState 的方法从而能够触发 render component。

```
Router.prototype.componentWillMount = function componentWillMount() {
    // .. 省略其他
    var createHistory = this.props.history;

    this.history = _useRoutes2['default'](createHistory)({
      routes: _RouteUtils.createRoutes(routes || children),
      parseQueryString: parseQueryString,
      stringifyQuery: stringifyQuery
    });

    // this.history.listen 去注册了 url 更新的回调函数
    // 回调函数将在 url 更新时触发，回调中的 setState 起到 render 了新的 component 的作用。
    this._unlisten = this.history.listen(function (error, state) {
        _this.setState(state, _this.props.onUpdate);
    });
};
```

#### (2)如何触发监听的回调函数的执行？

```
Link.prototype.render = function render() {
    // .. 省略其他
    props.onClick = function (e) {
      return _this.handleClick(e);
    };
    if (history) {
     // .. 省略其他
      props.href = history.createHref(to, query);
    }
    return _react2['default'].createElement('a', props);
};

Link.prototype.handleClick = function handleClick(event) {
    // .. 省略其他
    event.preventDefault();
    this.context.history.pushState(this.props.state, this.props.to, this.props.query);
};
```

- `history/createBrowserHistory`中使用的是 `window.history.replaceState(historyState, null, path)`
- `history/createHashHistory` 则使用 `window.location.hash = url`

```
// history/createHistory中的 updateLocation 方法

function updateLocation(newLocation) {
   // 示意代码
    location = newLocation;
    changeListeners.forEach(function (listener) {
      listener(location);
    });
}
function listen(listener) {
     // 示意代码
    changeListeners.push(listener);
}
```

### 总结：

1.  回调函数：含有能够更新 react UI 的 react `setState` 方法。
2.  注册回调：在 Router `componentWillMount` 中使用 `history.listen` 注册的回调函数，最终放在 `history` 模块的 回调函数数组 `changeListeners` 中。
3.  触发回调：`Link` 点击触发 `history` 中回调函数数组 `changeListeners` 的执行，从而触发原来 listen 中的 `setState` 方法，更新了页面

## 7.react router hashHistory 和 browserHistory 模式区别与配置

### 1、react-router 有 hashHistory 和 browserHistory 模式区别

- hashHistory:不需要服务器配置
- browserHistory: 需要服务器端做配置

### 2、browserHistory 模式为什么需要配置服务器？

在 browserHistory 模式下，URL 是指向真实 URL 的资源路径，当通过真实 URL 访问网站的时候（首页），这个时候可以正常加载我们的网站资源，而用户在非首页下手动刷新网页时，由于路径是指向服务器的真实路径，但该路径下并没有相关资源，用户访问的资源不存在，返回给用户的是 404 错误。所以需要配置服务器，把路由都指向 index.html，静态资源指向真实的文件夹。

### 3、使用 hashHistory 模式时，像这样 ?\_k=ckuvup 没用的在 URL 中是什么？

- 通过应用程序的 `pushState` 或 `replaceState` 跳转时，它可以在新的 location 中存储 location state 而不显示在 URL 中，这就像 post 的表单数据。
- 通过 `window.location.hash = newHash` 很简单地被用于跳转，且不用存储它们的 location state。但我们想全部的 history 都能够使用 location state，因此我们要为每一个 location 创建一个唯一的 key，并把它们的状态存储在 `session storage` 中。当访客点击“后退”和“前进”时，我们就会有一个机制去恢复这些 location state。

## 合成事件系统

React 快速的原因之一就是 React 很少直接操作 DOM，浏览器事件也是一样。原因是太多的浏览器事件会占用很大内存。

React 为此自己实现了一套合成系统，在 DOM 事件体系基础上做了很大改进，减少了内存消耗，简化了事件逻辑，最大化解决浏览器兼容问题。

其基本原理就是，所有在 JSX 声明的事件都会被委托在顶层 `document` 节点上，并根据事件名和组件名存储回调函数(`listenerBank`)。每次当某个组件触发事件时，在 `document` 节点上绑定的监听函数（`dispatchEvent`）就会找到这个组件和它的所有父组件(`ancestors`)，对每个组件创建对应 React 合成事件(`SyntheticEvent`)并批处理(`runEventQueueInBatch(events)`)，从而根据事件名和组件名调用(`invokeGuardedCallback`)回调函数。

因此，如果你采用下面这种写法，并且这样的 P 标签有很多个：

```
listView = list.map((item,index) => {
    return (
        <p onClick={this.handleClick} key={item.id}>{item.text}</p>
    )
})
```

React 帮你实现了事件委托。

由于 React 合成事件系统模拟事件冒泡的方法是构建一个自己及父组件队列，因此也带来一个问题，合成事件不能阻止原生事件，原生事件可以阻止合成事件。如果需要阻止事件传播, 仅用 `event.stopPropagation()` 是不行的, 因为 React 合成事件同样实现了 `stopPropagation()`, 调用 `event.stopPropagation()` 实际上调用了 React 的 `stopPropagation()`(这里的 event 指的是 React 合成事件), 只能阻止 React 合成事件的传播, 要想彻底阻止传播(包括原生事件), 需要调用 React 合成事件暴露的原声事件接口, 因此, 阻止事件传播需要同时调用合成事件与原生事件的接口:

```
stopPropagation: function(e){
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
}
```

## react 阻止点击事件

react 事件实际上是合成事件，而不是本地事件。

事件委托：React 实际上并未将事件处理程序附加到节点本身。 当 React 启动时，它开始使用单个事件侦听器监听顶级的所有事件。 当组件被挂载或卸载时，事件处理程序可以简单地添加到内部映射或从内部映射中删除。 当事件发生时，React 知道如何使用这个映射来分派它。 当映射中没有事件处理程序时，React 的事件处理程序是简单的无操作。

如果某个元素有多个相同类型事件的事件监听函数,则当该类型的事件触发时,多个事件监听函数将按照顺序依次执行.如果某个监听函数执行了 `event.stopImmediatePropagation()`方法,则除了该事件的冒泡行为被阻止之外(`event.stopPropagation`方法的作用),该元素绑定的后序相同类型事件的监听函数的执行也将被阻止.

区别：

- `event.stopPropagation`将阻止父元素上的处理程序运行。
- `event.stopImmediatePropagation`也会阻止同一元素上的其他处理程序运行

```
  e.stopPropagation();
  e.nativeEvent.stopImmediatePropagation();
```
