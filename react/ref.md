# React Refs

在 React 组件中，`props` 是父组件与子组件的唯一通信方式，但是在某些情况下我们需要在 `props` 之外强制修改子组件或 DOM 元素，这种情况下 React 提供了 Refs 解决

## 哪些场景会用到 refs

- 对 input/video/audio 需要控制时，例如输入框焦点、媒体播放状态
- 直接动画控制
- 集成第三方库

# Refs 三种方式

- 字符串模式 ：废弃不建议使用
- 回调函数
- `React.createRef()` ：React16.3 提供

## 字符串模式

```
class List extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  componentDidMount(){
    this.refs.inputEl.focus();
  }
  render() {
    const { list } = this.props;
    return (
        <input ref="inputEl"/>
    );
  }
}
```

### 问题

- 针对静态类型检测不支持
- 对复杂用例难以实现：需要向父组件暴露 dom；单个实例绑定多个 dom
- 绑定到的实例，是执行 render 方法的实例，结果会让人很意外，例如：

```
class Child extends React.Component {
  render() {
    const { renderer } = this.props;
    return <div>{renderer(1)}</div>;
  }
}
class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Child renderer={index => <div ref="test">{index}</div>} />
      </div>
    );
  }
}
```

## 回调函数模式

- 可以优雅在组件销毁时回收变量, ref 中的回调函数会在对应的普通组件 `componentDidMount`，`ComponentDidUpdate` 之前; 或者 `componentWillUnmount` 之后执行，`componentWillUnmount` 之后执行时，callback 接收到的参数是 null
- 很好的支持静态类型检测
- 针对数组遍历时可以直接转换为对应的数组

### 问题

通常为了绑定一个组件（元素）实例到当前实例上需要写一个函数，代码结构上看起来很冗余，为了一个变量，使用一个函数去绑定，每一个绑定组件（元素）都需要一个方法处理，大材小用

## React.createRef()

使用 `React.createRef()` 创建 refs，通过 ref 属性来获得 React 元素。当构造组件时，refs 通常被赋值给实例的一个属性，这样你可以在组件中任意一处使用它们.

```
class Test extends React.Component{
    myRef = React.createRef();
    componentDidMount(){
      // 访问ref
      const dom = this.myRef.current
    }
    render(){
        return (
            <div ref={this.myRef}/>
        )
    }
}
```

ref 的值取决于节点的类型:

- 当 `ref` 属性被用于一个普通的 HTML 元素时，`React.createRef()` 将接收底层 DOM 元素作为它的 `current` 属性以创建 `ref` 。
- 当 `ref` 属性被用于一个自定义类组件时，`ref`对象将接收该组件已挂载的实例作为它的 `current` 。
- 你不能在函数式组件上使用 `ref` 属性，因为它们没有实例。

# Refs 传递

## 额外参数传递

```
class Sub extends Component{
    render(){
        const {forwardRef} = this.props;
        return <div ref={forwardRef}/>
    }
}
class Sup extends Component{
    subRef = React.createRef();
    render(){
        return <Sub forwardRef={this.subRef}/>
    }
}
```

## React.forwardRef

```
class Sub extends Component{
    render(){
        const {forwardRef} = this.props;
        return <div ref={forwardRef}/>
    }
}

function forwardRef(props, ref){
    return <Sup {...props} forwardRef={ref}/>
}
// 为了devtool中展示有意义的组件名称
forwardRef.displayName=`forwardRef-${Component.displayName||Component.name}`

const XSub = React.forwardRef(forwardRef);

class Sup extends Component{
    _ref=(el)=>{this.subEl =el};
    render(){
        return <XSub ref={this._ref}/>
    }
}
```

### 优点

`React.forwardRef` 方式，对于使用组件者来说，`ref`是透明的，不需要额外定一个 `props` 传入，直接传递到了下级组件，作为高阶组件封装时，这样做更加友好.
