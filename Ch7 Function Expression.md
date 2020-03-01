`函数表达式 expression` 和 `函数申明 declaration` 不一样。
```javascript
function f() {
    b() // Error, b 没有申明
}

b = function (){}
```

```javascript
function f() {
    b() // 完全合法
}

function b() {}
// 其实JS在处理这段代码时候把b提升了，提升到了开头。
```
