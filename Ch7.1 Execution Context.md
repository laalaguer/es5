## 执行上下文 Execution Context

`Execution Context` 就是一种载具。用来承载`运行时`对代码解析时候各个上下文变量。一般是 stack 来实现的。每次`执行`一个函数，就会往栈上推送一个Context，执行完毕再解除。

`所以执行上下文，只存在于执行时候!!！`

比如递归代码：

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


## 环境 Lexical Environment

Environment 环境，是一个Context的组成部分。换句话说，一个Context包含一个环境作为子成员。

```
+---------+
|Context  +--->|Environment|
+---------+
```

环境的组成部分是两部分：一个`Table`保存了变量和值，一个指针指向`父环境`.

```javascript

var x = 10;
var y = 20;

function add (z) {
    var x = 30;
    return x + y + z;
}

add(40);
```

```
JS引擎开始执行，创建Context并联系上一个Env
[Global Execution Context] -> [Global Env]

细看：
[Global].Table = [x:10, y:20, add:Function, 未命名:40]
[Global Env].Parent = null // 最外层没有父亲环境

JS引擎执行函数 add(40)，创建一个Context并创建一个Env
[add() Execution Context] -> [add() Env]

[add()].Table = [z:40, x:30]
[add() Env].Parent = [Global Env] // 一个指针

所以这时候需要寻找 x + y + z, 就直接在Env里面找。结果是：

[add()].Table.x + [Global].Table.y + [add()].Table.z
```

## 环境 Environment 是`何时`被定义的？？？

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

`foo()`里面的 `x` 被称为 `free variable` 自由变量。就是（既不在函数参数列表里面，也不在函数体里定义的，不知道哪里来的变量）。

**按照Javascript约定，Env是在函数`被创建`时候定义的。** 也就是上一小节中的`Parent` 变量。

我们细看执行过程：
```
JS引擎开始执行，创建Context并联系上一个Env
[Global Execution Context] -> [Global Env]

细看：
// 尤其注意，这 Table 是 *执行时* 才创建的。
[Global Env].Table = [x:10, foo:Function, bar:Function]
// *代码写作时* 已经规定为null
[Global Env].Parent = null // 最外层没有父亲环境

JS引擎"创建"函数foo(), 虽然没有执行，但是已经创建，给函数foo装配上环境
[foo() Env] = []
[foo() Env].Parent = Global

JS引擎"创建"函数bar(), 虽然没有执行，但是已经创建，给函数bar装配上环境
[bar() Env] = []
[bar() Env].Parent = Global

JS引擎"执行"函数 bar()，创建一个Context并装配一个Env
[bar() Execution Context] -> [bar() Env]

// 尤其注意，这 Table 是 *执行时* 才创建的。
[bar()].Table = [x:20]
// *代码写作时* 已经规定为 Global
[bar() Env].Parent = [Global Env] // 一个指针

// bar() 函数
执行时候碰上 foo() 执行，该函数的 Enironment 在定义时候已经确定，指向了global x，所以是10
```

再看一个例子：

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

在这里，`b()`的Env在`定义时`被创建完毕，第一顺位是自身的[变量、参数]（称为活动对象），这里就简化了没有。第二顺位是包含它的父环境，就是执行到一半的`a()`函数的活动对象，就是[变量、参数]，包含了 `x = 20`。至于 `a()`函数在定义时候的父环境，指向了 Global， 包含了 `x=10`，这是第三顺位了。