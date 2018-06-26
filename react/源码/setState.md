## 1.setState异步更新
通过一个队列机制实现`state`更新。当执行`setState`时，会把将要更新的`state`合并后放入状态队列，而不会立刻更新`this.state`。
作用：队列机制可以高效地批量更新`state`；
使用`this.state`直接修改值，该`state`不会被放入状态队列中,当下次调用`setState`并对状态队列进行合并时，将会忽略之前直接被修改的`state`。

## 2.setState循环调用风险
`componentWillUpdate`-- `setState`-->`performUpdateIfNecessary`->`updateComponent`->`componentWillUpdate`->...

## 3.setState调用栈

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