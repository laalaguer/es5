# ES5/ES6, `export`, `import`, `require` 区别

ES5/ES6 不能混用，webpack会打包时候插件报错。我们来看看这两种究竟什么区别。

## `module.exports`, `require`
CommonJS 定义的一些老派的解决方案，用闭包方式实现了代码的层次分离，私有变量，模块化等等

```javascript
// a.js
var a = 10;

function increase() {
    a++;
    return a;
}

module.exports = {
    increase: increase
}

// b.js
var m = require('./a.js');
console.log(m.increase()); // 11
console.log(m.increase()); // 12
```

`module.exports` 这个写法也是固定，约定成俗的。需要 `require` 引入，然后 `m` 就相当于一个对象一样用。

## `export default`, `export`, `import`

这套是 ES6 的用法。

```javascript
// a.js
function a() {
    consol.log(a)
}

export a; // 注意，就单单用了一个 export
// b.js
import { a } from './a.js'; // Nodejs 可能因为不支持module会报错。Browser一般没问题。
console.log(a)
```

```javascript
// a.js
function a() {
    consol.log(a)
}

export default a; // 注意，export default

function b() {};
export b;

// b.js
import a, { b } from './a.js'; // Nodejs 可能因为不支持module会报错。Browser一般没问题。
console.log(a)
```

## ES5 改造到 ES6

```javascript

// a.js
function func() {}
module.exports = {
    func:func
}
// b.js
const a = require('./a.js');
a.func()

// a.js
function func() {}
// 改动在这里，返回个对象
export default {
    func: func
}
// b.js
import a from './a.js';
// 此时a是一个对象 {func:func}
a.func()
```