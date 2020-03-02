# 6.1 对象和对象属性
对象和对象每个属性的情况，包含数据/访问器

```javascript
a = {
    name: "Tom",
    age: 18,
    callMe: function() {
        return this.name // this 关键字
    }
}

a.callMe() // Tom
```

# 6.1 数据属性和访问器属性

两个概念要特别明确：

- `attribute` 是用来描述 `property`的特征的
- 对象的子元素，就叫`property`属性
- `attribute` 的中文，叫特性（特征）
- `attribute` 仅仅在JS引擎内部使用

## 数据属性

用来描述`数据`属性的四种特征。

`[[Configurable]]` 三个含义
- 能否`delete`关键字删除该属性 `a = {x:1}`, `delete a.x;`
- 能否修改该数据属性的其他`attribute`
- 能否把属性修改为`访问器`

`[[Enumerable]]`
- 在 for-in 循环中能否列出该属性的名字。

`[[Writable]]`
- 能否修改这个属性的内含的值。

`[[Value]]`
- 这个数据属性真正保存值的地方。任何修改都体现在这个地方。

```javascript
var person = {}
Object.defineProperty(person, 'name', {
    configurable: true, // default: false
    enumerable: true, // default: false
    writeable: true, // default: false
    value: 'Tom' // default: undefined
})
```

**一旦configurable设为false,则除了writeable以外其他都不能改,其实也就是configurable和enumerable不能改而已，但是delete不再起作用**

## 访问器属性

访问器不包含`数据`本身。

`[[Configurable]]` 三个含义
- 能否`delete`关键字删除该属性 `a = {x:1}`, `delete a.x;`
- 能否修改该数据属性的其他`attribute`
- 能否把属性修改为`数据`

`[[Enumerable]]`
- 在 for-in 循环中能否列出该属性的名字。

`[[Get]]`
- 写入数据时候的函数

`[[Set]]`
- 读取数据时候的函数


```javascript
var person = {
    _age: 18,
    name: "nicolas"
}

Object.defineProperty(person, 'age', {
    configurable: false,
    enumerable: true,
    get: function() {
        return this._age
    },
    set: function(value) {
        if (value > this._age) {
            this._age = value // _age 的 [[writable]] 会对这个造成影响
        }
    }
})

person.age = 19
```

```javascript
var person = {}
Object.defineProperties(person, {
    name: {
        enumerable: true,
        value: 'nicolas'
    },
    _age: {
        enumerable: false,
        value: 18
    },
    age: {
        get: function(){
            return this._age
        },
        set: function(value){
            if (value > this._age) {
                this._age = value // _age 的 [[writable]] 会对这个造成影响
            }
        }
    }
})
```

## 读取对象的属性的特征

`Object.getOwnPropertyDescriptor(object, 'name')`来读取某一个属性的特征

```javascript
var person = {}
Object.defineProperties(person, {
    name: {
        enumerable: true,
        value: 'nicolas'
    },
    _age: {
        enumerable: true,
        value: 18
    },
    age: {
        enumerable: true,
        get: function(){
            return this._age
        },
        set: function(value){
            if (value > this._age) {
                this._age = value // _age 的 [[writable]] 会对这个造成影响
            }
        }
    }
})

function displayDescriptors(object) {
    for (let propName in object) {
        console.log(propName, Object.getOwnPropertyDescriptor(object, propName))
    }
}

displayDescriptors(person)
// which displays:
name { value: 'nicolas',
  writable: false,
  enumerable: true,
  configurable: false }
_age { value: 18,
  writable: false,
  enumerable: true,
  configurable: false }
age { get: [Function: get],
  set: [Function: set],
  enumerable: true,
  configurable: false }

```

## 如何防止对象被篡改

一共三个等级的防护，且逐步升级，一旦设置了防篡改，则不可撤销。

### `Object.preventExtensions(object)` 防扩展

等级一：不可以再往对象里添加新的成员属性。

```javascript
var person = { name: 'nicolas' }
Object.preventExtensions(person)

person.age = 10 // can't add to it.
console.log(person) // {name:'nicolas'}

delete person.name
console.log(person) // {}

Object.isExtensible(person) // false
```

### `Object.seal(object)` 密封

等级二：包含了等级一的不可扩展，另外`configurable`设置为`false`, 不能删除属性。

```javascript
var person = { name: 'nicolas' }
Object.seal(person)

person.age = 10 // can't add to it.
console.log(person) // {name:'nicolas'}

delete person.name
console.log(person) // {name: 'nicolas'}

person.name = 'tom' // but can still modify the property name.
console.log(person) // {name: 'tom'}

Object.isExtensible(person) // false
Object.isSealed(person) // true
```

### `Object.freeze(object)` 冻结

等级三：包含了二等级，另外`writable`设置为`false`，不能修改属性的值。除非是访问器，且设置了`get`方法。

```javascript
var person = { name: 'nicolas' }
Object.freeze(person)

person.age = 10 // can't add property.
console.log(person) // {name:'nicolas'}

delete person.name // can't delete property.
console.log(person) // {name: 'nicolas'}

person.name = 'tom' // can't modify the value of property.
console.log(person) // {name: 'nicolas'}

Object.isExtensible(person) // false
Object.isSealed(person) // true
Object.isFrozen(person) // true

Object.defineProperty(person, 'name', {writable: true}) // Error: Cannot redefine property: name 想把它重新设为可写，也没门。
```