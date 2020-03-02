# [[Scope]] 和 Scope Chain 作用域链

```javascript
var x = 10;

function func() {
    console.log(x);
}

func();
```

就着上面这段代码复习一下。之前的 `Executions Context` 和 `Variable/Activation Object` 概念。

``` javascript
[EC] = [] 
// 进入环境创建 [Global Context]
[EC] = [
    [Global Context]
]
// [Global Context] 关联上 [Global Variable Object] (Global VO)
[Global VO] = [Math, String, ...]
[Global Context].VO = [Global VO]
// 持续执行, 把变量申明、方法申明，逐个加入VO
[Global VO] = [Math, String, ..., x, func]

// 碰上 func 函数执行，创建 [func Context]
[EC] = [
    [func Context], // 放在上面
    [Global Context] // 第二顺位
]
// [func Context] 关联上 [func Activation Object] (func AO)
[func AO] == [func VO]
// 填充 AO
[func AO] == [func VO] == [arguments, <内部无变量申明>, <内部无方法申明>]
// ...继续执行函数
```

看到这里你就发现了 `x` 变量不存在于 `func` 的 AO 上，那么`x` 究竟是谁呢？`x` 被称为 `Free Variable` 自由变量。（既不在函数参数列表里面，也不在函数体里定义的，不知道哪里来的变量）

为了解决这个问题，这里要引入 `Scope Chain` 概念。

## 函数创建时：Function Creation - Lexical Environment - [[Scope]]

在**创建/定义** `func` 的时候，会对它周围的环境执行一次快照。该快照包含了这个函数的 `所有父环境` 对应的 VO/AO 变量对象。

```javascript
[[Scope]] = [
    parent.AO,
    parent.parent.VO,
    ...,
    global,
]
```

把这个对象放置在函数的 `[[Scope]]` 属性上。

下面举例说明。

```javascript
var x = 10;

function func() {
    console.log(x);
}

func();
```

`func` 定义时候，它直接在 `Global Context` 执行. 所以它的 `[[Scope]]` 如下：

```javascript
func.[[Scope]] = [
    [Global VO]
]
```

## 函数运行时：Function Call - Scope Chain
在函数运行的时候（被呼叫，被触发，被激活），会对应创建一个临时的 Scope Chain， 下面简称 Scope. 它的组成由两部分组成：当前函数的 AO｜VO， 以及函数自身的 `[[Scope]]`.

```javascript
Scope = VO|AO + func.[[scope]]
```
在进行变量查找的时候，按照先在自身的AO里找，找不到？再去`[[Scope]]`找。

**这里可以看到一个明显的矛盾！**

``func.[[Scope]]`` 是 `静态的`, 也就是称为 `Lexcial Environement`, 它是在函数创建/定义的时候就确定的。

``Scope`` 是`半动态`的，因为它的另一部分是当前函数被呼叫时候的 `VO|AO` 决定的。

再来看代码：

```javascript
var x = 10;

function func() {
    console.log(x);
}

func();
```

在执行的时候

```javascript
// 定义 func，形成 [[Scope]]
func.[[Scope]] = [
    [Global VO]
]

// 呼叫 func()
Scope = VO|AO + func.[[Scope]] = [
    [arguments<空的>],
    [Global VO]
]

// 查找 x, 自上往下，成功查找到Global里的变量。
```

## 举例一：

```javascript
var x = 10;
  
function foo() {
  
  var y = 20;
  
  function bar() {
    var z = 30;
    console.log(x +  y + z);
  }
  
  bar();
}
  
foo(); // 60
```

``` javascript
// foo 被定义瞬间，由于定义在全局，全部父对象 VO 就是 Global了
foo.[[Scope]] = [
    [Global VO] // {x:10, foo:Function}
]
// 填充 foo自身的 AO｜VO
foo.VO = foo.AO // {y:20, bar:Function}
// 形成变量查找路径 Scope
[foo Scope] = [
    foo.VO, // {y:20, bar:Function}
    foo.[[Scope]] // [ {x:10, foo:Function} ]
]

// bar 被定义瞬间
bar.[[Scope]] = [
    foo.AO, // {y:20, bar:Function}
    [Global VO] // {x:10, foo:Function}
]
// bar() 被执行瞬间
bar.VO = bar.AO // {z:30}
[bar Scope] = [
    bar.VO, // {z:30}
    bar.[[Scope]] // [{y:20, bar:Function}, {x:10, foo:Function}]
]

// 顺利查找 x, y, z 三个变量
```

## 举例二：

```javascript
var x = 10;
 
function foo() {
  console.log(x);
}
 
(function () {
  var x = 20;
  foo(); // 10, not 20
})();
```

```javascript
Global.VO = {x:10, foo:Function}
// foo函数被定义
foo.[[Scope]] = [
    Global.VO
]
// 匿名函数被定义
func.[[Scope]] = [
    Global.VO
]
// 匿名函数被执行
func.Scope = func.AO + func.[[Scope]] = [
    {x:20},
    [{x:10, foo:Function}]
]
// 引发foo执行 成功找到 x = 10
foo.Scope = [
    foo.AO,
    foo.[[Scope]]
] = [
    <arguments>,
    [{x:10, foo:Function}]
]
```

## 举例三
```javascript
var x = 10;
var y = 20;

function add(z) {
    var x = 30;
    return x + y + z;
}

add(40); // 90
```

```javascript
Global.VO = {x:10, y:20, add:Function}
// add 定义
add.[[Scope]] = [
    Global.VO
]
/// add 执行
add.Scope = [
    add.VO, // {z:40, x:30}
    add.[[Scope]] // Global.VO = {x:10, y:20, add:Function}
]
// x + y + z = 30 + 20 + 40 = 90
```

## 举例四

```javascript
var x = 10;

function foo() {
    console.log(x);
}

function bar() {
    var x = 20;
    foo();
}

bar(); // 10
```

```javascript
Global.VO = {x:10, foo:Function, bar:Function}
// foo定义时
foo.[[Scope]] = [
    Global.VO
]

// bar定义时
bar.[[Scope]] = [
    Global.VO
]

// bar() 运行时
bar.Scope = bar.AO + bar.[[Scope]] = [
    {x:20},
    {x:10, foo:Function, bar:Function}
]

// foo() 运行时
foo.Scope = foo.AO + foo.[[Scope]] = [
    [],
    {x:10, foo:Function, bar:Function}
]
// 成功找到 x = 10
```

## 举例五
```javascript
var x = 10;

function a() {
    var x = 20;
    function b() {
        console.log('x', x);
    }

    return b
}

var c = a()
c(); // x 20
```

```javascript
Global.VO = {x:10, a:Function, c:Function}
// a被定义时候
a.[[Scope]] = [
    Global.VO
]
// var c = a() a被执行的时候
a.Scope = [
    a.VO, // {x:20, b:Function}
    a.[[Scope]] // {x:10, a:Function, c:Function}
]
// b被定义的时候
b.[[Scope]] = [
    a.VO, // {x:20, b:Function}
    Global.VO // {x:10, a:Function, c:Function}
]
// c() --> 相当于b被执行
b.Scope = [
    b.VO, // []
    b.[[Scope]]
]
// 顺势查找，x不在VO，在第一次层 a.VO 找到 = 20
```
