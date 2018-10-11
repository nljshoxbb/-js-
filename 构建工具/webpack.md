## 谈谈你对 webpack 的看法

`WebPack` 是一个模块打包工具，你可以使用`WebPack`管理你的模块依赖，并编绎输出模块们所需的静态文件。它能够很好地管理、打包 Web 开发中所用到的`HTML、JavaScript、CSS`以及各种静态文件（图片、字体等），让开发过程更加高效。对于不同类型的资源，`webpack`有对应的模块加载器。`webpack`模块打包器会分析模块间的依赖关系，最后 生成了优化且合并后的静态资源。

### (1) 两大特色

- code splitting（可以自动完成）
- loader 可以处理各种类型的静态文件，并且支持串联操作

### (2) 新特性

- 对 CommonJS 、 AMD 、ES6 的语法做了兼容
- 对 js、css、图片等资源文件都支持打包
- 串联式模块加载器以及插件机制，让其具有更好的灵活性和扩展性，例如提供对 CoffeeScript、ES6 的支持
- 有独立的配置文件 webpack.config.js
- 可以将代码切割成不同的 chunk，实现按需加载，降低了初始化时间
- 支持 SourceUrls 和 SourceMaps，易于调试
- 具有强大的 Plugin 接口，大多是内部插件，使用起来比较灵活
- webpack 使用异步 IO 并具有多级缓存。这使得 webpack 很快且在增量编译上更加快

## webpack 打包分析

### (1) 打包过程分析

- 对于单入口文件，每个入口文件把自己所依赖的资源全部打包到一起，即使一个资源循环加载的话，也只会打包一份
- 对于多入口文件的情况，分别独立执行单个入口的情况，每个入口文件各不相干。webpack 会对每个资源文件进行配置一个 id，即使多次加载，它的 id 也是一样的，因此只会打包一次

main.js 引用了 chunk1、chunk2,chunk1 又引用了 chunk2，打包后：bundle.js:

```
 ...省略webpack生成代码
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

    __webpack_require__(1);//webpack分配的id
    __webpack_require__(2);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {
	//chunk1.js文件
    __webpack_require__(2);
    var chunk1=1;
    exports.chunk1=chunk1;

/***/ },
/* 2 */
/***/ function(module, exports) {
	//chunk2.js文件
    var chunk2=1;
    exports.chunk2=chunk2;

/***/ }
/******/ ]);
```

### (2) 如何定位 webpack 打包速度慢的原因

```
$ webpack --profile --json > stats.json
```

可以让你清楚的看到模块的组成部分，以及在项目中可能存在的多版本引用的问题，对于分析项目依赖有很大的帮助

### (3) 优化方案与思路

1.  拆包，限制构建范围，减少资源搜索时间，无关资源不要参与构建
2.  使用增量构建而不是全量构建
3.  从 webpack 存在的不足出发，优化不足，提升效率

### (4) webpack 打包优化

#### 1.减小打包文件体积

- import css 文件的时候，会直接作为模块一并打包到 js 文件中
- 所有 js 模块 + 依赖都会打包到一个文件
- React、ReactDOM 文件过大

针对第一种情况，我们可以使用 `extract-text-webpack-plugin`，但缺点是会产生更长时间的编译，也没有 HMR，还会增加额外的 HTTP 请求。对于 css 文件不是很大的情况最好还是不要使用该插件。

针对第二种情况，我们可以通过提取公共代码块，这也是比较普遍的做法：

```
new webpack.optimize.CommonsChunkPlugin('common.js');
```

通过这种方法，我们可以有效减少不同入口文件之间重叠的代码，对于非单页应用来说非常重要。

针对第三种情况，我们可以把 React、ReactDOM 缓存起来：

```
entry: {
    vendor: ['react', 'react-dom']
},
new webpack.optimize.CommonsChunkPlugin('vendor','common.js'),
```

我们在开发环境使用 react 的开发版本，这里包含很多注释，警告等等。部署上线的时候可以通过 `webpack.DefinePlugin`来切换生产版本。

#### 2.代码压缩

webpack 提供的 UglifyJS 插件由于采用单线程压缩，速度很慢 ,
`webpack-parallel-uglify-plugin` 插件可以并行运行 UglifyJS 插件(待验证)，这可以有效减少构建时间，当然，该插件应用于生产环境而非开发环境，配置如下：

```
var ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
new ParallelUglifyPlugin({
   cacheDir: '.cache/',
   uglifyJS:{
     output: {
       comments: false
     },
     compress: {
       warnings: false
     }
   }
 })
```

### (5) 缓存与增量构建

由于项目中主要使用的是 react.js 和 es6，结合 webpack 的`babel-loader`加载器进行编译，每次重新构建都需要重新编译一次，我们可以针对这个进行增量构建，而不需要每次都全量构建。

`babel-loader`可以缓存处理过的模块，对于没有修改过的文件不会再重新编译，`cacheDirectory`有着 2 倍以上的速度提升，这对于 rebuild 有着非常大的性能提升。

