# `this` 对象
刚才已经说过了`this` 和 `arguments` 在函数调用的时候会被活动对象保存下来。

而`this`和 Env 不一样，不是函数`定义时/创建时`就已经快照好的。是唯一一个在执行上下文中，随时变化的活动变量。它的 Scope 是动态的。（和代码定义时候 Static Scope的Env相反）

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



// 很简单，全剧环境被创建 [this, arguments, name, object]
// 走到定义 getName: function() 
// getName 的环境被创建，Lexical法则。很可惜，这里没啥闭包之类的。
// 现在调用的是getName函数，它的活动对象被创建，
// 活动对象里推入 [this, arguments]
// 相当于 getName.call(object)
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

// 程序开始 Global 环境
// Global variables = [name, object, a], 其中 name object 被提升到开头
// name 充值
// object 充值，其中 getName 进行定义，Scope/Env 包含[name], [parent.name]

// a 充值
// getName第一次被运行，需要返回一个函数，有闭包，Lexical法则创建Scope/Env
// 第一个作用域顺位，是它自己的活动对象。
// [this, arguments] 很可惜没什么东西。
// 第二个顺位，是它的包裹父对象 object 和他的子属性 [name]
// 第三个顺位，是再外层的window

// 由于 object.getName() 相当于 getName.call(object)
// 所以上述 this 就是 object
// 但不要忘记了，this是活力活络的，会变化！

// a() 运行
// 创建Scope/Env
// 第一个顺位是，它自己活动对象
// [this, arguments]
// 第二个顺位是，getName的变量对象
// 第三个顺位是，object
// 第四个顺位是，window

// 由于 a() 相当于 a.call(window)
// 所以上述this 相当于 window
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

所以这里的that是 activation object 的一部分是 Env 的一部分，是return function() 时候的闭包快照的一部分。已经不是灵活的 this 执行时候传入的了！

### `=>` 函数 Arrow Function

箭头函数的 `this` 不是动态Scope的，它在调用时候根本没`this`动态传入，它的`this`取材于父环境，也就是父环境的当时候的`this`.

```javascript
var x = 10;

var b = {
    bar: function() {
        return this.x
    }
}

b.bar() // undefined, 在动态呼叫中， this = b, b并没有x，所以undefined
```

```javascript
var x = 10;

var b = {
    bar: () => {
        return this.x
    }
}

b.bar() // 10， 在动态呼叫中，this 取材于父环境，b在执行中的父环境是global环境（应为我们在Global上下文中调用了b.bar()
```

那么我们稍微改一下上面的例子：

```javascript
var name = "My Window"

var object = {
    name: "My Object",
    getName: function() {
        return () => { return this.name }
    }
}

const a = object.getName()
a() // 'My Object'


// object.getName() 执行于Global环境中，
// getName 创建Lexical Env, 很可惜，没啥东西
// 匿名函数创建 Lexical Env, 包含“父环境”，也就是object活动对象
// 箭头函数更改了this行为，让其不从执行环境取值，留空。而是从父执行环境取值
// 此时 object.getName() = getName.call(object)
// this == object
// 所以是 this.name 在 const a = object.getName() 时候傍上了 object
// a() 就变成了 'My Object'

// 可见 () => {} 在第一次执行的时候很重要。第一次执行的 this 将会绑定一生。

// 强制制定 this 为 global
// this在呼叫时候被绑定
const c = object.getName.call(global)
c() // 'My Window'

```
