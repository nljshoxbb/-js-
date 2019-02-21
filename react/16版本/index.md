## React v16.0

### render 支持返回数组和字符串

```
// 不需要再将元素作为子元素装载到根元素下面
render() {
  return [
    <li key="1"/>1</li>,
    <li key="2"/>2</li>,
    <li key="3"/>3</li>,
  ];
}
```

### Error Boundaries

如果一个错误是在组件的渲染或者生命周期方法中被抛出，整个组件结构就会从根节点中卸载，而不影响其他组件的渲染，可以利用 error boundaries 进行错误的优化处理。

```
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  componentDidCatch(error, info) {
    this.setState({ hasError: true });

    logErrorToMyService(error, info);
  }

  render() {
    if (this.state.hasError) {
      return <h1>数据错误</h1>;
    }

    return this.props.children;
  }
}
```

### createPortal

createPortal 的出现为 弹窗、对话框 等脱离文档流的组件开发提供了便利，替换了之前不稳定的 API `unstable_renderSubtreeIntoContainer`，在代码使用上可以做兼容，如：

```
const isReact16 = ReactDOM.createPortal !== undefined;

const getCreatePortal = () =>
  isReact16
    ? ReactDOM.createPortal
    : ReactDOM.unstable_renderSubtreeIntoContainer;
```

使用 createPortal 可以快速创建 Dialog 组件，且不需要牵扯到 `componentDidMount、componentDidUpdate` 等生命周期函数。并且通过 createPortal 渲染的 DOM，事件可以从 portal 的入口端冒泡上来，如果入口端存在 `onDialogClick` 等事件，createPortal 中的 DOM 也能够被调用到。

```
import React from 'react';
import { createPortal } from 'react-dom';

class Dialog extends React.Component {
  constructor() {
    super(props);

    this.node = document.createElement('div');
    document.body.appendChild(this.node);
  }

  render() {
    return createPortal(
      <div>
        {this.props.children}
      </div>,
      this.node
    );
  }
}
```

- 支持自定义 DOM 属性
- 减少文件体积

### Fiber

在 React16 之前，更新组件时会调用各个组件的生命周期函数，计算和比对 Virtual DOM，更新 DOM 树等，这整个过程是同步进行的，中途无法中断。当组件比较庞大，更新操作耗时较长时，就会导致浏览器唯一的主线程都是执行组件更新操作，而无法响应用户的输入或动画的渲染，很影响用户体验。

Fiber 利用分片的思想，把一个耗时长的任务分成很多小片，每一个小片的运行时间很短，在每个小片执行完之后，就把控制权交还给 React 负责任务协调的模块，如果有紧急任务就去优先处理，如果没有就继续更新，这样就给其他任务一个执行的机会，唯一的线程就不会一直被独占。

因此，在组件更新时有可能一个更新任务还没有完成，就被另一个更高优先级的更新过程打断，优先级高的更新任务会优先处理完，而低优先级更新任务所做的工作则会完全作废，然后等待机会重头再来。所以 React Fiber 把一个更新过程分为两个阶段：

- 第一个阶段 Reconciliation Phase，Fiber 会找出需要更新的 DOM，这个阶段是可以被打断的；
- 第二个阶段 Commit Phase，是无法别打断，完成 DOM 的更新并展示；

在使用 Fiber 后，需要要检查与第一阶段相关的生命周期函数，避免逻辑的多次或重复调用：

- componentWillMount
- componentWillReceiveProps
- shouldComponentUpdate
- componentWillUpdate

与第二阶段相关的生命周期函数：

- componentDidMount
- componentDidUpdate
- componentWillUnmount

## React v16.1

### react-call-return（在 16.4.0 中已被移出，未来会以另一种形式归来）

react-call-return 目前还是一个独立的 npm 包，主要是针对 父组件需要根据子组件的回调信息去渲染子组件场景 提供的解决方案

在 React16 之前，针对上述场景一般有两个解决方案：

- 首先让子组件初始化渲染，通过回调函数把信息传给父组件，父组件完成处理后更新子组件 `props`，触发子组件的第二次渲染才可以解决，子组件需要经过两次渲染周期，可能会造成渲染的抖动或闪烁等问题；
- 首先在父组件通过 `children` 获得子组件并读取其信息，利用 `React.cloneElement` 克隆产生新元素，并将新的属性传递进去，父组件 `render` 返回的是克隆产生的子元素。虽然这种方法只需要使用一个生命周期，但是父组件的代码编写会比较麻烦；

React16 支持的 react-call-return，提供了两个函数 `unstable_createCall` 和 `unstable_createReturn`，其中 `unstable_createCall` 是 父组件使用，`unstable_createReturn` 是 子组件使用，父组件发出 Call，子组件响应这个 Call，即 Return。

