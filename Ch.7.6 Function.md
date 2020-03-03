## `函数申明 Declaration`
```javascript
b() // 完全合法
function b() {}

// 其实JS在处理这段代码时候把 b 申明提升了，提升到了开头。
// 进入 Context 之后，创立了 VO （准备期）
// VO里面就包含了 b 的申明
// 然后再执行代码 b()
```

只有两个地方能申明函数
- Global 环境里
- 另外一个 Function 里面

```javascript
function a() {} // 合法, Global 环境里

function b() {
    function c() {} // 合法，在 b 函数里
}
```

## `函数表达式 Expression`
```javascript
function f() {
    b() // 错误, b 没有申明
}

b = function (){}
```

表达式形式的函数定义：
- 在代码执行期才会添加
- 并没有被包含在 VO 里
- 处在表达式右边 👉（等号右边）