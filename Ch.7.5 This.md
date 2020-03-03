# `this` 对象
而 `this` 和 `[[Scope]]` 不一样，不是函数`定义时/创建时`就已经快照好的。是唯一一个在执行上下文中，随时变化的活动变量。它的是动态的，属于 Execution Context。

## 理论基础

`this` 是 `Execution Context` 的一部分，进入Context 执行之初，就被指定.

```javascript
const executionContext = {
    this,
    VO,
}
```

`this` 的值，取决于代码的执行类型。分为两种类型 `Global Code` 和 `Function Code`。

### Global Code

这个情况特别简单，因为是全局，所以 `this == global`。

```javascript
this.a = 10;
console.log(a); // 10

b = 20;
console.log(this.b) // 20

var c = 30;
console.log(this.c) // 30
```

### Function Code
这是复杂的地方，`this` 的值取决于 **你怎么呼叫的代码**。

```javascript
function Foo() {
    console.log(this);
}

// 证明是同一样东西
Foo.prototype.constructor == foo // true

// 虽然是一样东西，但是“怎么”呼叫的产生了天壤之别
Foo(); // global
Foo.prototype.constructor() // Foo {}
```

OK, 铺垫一下知识来让你 3 分钟明白如何分辨。

### 知识储备：`Reference` type
JS的内置类型：`Reference` 类型。可以表示为两部分组成：

```javascript
var xxxReference = {
    base: {to which object it belongs},
    propName: "name of the prop"
}

// 举个例子
var a = 10;

// 试图访问
a;

var aReference = {
    base: global,
    propName: 'a'
}

// 再举个例子
var b = {
    c: function () {}
}

// 试图访问
b.c()

var cReference = {
    base: b,
    propName: 'c'
}
```

`Reference`类型只可以是两种情况：
- `identifier` 标识符
- `property accessor` 属性取值器

标识符已经很熟悉了。就是变量定义、函数定义这种。

```javascript
var a = 10;
function b () {};
// a --> 标识符
// b --> 标识符

a; // 这里 对 a 求值
b(); // 对 b 求值

var aReference = {
    base: global,
    propName: 'a'
}

var bReference = {
    base: global,
    propName: 'b'
}
```

属性取值也很熟悉了。

```javascript
var foo = {
    bar: 10,
    baz: function () {}
}

foo.bar // 属性取值
foo['bar'] // 属性取值
```

OK, 下面这三句话决定了 `this` 在运行时的定义：
- `this` 取决于你如何呼叫的代码
- 如果`()`左侧是一个`Reference`类型，则`this`设定为 `Reference` 类型的 `base`
- 如果左侧不是 `Reference` 类型，则设定为 `null` (严格模式下)，或者设置为 `global`（非严格模式）

### 重新审视例子

```javascript
function foo() {
    console.log(this)
}

foo();
// foo() --> 左侧是 foo 标识符
// fooReference = {
//    base: global,
//    propName: 'foo'
// }
// 所以
// this = global
```

```javascript
var foo = {
  bar: function () {
    return this;
  }
};
 
foo.bar();
// foo.bar() --> 左侧 foo.bar 是属性取值
// foobarReference = {
//    base: foo,
//    propName: 'bar'
// }

// this  = foo

var test = foo.bar
test();

// test() --> 左侧 test 是标识符
// testReference = {
//    base: global,
//    propName: 'test'
// }

// this = global
```

```javascript
(function () {
  console.log(this); // null => global
})();

// (); 的左侧，是一个(function(){})表达式，不是标识符
// this 设置为 null
// 弄到了 global
```

## 重新审视 `this` 在实际中的应用

```javascript
var name = "My Window"

var object = {
    name: "My Object",
    getName: function() {
        return this.name
    }
}

object.getName() // My Object

// object.getName --> 属性取值
// getNameReference = {
//    base: object
// }

// this = object

var object2 = {
    name: "2"
}

object.getName.call(object2) // '2'
// 强制制定了 object2 到 呼叫对象上
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

// const a = object.getName()
// object.getName()
// object.getName --> 属性取值
// getNameReference = {
//    base: object
// }

// this = object, 推入 Context, 
// 运行完毕  object.getName()
// Context 被释放

// a()
// a --> 标识符
// aReference = {
//   base: global
// }

// this = global 推入 Context,
// 执行 function() {
//    return this.name
// }
// 得出结论 My Window

```

我们再改一下

```javascript
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

// const a = object.getName()
// object.getName()
// object.getName --> 属性取值
// getNameReference = {
//    base: object
// }

// this = object, 推入 Context, 
// 运行完毕  object.getName()
// Context 被释放

// ！！！ 但是 var that = this
// that = object
// 这份环境被保存在了 Lexcial Env
// 保存入了自函数的 [[Scope]] 里面

// a()
// a --> 标识符
// aReference = {
//   base: global
// }

// this = global 推入 Context,
// 执行 function() {
//    return that.name
// }

// that 无法在本函数的 VO｜AO中找到
// that 在 [[Scope]] 中找到
// that == object
// that.name == 'My Object'
```

所以这里的that是 `Scope = VO + [[Scope]]` 的一部分，是return function() 时候的闭包快照的一部分。已经不是灵活的 this 执行时候传入的了！

### `=>` 函数 Arrow Function

箭头函数的 `this` 不是动态Scope的，它在调用时候根本没`this`动态传入，它的`this`取材于父环境，也就是父环境的当时候的`this`.

```javascript
var x = 10;

var b = {
    bar: function() {
        return this.x
    }
}

b.bar() // undefined, 

// this = b, b并没有x，所以undefined
```

```javascript
var x = 10;

var b = { // 没有创建新的 Scope
    bar: () => {
        return this.x // 绑定到了 global Scope 上， this == global
    }
}

b.bar() // 10
// ()=>{} 这段代码没有自己的 this，是从父Scope借调的this
// 父Scope的 this 取决于 被调用时候的情况 (还是回到之前的讨论上)
```
稍微改一下

```javascript
var x = 10;
var b = { // does not create a new scope
    bar: () => {
        return this.x
    }
}

var y = { x: 30 }
y.bar = b.bar
y.bar() // 还是 10, 因为 this 已经在代码定义的时候 绑定到了父环境 global ，因为 b = {} 并没有创建 Scope
```

那么我们稍微改一下上面的例子：

```javascript
var name = "My Window"

var object = {
    name: "My Object",
    getName: function() { // 这层有一个 Scope
        return () => { return this.name } // 没有自己的this, this 绑定到了上面这层 Scope 上
    }
}

var a = object.getName() // this == object, this 成功绑上
a() // 'My Object'

// 改一下，把方法传给其他人
var b = object.getName
var c = b() // b --> 标识符 this == global, this 成功绑上
c() // 'My Window'

// 强制制定 this 为 global
const c = object.getName.call(global) // this == global
c() // 'My Window'

```