```
var node_modules = path.resolve(__dirname, 'node_modules');
var pathToReact = path.resolve(node_modules, 'react/react');
var pathToReactDOM = path.resolve(node_modules,'react-dom/index');

{
        test: /\.js|jsx$/,
        include: path.join(__dirname, 'src'),
        exclude: /node_modules/,
        loaders: ['react-hot','babel-loader?cacheDirectory'],
        noParse: [pathToReact,pathToReactDOM]
}
```

我们还可以使用 webpack 自带的 cache，以缓存生成的模块和 chunks 以提高多个增量构建的性能。

### (6) 减少构建搜索或编译路径

```
Resolove.root VS Resolove.moduledirectories
```

大多数路径应该使用`resolve.root`，只对嵌套的路径使用 `Resolove.moduledirectories`，这可以获得显著的性能提升

原因是`Resolove.moduledirectories`是取相对路径，所以比起`resolve.root`会多 parse 很多路径

```
resolve: {
    root: path.resolve(__dirname,'src'),
    modulesDirectories: ['node_modules']
},
```

### (7) 其他

开启 devtool: "#inline-source-map"会增加编译时间
服务端渲染，首屏优化，异步加载模块，按需加载，代码分割

## Webpack2 VS Webpack1

### 1. 增加对 ES6 模块的原生支持

### 2. 可以混用 ES2015 和 AMD 和 CommonJS

### 3. 支持 tree-shaking（减少打包后的体积）

运用 到 Commonjs 和 es6 模块 的区别

main.js

```
import { sayHello } from './greeter.ts';

sayHello();
```

greeter.js

```
export function sayHello(){
    alert('hello')
}

export function sayWorld(){
    alert('world')
}
```

打包后

```
[
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__person__ = __webpack_require__(1);


Object(__WEBPACK_IMPORTED_MODULE_0__person__["a" /* sayHello */])();

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return sayHello; });
/* unused harmony export sayWorld */

    function sayHello(){
        alert('hello');
    }
    function sayWorld(){
        alert('world');
    }



/***/ })
/******/ ]
```

实际上只 return 了一个`sayHello`。
现在只需要压缩一下整个 Js 代码，就能把没引用的 sayWorld 剔除。

```
webpack --optimize-minimize
```

```
function(e,n,r){"use strict";function t(){alert("hello")}r.d(n,"a",function(){return t})}]);
```

### 4. 配置选项语法有较大改动，且不向下兼容

#### 4.1 配置项 -resolve（解析）

- 取消了 extensions 空字符串（表示导入文件无后缀名）

Webpack1

```
resolve: {
    extensions: ['', '.js', '.css'],
    modulesDirectories: ['node_modules', 'src']
}
```

Webpack2

```
resolve: {
    extensions: ['.js', '.css'],
    modules: [ path.resolve(__dirname, 'node_modules'), path.join(__dirname, './src') ]
}
```

#### 4.2 配置项 - module（模块）

- 外层 loaders 改为 rules
- 内层 loader 改为 use
- 所有插件必须加上 -loader，不再允许缩写
- 不再支持使用!连接插件，改为数组形式
- json-loader 模块移除，不再需要手动添加，webpack2 会自动处理

Webpack1

```
module: {
    loaders: [{
        test: /\.(less|css)$/,
        loader: "style!css!less!postcss"
    }, {
        test: /\.json$/,
        loader: 'json'
    }]
}
```

Webpack2

```
module: {
    rules: [{
        test: /\.(less|css)$/,
        use: [
            "style-loader",
            "css-loader",
            "less-loader",
            "postcss-loader"
        ]
    }]
};
```

#### 4.3 配置项 - plugins（插件）

移除了 OccurenceOrderPlugin 模块（已内置）、NoErrorsPlugin 模块（已内置）

## Webpack3 VS Webpack2

> 两个版本几乎完全兼容，新增部分新特性

### 1. 加入 Scope Hoisting（作用域提升）

- 之前版本将每个依赖都分别封装在一个闭包函数中来独立作用域。这些包装函数闭包函数降低了浏览器 JS 引擎解析速度
- Webpack 团队参考 Closure Compiler 和 Rollup JS，将有联系的模块放到同一闭包函数中，从而减少闭包函数数量，使文件大小的少量精简，提高 JS 执行效率
- 在 Webpack3 配置中加入 ModuleConcatenationPlugin 插件来启用作用域提升

```
module.exports = {
    plugins: [
        new webpack.optimize.ModuleConcatenationPlugin()
    ]
};
```

### 2. 加入 Magic Comments（魔法注解）

在 Webpack2 中引入了 Code Splitting-Async 的新方法 `import()`，用于动态引入 ES Module，Webpack 将传入 import 方法的模块打包到一个单独的代码块（chunk），但是却不能像 require.ensure 一样，为生成的 chunk 指定 chunkName。因此在 Webpack3 中提出了 Magic Comment 用于解决该问题

```
import(/_ webpackChunkName: "my-chunk-name" _/ 'module');
```
