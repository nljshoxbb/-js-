##　 DOM 副作用修改 / 监听

做一个网页，总有一些看上去和组件关系不大的麻烦事，比如修改页面标题（切换页面记得改成默认标题）、监听页面大小变化（组件销毁记得取消监听）、断网时提示（一层层装饰器要堆成小山了）。而 React Hooks 特别擅长做这些事，造这种轮子，大小皆宜。

### 修改页面 title

```
function useDocumentTitle(title) {
  useEffect(
    () => {
      document.title = title;
      return () => (document.title = "前端精读");
    },
    [title]
  );
}

```

使用 `useDocumentTitle("个人中心");`

### 监听页面大小变化，网络是否断开

```
function getSize() {
  return {
    innerHeight: window.innerHeight,
    innerWidth: window.innerWidth,
    outerHeight: window.outerHeight,
    outerWidth: window.outerWidth
  };
}

function useWindowSize() {
  let [windowSize, setWindowSize] = useState(getSize());

  function handleResize() {
    setWindowSize(getSize());
  }

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return windowSize;
}
```

### 动态注入 css

```
const className = useCss({
  color: "red"
});

return <div className={className}>Text.</div>;
```

### 拿到组件 onChange 抛出的值

```
function useInputValue(initialValue) {
  let [value, setValue] = useState(initialValue);
  let onChange = useCallback(function(event) {
    setValue(event.currentTarget.value);
  }, []);

  return {
    value,
    onChange
  };
}

let name = useInputValue("Jamie");
// name = { value: 'Jamie', onChange: [Function] }
return <input {...name} />;
```

这里要注意的是，我们对组件增强时，组件的回调一般不需要销毁监听，而且仅需监听一次，这与 `DOM` 监听不同，因此大部分场景，我们需要利用 `useCallback` 包裹，并传一个空数组，来保证永远只监听一次，而且不需要在组件销毁时注销这个 `callback`。

### 在某个时间段内获取 0-1 之间的值

这个是动画最基本的概念，某个时间内拿到一个线性增长的值。

效果：通过 `useRaf(t)` 拿到 t 毫秒内不断刷新的 0-1 之间的数字，期间组件会不断刷新，但刷新频率由 `requestAnimationFrame` 控制（不会卡顿 UI）。

`const value = useRaf(1000);`

实现：写起来比较冗长，这里简单描述一下。利用 `requestAnimationFrame` 在给定时间内给出 0-1 之间的值，那每次刷新时，只要判断当前刷新的时间点占总时间的比例是多少，然后做分母，分子是 1 即可。

### 通用 Http 封装

`const { loading, error, result } = useAsync(fetchUser, [id]);`

```
export function useAsync(asyncFunction) {
  const asyncState = useAsyncState(options);

  useEffect(() => {
    const promise = asyncFunction();
    asyncState.setLoading();
    promise.then(
      result => asyncState.setResult(result);,
      error => asyncState.setError(error);
    );
  }, params);
}
```

### Hooks 思维的表单组件

```
const [formState, { text, password }] = useFormState();
return (
  <form>
    <input {...text("username")} required />
    <input {...password("password")} required minLength={8} />
  </form>
);
```

仔细观察一下结构，不难发现，我们只要结合 组件辅助 小节说的 “拿到组件 onChange 抛出的值” 一节的思路，就能轻松理解 text、password 是如何作用于 input 组件，并拿到其输入状态。