- 在父组件 `render` 函数中返回对 `unstable_createCall` 的调用，第一个参数是 `props.children`，第二个参数是一个回调函数，用于接受子组件响应 Call 所返回的信息，第三个参数是 `props`；
- 在子组件 `render` 函数返回对 `unstable_createReturn` 的调用，参数是一个对象，这个对象会在 `unstable_createCall` 第二个回调函数参数中访问到；
- 当父组件下的所有子组件都完成渲染周期后，由于子组件返回的是对 `unstablecreateReturn` `的调用所以并没有渲染元素，unstablecreateCall` 的第二个回调函数参数会被调用，这个回调函数返回的是真正渲染子组件的元素；

针对普通场景来说，react-call-return 有点过度设计的感觉，但是如果针对一些特定场景的话，它的作用还是非常明显，比如，在渲染瀑布流布局时，利用 react-call-return 可以先缓存子组件的 `ReactElement`，等必要的信息足够之后父组件再触发 `render`，完成渲染。

```
import React from 'react';
import { unstable_createReturn, unstable_createCall } from 'react-call-return';

const Child = (props) => {
  return unstable_createReturn({
    size: props.children.length,
    renderItem: (partSize, totalSize) => {
      return <div>{ props.children } { partSize } / { totalSize }</div>;
    }
  });
};

const Parent = (props) => {
  return (
    <div>
      {
        unstable_createCall(
          props.children,
          (props, returnValues) => {
            const totalSize = returnValues.map(v => v.size).reduce((a, b) => a + b, 0);
            return returnValues.map(({ size, renderItem }) => {
              return renderItem(size, totalSize);
            });
          },
          props
        )
      }
    </div>
  );
};
```

## React v16.2

### Fragment

Fragment 组件其作用是可以将一些子元素添加到 DOM tree 上且不需要为这些元素提供额外的父节点，相当于 `render` 返回数组元素。

```
render() {
  return (
    <Fragment>
      Some text.
      <h2>A heading</h2>
      More text.
      <h2>Another heading</h2>
      Even more text.
    </Fragment>
  );
}
```

## React v16.3

### createContext

全新的 Context API 可以很容易穿透组件而无副作用，其包含三部分：`React.createContext，Provider，Consumer`。

- `React.createContext` 是一个函数，它接收初始值并返回带有 `Provider` 和 `Consumer` 组件的对象；
- `Provider` 组件是数据的发布方，一般在组件树的上层并接收一个数据的初始值；
- `Consumer` 组件是数据的订阅方，它的 `props.children` 是一个函数，接收被发布的数据，并且返回 `React Element`；

```
const ThemeContext = React.createContext('light');

class ThemeProvider extends React.Component {
  state = {theme: 'light'};

  render() {
    return (
      <ThemeContext.Provider value={this.state.theme}>
        {this.props.children}
      </ThemeContext.Provider>
    );
  }
}

class ThemedButton extends React.Component {
  render() {
    return (
      <ThemeContext.Consumer>
        {theme => <Button theme={theme} />}
      </ThemeContext.Consumer>
    );
  }
}
```

### createRef / forwardRef

```
// before React 16
···

  componentDidMount() {
    const el = this.refs.myRef
  }

  render() {
    return <div ref="myRef" />
  }

···

// React 16+
  constructor(props) {
    super(props)

    this.myRef = React.createRef()
  }

  render() {
    // this.myRef.current 获取标签元素
    return <div ref={this.myRef} />
  }
···
```

`React.forwardRef` 是 `Ref` 的转发, 它能够让父组件访问到子组件的 `Ref`，从而操作子组件的 DOM。 `React.forwardRef` 接收一个函数，函数参数有 `props` 和 `ref`。

```
const TextInput = React.forwardRef((props, ref) => (
  <input type="text" placeholder="Hello forwardRef" ref={ref} />
))

const inputRef = React.createRef()

class App extends Component {
  constructor(props) {
    super(props)

    this.myRef = React.createRef()
  }

  handleSubmit = event => {
    event.preventDefault()

    alert('input value is:' + inputRef.current.value)
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <TextInput ref={inputRef} />
        <button type="submit">Submit</button>
      </form>
    )
  }
}
```

### 生命周期函数的更新

React16 采用了新的内核架构 Fiber，Fiber 将组件更新分为两个阶段：`Render Parse` 和 `Commit Parse`，因此 React 也引入了 `getDerivedStateFromProps` 、 `getSnapshotBeforeUpdate` 及 `componentDidCatch` 等三个全新的生命周期函数。同时也将 `componentWillMount、componentWillReceiveProps` 和 `componentWillUpdate` 标记为不安全的方法。

