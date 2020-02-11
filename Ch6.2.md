# 6.2
对象的创建方式，一共两种。

## 构造函数模式
这个方法，是Javascript一种特殊的创建形式，通过一个函数来初始化一个对象。
```javascript
function Person() {
    this.name = 'nicolas'
    this.age = 18
    this.sayHi = function () {
        console.log(this.name)
    }
}

var p = new Person()
console.log(p)
```
初始化的过程尤其值得注意：

- `new` 关键字，表明需要创建一个对象。
- 解释器代我们创建一个空对象。
- 解释器应用 `Person()` 函数，作用于这个空对象。（此时`this`指向了刚创建的空对象），并执行函数内部的代码。
- 返回经过初始化的对象。

我们也可以复杂一点，掺合一点`6.1`所学的知识，将属性的`attributes` 设置一下：

```javascript
function Person() {
    this.name = 'nicolas'
    this.age = 18
    this.sayHi = function () {
        console.log(this.name)
    }

    Object.freeze(this) // freeze the object.
}

var p = new Person()
console.log(p)

p.name = 'tom' // can't do this.
console.log(p) // Person { name: 'nicolas', age: 18, sayHi: [Function] }
```

### 更改作用域

有一个奇技淫巧，就是你可以使用 `Function.call()` 函数来指定构造函数作用于哪个对象之上，让那个对象也被构造函数初始化一遍。这时候构造函数内部的`this`就作用在了被指定的对象上。

```javascript
function Person(age) {
    this.name = 'nicolas'
    this.age = age
    this.sayHi = function () {
        console.log(this.name)
    }
}

var p = {
    hobby: 'skiing'
}
console.log(p)

Person.call(p, 18)
console.log(p) // { hobby: 'skiing', name: 'nicolas', age: 18, sayHi: [Function] }
```

### 缺点：函数不重用

应用构造函数，创造出来的多个对象，它们的方法都是不互通的。是多份独立的拷贝。这些方法很浪费空间。

```javascript
function Person(age) {
    this.name = 'nicolas'
    this.age = age
    this.sayHi = function () {
        console.log(this.name)
    }
}

var p1 = new Person(18)
var p2 = new Person(18)

console.log(p1.sayHi == p2.sayHi) // false
```

### 优点：`constructor`和类型识别

`instanceof` 关键字用来反馈实例和类型之间的关联, 合理怀疑，正是通过被创建的实例的`constructor`属性来得出结论的。这个属性的 `enumerable = false` 所以你平时在命令上不能枚举出来它。

```javascript
function Person(age) {
    this.name = 'nicolas'
    this.age = age
    this.sayHi = function () {
        console.log(this.name)
    }
}

var p = new Person(18)
console.log(p.constructor == Person) // true
console.log(p instanceof Person) // true
```

## 原型模式

在`Function`对象上，其实包含一个`prototype`指针，指向`原型对象`。该原型对象包含了一组属性和方法，可以被所有该`Function`实例化的对象所引用。

```javascript
Person = function() {} // Person是一个函数

Person.prototype = { // 函数具有prototype指针
    name: 'default name',
    age: 18,
    say: function() {
        console.log(this.name)
    }
}

var p = new Person() // 创建一个实例！
p.say() // default name
p.name = 'nicolas' // 遮蔽了原型重的值，是实例的值
p.say() // john
```

奇怪的是，当你创建的对象没有“重写“ `prototype`属性的时候，它自动获得了一个`constructor`属性，指向该函数本身。

```javascript
Person = function() {} // Person是一个函数

Person.prototype.consctuctor // Person函数

//你指定完了以后就变成了Object函数
Person.prototype = {
    name: 'default name',
    age: 18,
    say: function() {
        console.log(this.name)
    }
}

Person.prototype.constructor // Object函数

Object.getOwnPropertyDescriptor(Person, 'prototype')
{ value: { name: 'default name', age: 18, say: [Function: say] },
  writable: true,
  enumerable: false,
  configurable: false }
```

### Function, Prototype, Instance的关系 `Object.getPrototypeOf`
可以用下面来表示：
```javascript
Function.prototype = [[Prototype]]

var instance = new Function()
instance.[[protoptype]] = [[Prototype]]

// 这里尤其说明的是，instance上面大部分JS环境实现都没有直接访问prototype的办法。
// 只能通过如下方法访问：
var pPrototype= Object.getPrototypeOf(instance)
// 但是这样你就能改原型了，真危险啊！
// 也可以应用上一章节所学的知识，冻结这个对象
Object.freeze(pPrototype)

// 测试Prototype的归属
pPrototype.isPrototypeOf(instance) // true
```

### `Object.hasOwnProperty()` 测试
无论何时，调用该方法能够清楚地知道被测试的值，是实例的还是原型的。
```javascript
Person = function() {
    name: 'default name'
}

var p = new Person()
p.hasOwnProperty('name') // false

p.name = 'john'
p.hasOwnProperty('name') // true
```