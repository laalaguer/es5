# 执行上下文 Execution Context

`Execution Context` 就是一种载具。用来承载`运行时`对代码解析时候各个上下文变量。一般是 stack 来实现的。每次`执行`一个函数，就会往栈上推送一个Context，执行完毕再解除。

`所以执行上下文，只存在于执行时候!!！执行完毕就消失了！`

## Context 逐层堆叠
比如：递归代码：

```javascript 
function A(a) {
    if (a === 2) {
        return;
    }

    a = a + 1;
    return A(a);
}

// 执行
A(0);
```

```
Execution Context 会层层堆叠，直到return再层层撤销
呼叫方叫 Caller， 被呼叫方叫 Callee

                                       [[A(2)]] <-- 到这里开始 return;
                          [[A(1)]]     [[A(1)]] 
            [[A(0)]]      [[A(0)]]     [[A(0)]]
[[Stack]]-> [[Stack]] ->  [[Stack]] -> [[Stack]]
```

## Execution Context根据执行代码类型不同而不同

### `Global Code` 全局代码

这些代码是不包含在任何 `function(){}` 里面的。露在最外层的代码.

```javascript
var a = 10; // 暴露在全局

function b() { // 暴露在全局
    var c = 20; // 没有暴露在全局
};

var d = 20; // 暴露在全局
```

```
[EC] = [
    globalContext
]
```

### `Function Code` 函数的代码

```javascript
function foo() {
    var x = 10;
    function bar() {
        var y = 20;
    }
    return bar;
}

var a = foo() // Activation of function.
a() // Activation of function.
```

OK, 承接上文，在全局执行，然后执行到这里的时候，到了`foo()`这句，触发了函数，（不是定义时候，是真正触发的时候），会创建一个新的context。这个context排在第一名。

```javascript
// push in <foo>.context
[EC] = [
    <foo>.context,
    globalContext,
]
```

此时内部函数bar还没触发，所以它的context还没形成。直到下一句：`a()`, 正式触发了 `bar()`的执行，才会创建Context。（此时上方的 foo() 执行完毕，其context已经销毁。

```javascript
// pop out <foo>.context,
[EC] = [
    globalContext
]

// push in <bar>.context,
[EC] = [
    <bar>.context,
    globalContext
]
```

现在来考虑匿名函数直接执行的情况：

```javascript
(function foo(){
    var a = 10;
})(); // 这里进行了触发，activation.

// 触发完毕，销毁上述环境
console.log(a) // undefined
```

```javascript
[EC] = [
    globalContext
]

// 立即触发了函数
[EC] = [
    <foo>.context,
    globalContext
]

// 函数执行结束，弹出context
[EC] = [
    globalContext
]
```

### `Eval() Code` 代码

这个类型比较特殊。它每执行一次有自己的Context（相当于一个小的funciton），但是它的作用结果是影响到 calling context

```javascript
eval("var a = 10;");

console.log(a); // 10

(function foo() {
    eval("var b = 20;")
})();

console.log(b); // ReferenceError: b is not defined

var x = 30;
eval("var y = x;");
console.log(y); // 30
```

```javascript
[EC] = [
    globalContext
]

[EC] = [
    <eval>.context,
    globalContext
]

[EC] = [
    globalContext // And var a = 10 already taken effect.
]

[EC] = [
    <foo>.context,
    globalContext,
]

[EC] = [
    <eval>.context,
    <foo>.context,
    globalContext,
]

[EC] = [
    <foo>.context, // And var b = 20 already taken effect on <foo>.context.
    globalContext,
]

[EC] = [ // foo.context destroyed!
    globalContext,
]
```