#### static getDerivedStateFromProps(nextProps, prevState)

`getDerivedStateFromProps(nextProps, prevState)` 其作用是根据传递的 `props` 来更新`state`。它的一大特点是无副作用，由于处在 Render Phase 阶段，所以在每次的更新都会触发该函数， 在 API 设计上采用了静态方法，使其无法访问实例、无法通过`ref` 访问到 `DOM` 对象等，保证了该函数的纯粹高效。

为了配合未来的 React 异步渲染机制，React v16.4 对 `getDerivedStateFromProps` 做了一些改变， 使其不仅在 `props` 更新时会被调用，`setState` 时也会被触发。

- 如果改变 `props` 的同时，有副作用的产生，这时应该使用 `componentDidUpdate；`
- 如果想要根据 `props` 计算属性，应该考虑将结果 memoization 化；
- 如果想要根据 `props` 变化来重置某些状态，应该考虑使用受控组件；

```
static getDerivedStateFromProps(props, state) {
  if (props.value !== state.controlledValue) {
    return {
      controlledValue: props.value,
    };
  }

  return null;
}
```

#### getSnapshotBeforeUpdate(prevProps, prevState)

`getSnapshotBeforeUpdate(prevProps, prevState)` 会在组件更新之前获取一个 snapshot，并可以将计算得的值或从 DOM 得到的信息传递到 `componentDidUpdate(prevProps, prevState, snapshot)` 函数的第三个参数，常常用于 scroll 位置定位等场景。

#### componentDidCatch(error, info)

componentDidCatch 函数让开发者可以自主处理错误信息，诸如错误展示，上报错误等，用户可以创建自己的 Error Boundary 来捕获错误。

#### componentWillMount(nextProps, nextState)

`componentWillMount` 被标记为不安全，因为在 `componentWillMount` 中获取异步数据或进行事件订阅等操作会产生一些问题，比如无法保证在 `componentWillUnmount` 中取消掉相应的事件订阅，或者导致多次重复获取异步数据等问题。

#### componentWillReceiveProps(nextProps) / componentWillUpdate(nextProps, nextState)

`componentWillReceiveProps / componentWillUpdate` 被标记为不安全，主要是因为操作 `props` 引起的 re-render 问题，并且对 `DOM` 的更新操作也可能导致重新渲染。

### Strict Mode

StrictMode 可以在开发阶段开启严格模式，发现应用存在的潜在问题，提升应用的健壮性，其主要能检测下列问题：

- 识别被标志位不安全的生命周期函数
- 对弃用的 API 进行警告
- 探测某些产生副作用的方法
- 检测是否使用 findDOMNode
- 检测是否采用了老的 Context API

```
class App extends React.Component {
  render() {
    return (
      <div>
        <React.StrictMode>
          <ComponentA />
        </React.StrictMode>
      </div>
    )
  }
}
```

## React v16.4

- Pointer Events
- update getDerivedStateFromProps

## React v16.5

- Profiler

## React v16.6

### memo

### lazy

### Suspense

### static contextType

static contextType 为 Context API 提供了更加便捷的使用体验，可以通过 `this.context` 来访问 Context。

```
const MyContext = React.createContext();

class MyClass extends React.Component {
  static contextType = MyContext;

  componentDidMount() {
    const value = this.context;
  }

  componentDidUpdate() {
    const value = this.context;
  }

  componentWillUnmount() {
    const value = this.context;
  }

  render() {
    const value = this.context;
  }
}
```

### static getDerivedStateFromError()

`static getDerivedStateFromError(error)` 允许开发者在 render 完成之前渲染 Fallback `UI，该生命周期函数触发的条件是子组件抛出错误，getDerivedStateFromError` 接收到这个错误参数后更新 state。

```
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // You can also log the error to an error reporting service
    logErrorToMyService(error, info);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
```

##　 React v16.7（~Q1 2019）

### Hooks

Hooks 要解决的是状态逻辑复用问题，且不会产生 JSX 嵌套地狱，其特性如下：

- 多个状态不会产生嵌套，依然是平铺写法；
- Hooks 可以引用其他 Hooks；
- 更容易将组件的 UI 与状态分离；

Hooks 并不是通过 `Proxy` 或者 `getters` 实现，而是通过数组实现，每次 `useState` 都会改变下标，如果 `useState` 被包裹在 condition 中，那每次执行的下标就可能对不上，导致 `useState` 导出的 `setter` 更新错数据。

```
function App() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        Open Modal
      </Button>
      <Modal
        visible={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
```
