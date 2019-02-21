## 1.setState 异步更新

通过一个队列机制实现`state`更新。当执行`setState`时，会把将要更新的`state`合并后放入状态队列，而不会立刻更新`this.state`。
作用：队列机制可以高效地批量更新`state`；
使用`this.state`直接修改值，该`state`不会被放入状态队列中,当下次调用`setState`并对状态队列进行合并时，将会忽略之前直接被修改的`state`。

## 2.setState 循环调用风险

`componentWillUpdate`-- `setState`-->`performUpdateIfNecessary`->`updateComponent`->`componentWillUpdate`->...

## 3.setState 调用栈

```flow
st=>start: this.setState(newState)
op1=>operation: newState存入pending队列
op2=>operation: 调用enqueueUpdate
cond=>condition: 是否处于批量更新
e1=>end: 将组件保存到dirtyComponents
e2=>end: 遍历dirtyComponents
调用updateComponent
更新pending state or props

st->op1->op2->cond
cond(yes)->e1
cond(no)->e2
```

## 4.setState 第一个参数有两种传递方式 1.一个对象 2. 一个函数 这两种写法有什么区别呢？

```
   ...
    this.state = { text : '这是一个栗子' }
    ...

    // 使用传递对象的写法
    handleClick = () => {
        this.setState({ text: this.state.text + '111' })
        this.setState({ text: this.state.text + '222' })
    }

    // 使用传递函数的写法
    handleClick = () => {
        this.setState((prevState) => {
            return { text: prevState.text + '111' }
        })
        this.setState((prevState) => {
            return { text: prevState.text + '222' }
        })
    }

    render() {
        return <div onClick={this.handleClick}>{this.state.text}</div>
    }
```

两种传递方式，得到的结果是不一样的。

- 传递对象 => this.state.text => '这是一个栗子 222'
- 传递函数 => this.state.text => '这是一个栗子 111222'

  setState 为了提升性能，在批量执行 state 改变在做统一的 DOM 渲染。而在这个批量执行的过程中，如果你多次传递的是一堆对象，它就会做一些对象合并或者组合的操作，例如 Object.assign({}, { a: '111' }, { a: '222' })。如果 key 值一样的话，后面的值会覆盖掉前面的值。 但多次传递函数方式，每次 React 从 setState 执行函数，并通过传递已更新的状态来更新你的状态。这使得功能 setState 可以基于先前状态设置状态。
