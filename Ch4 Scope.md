# 4 作用范围 类型区分
变量、作用范围、内存问题

复习一下, Javascript 包含了5个`基本类型`是：

```javascript
Undefined
Null

Boolean
String // 基本类型，不是引用哦！
Number
```
其余的类型都是`引用类型`，它们的具体表现形式就是`对象`.

## 4.1 基本类型引用类型的区别

**基本类型，复制的话是拷贝值；引用类型，复制的话是拷贝引用**

```javascript
a = 1
b = a // b仅仅获得了一份1的拷贝，b和a互相各自是独立个体

b = 2
console.log(a) // 1
```

```javascript
a = {x:1}
b = a // b和a同时指向内存中同一个对象

b.y = 2
console.log(a) // { x: 1, y: 2 }
```

**函数参数传递是“复制拷贝”；基本类型，则直接拷贝值；引用类型，则拷贝的是引用地址本身**

```javascript
a = 1

function change(b) {
    b = 10
    console.log(b)
}

change(a) // 10
console.log(a) // 1
```

```javascript
a = {}

function change(b) {
    b.name = "Tom"
    console.log(b)
    return b
}

c = change(a) // { name: 'Tom' }
console.log(a) // { name: 'Tom' }
console.log( c === a ) // true 绝对相等，引用的是同一个对象
```

**`typeof` 和 `instanceof` 检测的区别**

`typeof`是对基本类型检测非常有用。但是对于对象/null，只能检测出`object`.

`a instanceof constructor` 能够通过对构造函数的分辨检测出具体的对象类型。

```javascript
a = {}
a instanceof Object // true
a instanceof Array // false
a instanceof RegExp // false
```

# 4.2 执行环境和作用域

## 4.2.1 执行环境
- 执行环境 `execution context`
- 作用域链 `scope chain`

代码执行流，从开始执行，到碰到函数，进入函数，再到进入函数调用的函数。类似金字塔一样，不断往上走。每一层都有一个自己的执行环境。这些执行环境堆起来，形成栈。上层的函数执行完毕，就销毁一个对应的执行环境。

在堆叠的执行环境中，寻找一个变量，从里到外开始找。本地环境找不到，去父的环境里找，找不到，再去祖父的环境里找，直到找到最外层。在浏览器里是`window`环境。再找不到就报错了！

## 4.2.2 没有块级作用域和变量提升

花括号并不能和C/C++/Java一样形成封闭的`作用域`。这里 `c` 变量被提升了到了父环境：全局环境中。
```javascript
if (true) {
    var c = 10
}

console.log(c) // 10

// 通过 var c 变为 let c 让变量提升情况消失

for (var i = 0; i < 10; i++) {
    ;
}

console.log(i) // 10

// 通过 var i 变为 let i 让变量提升情况消失
```

