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

### `constructor`和类型识别

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
