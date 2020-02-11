# 6.3
原型链/经典继承/组合继承

## 原型链 (很少单独使用)

```javascript
// Constructor
function Father () {
    this.familyName = 'Snow'
}

// Add a function to the prototype object
Father.prototype.sayFamilyName = function () {
    console.log(this.familyName)
}

// Consturctor
function Son () {
    this.name = 'Jon'
}

// Inheritance 关键的关键，用新建对象来实现继承
Son.prototype = new Father();

Son.prototype.sayName = function () {
    console.log(this.name)
}

// Instanciate
var boy = new Son()
boy.sayName() // Jon
boy.sayFamilyName() // Snow

Object.keys(boy) // [ 'name' ]
Object.keys(Object.getPrototypeOf(boy)) // [ 'familyName', 'sayName' ]

Object.keys(Object.getPrototypeOf(Object.getPrototypeOf(boy))) // [ 'sayFamilyName' ]

// 应该是一个这么的图

boy = {
    name: 'Jon'
    [[prototype]]: {
        familyName: 'Snow',
        sayName: [Function],
        [[prototype]]: {
            sayFamilyName: [Function]
        }
    }
}

boy instanceof Son // true
boy instanceof Father // true
boy instanceof Object // true
```

`原型链`的一个问题是：同为一个子类的两个独立对象，可能因为父类的缘故，莫名**修改了同一份引用类型**的数据 造成灾难性后果。

```javascript
function Father () {
    this.cards = ['A', 'B', 'C'] // 注意，这是一个引用类型
}

function Son () {}
Son.prototype = new Father()

var s1 = new Son()
s1.cards // [ 'A', 'B', 'C' ]

var s2 = new Son()
s2.cards // [ 'A', 'B', 'C' ]

s1.cards.push('D')
s1.cards // [ 'A', 'B', 'C', 'D']
s2.cards // [ 'A', 'B', 'C', 'D'] 同样也被修改了
```

`原型链`的另外一个问题是：如果父类需要参数来进行初始化，但子类无法传递，则傻眼。

```javascript
function Father(familyName) {
    this.familyName = familyName
}

function Son(name) {
    this.name = name
}

Son.prototype = new Father(???) // 傻眼，无法在这时候传递参数，因为一经传递，就永久固化在了链里
```

## 借用构造函数 Constructor Stealing（经典继承，很少单独使用）
这个比较符合普通的面向对象的逻辑，就是在子类的构造函数中呼叫一次父类的构造函数，以此来初始化相应的变量。**这样就可以向父类传递参数了！**

```javascript
function Father(familyName) {
    this.familyName = familyName
}

function Son(familyName, name) {
    Father.call(this, familyName) // 在当前对象上呼叫Father函数
    this.name = name
}

var s = new Son('cage', 'nicolas')
s.name // nicolas
s.familyName // cage
```
`借用构造函数`的好处：
- 自己的参数自己管，不会和他人共享
- 可以向父类传递参数

`借用构造函数`的问题一：主要是`原型链`被打破的问题:

```javascript
s instanceof Father // false
s instanceof Son // true
```

问题二：继承来的方法，每个对象上都有一份copy，没有复用

```javascript
function Father(familyName) {
    this.familyName = familyName
    this.say =  function () { console.log(this.familyName) }
}

function Son(familyName, name) {
    Father.call(this, familyName) // 在当前对象上呼叫Father函数
    this.name = name
}

var s1 = new Son('cage', 'nicolas')
var s2 = new Son('cage', 'nicolas')

s1.say == s2.say // false, 每个子实例的say都是新函数
```

问题三：父类的函数的**原型方法**都无法使用。

```javascript
function Father() {}
Father.prototype.say = function() {
    console.log('Hi')
}

function Son() {
    Father.call(this)
}

var s = new Son()
s.say // undefined. 无法使用父类的原型上的方法
```

## 组合继承 combination （伪经典继承 最常用）
即采用`原型链`又采用`经典继承`的，两者结合的手法。

`原型链`继承公用方法，`经典继承`初始化自身成员参数，岂不美哉。

```javascript
// 私有属性，每个实例各自初始化
function Father(familyName) {
    this.familyName = familyName
}

// 公用方法，放入prototype供大家使用
Father.prototype.getFamily = function () {
    return this.familyName
}

function Son(familyName, name) {
    Father.call(this, familyName) // 重点：经典继承初始化参数
    this.name = name
}

// 重点：原型链继承获得方法
Son.prototype = new Father(); // 注意，没传参数，所以会让内部familyName = undefined

// 自己这层的公用方法
Son.prototype.getName = function() {
    return this.name;
}

var s = new Son('cage', 'nicolas')

// 其实s是这样的
s = {
    familyName: 'cage',
    name: 'nicolas',
    [[prototype]]: {
        familyName: undefined,
        [[prototype]]: {
            getFamily: [Function]
        },
        getName: [Function]
    }
}
```

优点：
- 每份`Son`类型的实例，都包含自身的`FamilyName`和`Name`属性
- 每份`instanceof` 操作符能顺利识别对象类别
- 尤其注意原型部分采用了`无参数`的创建方式。

## 原型式继承 （Crockford提出）
应用场景：当简单基于一个`现有对象`进行某种扩展的时候，采用快速的原型继承。相当于进行了一次浅复制。

```javascript
function replica(o) {
    Function f() {}
    f.prototype = o // 简单地把对象放到原型上
    return new f()
}

var person = {
    name: 'nicolas'
    numbers: [1, 2, 3]
}

var p1 = replica(person)
p1.name == p1.__proto__.name // true
p1.numbers == p1.__proto__.numbers // true
```

注意点：
- 没有对`父类`的第一次`new`初始化，可能在上下文中也没有`父类`供给你初始化, 仅仅有一个简单的`父对象实例`让你从中派生。
- 所有的新建实例都公用了一个原型对象。（尤其要注意）
- `Object.create(object)`是替代`replica`函数的规范用语。

## 寄生式继承 Parasitic（Crockford提出）
常用在，你有一个对象，你又想轻量级扩展这个对象。

```javascript
var a = [1,2,3]

function extend(object) {
    var private = Object.create(object) // 相当于replica
    private.toString = function () { // 增强该对象
        let rtrn = []
        for (item of private) {
            rtrn.push(item)
            rtrn.push('.')
        }
        return rtrn.join()
    }
    return private
}

var b = extend(a)
b.toString() // '1,.,2,.,3,.' 方法被遮蔽
```


## 寄生组合式继承
略