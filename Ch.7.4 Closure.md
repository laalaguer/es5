# 7.2 执行核心

先看一个简单的函数和执行：
```javascript
function compare(a, b) {
    if (a > b) {
        return 1
    }
    if (a < b) {
        return -1
    }
    return 0
}

compare(1,3)
```

`compare(1,3)`执行时候先创建了一个活动对象 `activation object` 

包含了自身的一些东西：`{arguments: [1,3], a:1, b:3} 和 this`, 

这相当于自身环境Env中的 Record Table. 自身环境还有一个变量parent，指向父环境，（在我们例子中是 Global) 里面arguments取决于启动global时候的传入参数，但是可遇见的是包含一个 `compare:Function`的变量。

## 7.2 闭包 Closure

`闭包`的定义：一个函数在被定义时，快照了周围`环境`。

所以经过这个定义就很明确了！`闭包就是函数`。一种能够访问别人作用域里面变量的函数。（通常就是函数里申明的子函数）

```javascript
function Outter(name) {
    function Inner(arg1, arg2) {
        var v1 = arg1[name]
        var v2 = arg2[name]
        return v1 - v2
    }

    return Inner
}

var name = 'abc'
var inner = Outter(name)

var obj1 = {abc: 10}
var obj2 = {abc: 20}
inner(a, b)
```

JS引擎执行过程如下：

```javascript
// 初始化JS引擎，创建: 全局对象 global
global = { window, Math, JSON, etc... }
// 这里称为 global variable Table

// 读取该代码片段，解析一下，发现了好多 var 申明的变量，提升起来
Function Outter
var name
var inner
var obj1
var obj2

// 执行到 Outter(name) 这句
// 由于是第一次执行Outter，创建一个执行环境，Outter Execution Context
// 并为它关联一个 Scope / Env
[Outter Execution Context] -> [[Scope/Env]]

// 执行环境的Scope/Env 第一顺位是一个变量Table 称为 activation object 活动对象
[[Scope/Env]][0] = [[Activation Object]] = [this, arguments, name] // 变量name也在其中，arguments[0] == name

// 执行环境的Scope/Env 第二顺位，是Env的父Env 所以是global变量Table
[[Scope/Env]][1] = global

// 所以顺理成章说，如果执行环境里找不到某一个变量，就去第一顺位、第二顺位找。例如name变量第一顺位就能找到，Math变量到第二顺位才能找到，hahahah变量就因为找不到而undefined.

// OK 往下，发现Outter里面返回一个匿名函数，它会进一步把父函数的活动对象，添加到自己的scope里面，导致父函数的某些变量无法被执行环境销毁

[Inner Execution Context] = [[Scope/Env 2]]
// 第一顺位永远是自己的活动对象
[[Scope/Env 2]][0] = [[Inner Activation Object]] = [this, arguments, arg1, arg2]
// 第二顺位是父环境，定义时候的 Outter 内部活动对象
[[Scope/Env 2]][1] = [[Outter Activation Object]] = [this, arguments, name]
// 第三顺位是 Outter，定义时候的 Parent 环境对象
[[Scope/Env 2]][2] = global
```
