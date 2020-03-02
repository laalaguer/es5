# 6.2 构造函数模式、原型模式
对象的创建方式，一共两种基本的:构造函数或者原型。

## 构造函数模式 Constructor Pattern
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

## 原型模式 Prototype Pattern

在`Function`对象上，其实包含一个`prototype`指针，指向`原型对象`。该原型对象包含了一组属性和方法，可以被所有该`Function`实例化的对象所引用。

你可以把全部的属性和方法都放到原型对象里。

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
// prototype 是一个独立的对象，函数有一个明指针，指向该对象
Function.prototype = [[Prototype]]

// Instance具备一个暗藏指针，指向该对象
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

### `in` 操作符
任何属性，只要能够被访问到，都会让这个操作符返回`true`. 不管是不是该对象自身的，还是这个对象的原型对象的。这个操作符就返回属性名字，至于这个属性存储了什么，则需要手动去获得。

```javascript
function Person() {
    this.name = 'nicolas'
    this.age = 18
}

// Modify Prototype object
Person.prototype = {
    height: 190
}

var p = new Person()
p.gender = 'male'
Object.defineProperty(p, 'school', {
    enumerable: false,
    value: 'high school'
})

for (item in p) {
    console.log(item, p[item], p.hasOwnProperty(item))
}

/*
name nicolas true
age 18 true
gender male true
height 190 false // height is not it's own property.
// school is not displayed because it is not enumerable.
*/

Object.keys(p) // 返回所有“可见”的变量名
// [ 'name', 'age', 'gender' ]
Object.getOwnPropertyNames(p) // 返回所有成员，不管可不可见
// [ 'name', 'age', 'gender', 'school' ]
```

### 原型对象被切断
```javascript
function Person() {}
Person.prototype.sayHi = function() {console.log('good')}

var p1 = new Person()
// 切断原型
Person.prototype = {
    sayHi: function() {
        console.log('bad')
    }
}

var p2 = new Person()

p1.sayHi() // good
p2.sayHi() // bad

//此时p1 和 p2 所指向的原型对象就不是《同一个》对象了！

// 除非重新在 prototype 上设立这段关系
Person.prototype.constructor = Person

```

### 构造函数模式+原型模式

构造函数定义“自身”的属性，原型模式定义“通用方法”。这是一种比较常见的创建对象的模式

```javascript
function Person (name, age) {
    this.name = name;
    this.age = age;
}

Person.prototype.sayName = function () {
    console.log(this.name);
}

Person.prototype.increase = function () {
    this.age = this.age + 1;
}

Person.prototype.sayAge = function () {
    console.log(this.age);
}

var p1 = new Person('nicolas', 18)
var p2 = new Person('alice', 20)

p1.sayName() // nicolas
p1.increase()
p1.sayAge() // 19

p2.sayName() // alice
p2.sayAge() // 20
```

### 稳妥构造函数 Durable Object

```javascript

function Person (name, age) {
    //没有对于this的引用
    var o = {}
    o.getName = function () {
        return name
    }
    o.getAge = function () {
        return age
    }

    return o
}

var p = Person('nicolas', 18) // 也没有new关键字
p.getName()
p.getAge()
// 也无法修改p对象的传入的值，和下面《寄生构造函数》鲜明区别：

function Person (name, age) {
    //可以修改name/age的值
    var o = {}
    o.name = name
    o.age = age
    o.getName = function () {
        return this.name
    }
    o.getAge = function () {
        return this.age
    }
    return o // note:1
}

var p = new Person('nicolas', 18) // 有new 关键字
// note:1 构造函数结尾返回了一个对象，该对象代替js环境默认创建的新对象
```


## 结论

可以看出来，这两个基本的方法，`构造函数`模式利于区分对象类型，但是不利于方法的继承。每次方法在对象上重新申明一次。

`原型模式`利于方法继承，但是不利于内部数据，每个对象都被迫会继承元素值。

两者组合容易克服这些缺点。但是又有人发明了更好的继承方式。(往后面看)