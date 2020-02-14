# 7 函数

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

## 7.1 递归
略

## 7.2 闭包 Closure

`闭包`的定义：有权访问`另一个函数`作用域里的变量的`函数`。

所以经过这个定义就很明确了！闭包就是函数。一种能够访问别人作用域里面变量的函数。如果作用域，串联成了`作用域链`，就更美妙了！

```javascript
function Outter(name) {
    return function(arg1, arg2) {
        var v1 = arg1[name]
        var v2 = arg2[name]
        return v1 - v2
    }
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
// 这里称为 global variable object

// 读取该代码片段，解析一下，发现了好多 var 申明的变量，提升起来
Function Outter
var name
var inner
var obj1
var obj2

// 执行到 Outter(name) 这句
// 由于是第一次执行Outter，创建一个执行环境，Execution Context
outter-execution-context = [[Scope Chain]]

// 执行环境的Scope Chain第一顺位是一个变量对象，对应本函数, 称为 activation object 活动对象
[[Scope Chain]][0] = [[Activation Object]] = [this, arguments, name] // 变量name也在其中，arguments[0] == name

// 执行环境的Scope Chain第二顺位，因为已经到了最外部，所以是global变量对象
[[Scope Chain]][1] = global

// 所以顺理成章说，如果执行环境里找不到某一个变量，就去第一顺位、第二顺位找。例如name变量第一顺位就能找到，Math变量到第二顺位才能找到，hahahah变量就因为找不到而undefined.

// OK 往下，发现Outter里面返回一个匿名函数，它会进一步把父函数的活动对象，添加到自己的scope里面，导致父函数的某些变量无法被执行环境销毁

inner-execution-context = [[Scope Chain 2]]
[[Scope Chain 2]][0] = [[inner Activation Object]] = [this, arg1, arg2, arguments]
[[Scope Chain 2]][1] = [[Outter Activation Object]]
[[Scope Chain 2]][2] = global
```

### `this` 对象
刚才已经说过了`this` 和 `arguments` 在函数调用的时候会被活动对象保存下来。

现在重新理解一下`this`关键字在实际中的应用。

```javascript
var name = "My Window"

var object = {
    name: "My Object",
    getName: function() {
        return this.name
    }
}

object.getName() // My Object

// 相当于 getName.call(object)

// 很简单，现在调用的是getName函数，它的活动对象创建，
// 活动对象里推入 this 和 arguments
// 因为call的存在，改变 this 重定向到 object
// arguments因为没有，所以维持原状
// object.name成功访问到 My Object字符串


var object2 = {
    name: "2"
}

object.getName.call(object2) // '2'
// 你可以看到 this 没什么忠诚度，用一个call就能重定向
```

如果我们稍微改一下

```javascript
var name = "My Window"

var object = {
    name: "My Object",
    getName: function(){
        return function() {
            return this.name
        }
    }
}

const a = object.getName()
a() // 'My Window'

// getName第一次被运行，创建作用域链
// 第一个作用域顺位，是它自己的活动对象
// [this, arguments]
// 由于 object.getName() 相当于 getName.call(object)
// 所以上述 this 就是 object
// 第二个顺位，是它的包裹对象 object和他的子属性
// [name]
// 第三个顺位，是再外层的window

// a() 运行，穿件作用域链
// 第一个顺位是，它自己活动对象
// [this, arguments]
// 由于 a() 相当于 a.call(window)
// 所以上述this 相当于 window
// 第二个顺位是，getName的变量对象
// 第三个顺位是，object
// 第四个顺位是，window
// 搜索this到第一层就停，这个this是谁？是window

var name = "My Window"

var object = {
    name: "My Object",
    getName: function(){
        var that = this
        return function() {
            return that.name
        }
    }
}

const a = object.getName()
a() // 'My Object'

// getName第一次被运行，创建作用域链
// 第一个作用域顺位，是它自己的活动对象
// [this, arguments, that],
// 由于 object.getName() 相当于 getName.call(object)
// 所以 this = object, 且 that = this = object
// 第二个顺位，是它的包裹对象 object和他的子属性
// [name]
// 第三个顺位，是再外层的window和他的子属性
// [name, object]

// a() 运行，穿件作用域链
// 第一个顺位是，它自己活动对象
// [this, arguments]
// a() 相当于 a.call(window)
// 所以 this = window, 但没用。我们寻求的是 'that.name'
// 第二个顺位是，getName的变量对象
// [that]
// 第三个顺位是，object
// 第四个顺位是，window

// 搜索that到第二层就停，这个that是谁？是object
```