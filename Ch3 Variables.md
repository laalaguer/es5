# 3 变量
基本概念和一些坑

# 3.4 数据类型 Data Types

关键词：

- 变量本身是松散的数据结构，什么都能存。
- 基本变量是存简单数据值，`Object` 是存复杂数据结构。
- 所有没有定义的变量都是 `undefined` 值。

```javascript
var a = 10
a = 'abc'
// 变量本身是松散的数据结构，什么都能存
```

```java
Undefined
Null
Boolean
Number
String

Object
// 六个值类型，没有其他类型
```

## `typeof` 进行变量存储的值识别

```javascript
typeof(a)

// 返回 String 类型的值
'undefined' // 未定义或者不存在
'boolean'
'string'
'number'
'object' // 复杂对象或者 null
'function'
```

## `Undefined` 类型

这个类型涵盖的值范围很窄，只有一个: `undefined`。所有初始化却未赋值的，和所有没有申明过的变量, 执行了 `typeof` 操作之后都是 `"undefined"`

## `Null` 类型

这个类型涵盖的范围也很窄，只有一个: `null`。

这个值专门用来表示存储`对象`的变量没有初始化。所以它的 `typeof` 返回的是`object`。同时：**敲黑板划重点**

```javascript
// Undefined 类型派生自 Null 类型, 故而两者 == 相等(值相等，类型是父类-子类关系)

undefined == null // true

// 但是 === 不等（值相等，但是父类和子类类型不同）

undefined === null // false
```

## `Boolean` 类型

这个类型范围也没宽到哪里去，包含两个值 `true` 和 `false`

所有类型的值都可以`转化为`这个类型，调用 `Boolean()` 函数即可，遵循如下规则：**敲黑板划重点**

|           | true          | false     |
|-----------|---------------|-----------|
| String    | 'abc'         | ''        |
| Number    | 非0或Infinity | 0或NaN    |
| Object    | 任何对象      | null      |
| Undefined | 都不行        | undefined |
| Null      | 都不行        | null      |


这个 `Boolean()` 函数隐式地使用在了 `if(a)` 这个条件判断中，非常重要。必须背出来。

## `Number` 类型

这个类型涵盖了众多数值，包含了整数、浮点数、无穷大、最大最小、非数字等等

- `0xab` 16进制
- `1.2` 10进制
- 最大值(浏览器极限) `Number.MAX_VALUE`
- 最小值(浏览器极限) `Number.MIN_VALUE`
- 超过最高的上限，结果保存为 `Infinity`
- 突破最大的下限，结果保存为 `-Infinity`
- `Infinity + Infinity = Infinity`
- `Infinity - Infinity = NaN`
- `Infinity + 1 = Infinity`
- `1 - Infinity = - Infinity`
- `isFinite(a)` 测试<数字>是否是超过了极限, 或者任何可转化为数字的东西是否超过了极限
- **重点** `NaN`是个特殊的值，既不和任何东西相等，也不和自己相等
- **重点** `NaN`是个特殊的值，和其他数字操作在一起也返回`NaN`
- `isNaN(a)` 来测试一个值是否是不能转化为数值的。

### `Number()` 转化规则：针对任何基本值、引用值
**敲黑板重点**
- `true` => 1, `false` => 0
- `null` => 0
- `undefined` => `NaN`

字符串呢？
- `'012'` => 12
- `'012.12'` => 12.12
- `'0xff'` => 255
- `'1.8e+308'` => `Infinity` 超过上限
- `''` => 0
- 无法分辨的 => `NaN`

对象呢？
- `Object` => 现调用 `valueOf()` 如果返回值转化为 `NaN`，则 `toString()` 再次转化，应用上述字符串规则。

### `parseInt()` 转化规则：仅仅针对字符串

更安全地转化字符串为数字，`parseInt('123', 10)` 用字符串+进制来进行转换。

- 首先去掉开头的 `\t` `\n` `空格`
- 逐个读入字符，无法转化的就转化为 `NaN`
- 逐个读入，能转化的转化为数字
- 直到不能转化的字为止

### `parseFloat()` 转化规则：仅仅针对字符串

只能转化10进制，也会忽略不能解释的字符。和`parseInt`差不多。

## `String` 类型

一个`单位`占据 `16位bit`表示一个`Unicode`，多个单位在一起形成`String`. 也就是说这一个单位16位，能够表示常用的汉字了！

```javascript
'\u03a3' // 只表示一个单字符
'\xab' // 只表示一个字符
'Hello\u03a3' // 6个字符
'中文' // 2个字符
'\u4e2d\u6587' // 中文， 2个字符
```

### `.toString` / `String()`方法转化
```javascript
Number.toString()
Number.toString(10)
Number.toString(16)
Number.toString(2)

Boolean.toString()
String.toString()

String(null) // 没有 toString(), 只能这么转
String(undefined) // 没有 toString(), 只能这么转
```

## `Object` 类型

第五章会详细讲。这里简介:

```javascript
var a = new Object()
var a = {}
```

```javascript
a.constructor // 对构造函数的引用
a.hasOwnProperty('name') // 检查是否实例拥有该属性，而不是原型上有
a.isPrototypeOf(b) // 检查a是否是object b的原型
a.propertyIsEnumerable('name') // 检查for-in对该属性是否生效
a.toString()
a.valueOf()
```

详见第五章

# 3.5 操作符
挑一点有意思的来说明

## “自”操作符
### `++` / `--` 操作符

```javascript
a ++
a --
```

如果`a`不是数字，应用前面说的 `Number(a)` 进行转化后执行加减操作。

### `+/-` 操作符

```javascript
+a
-a
```

如果`a`不是数字，应用前面说的 `Number(a)` 进行转化后执行加减操作。

## “位”操作符
Javascript 所有的数字都是`32bit`位，无符号整数采取31位表示数字，第32位表示 0正/1负，按位操作就是直接操作。

**正整数表示为二进制，负数是“绝对值的二进制，反转，再+1”表示的补码。**

### `NOT` 操作符 `~`

实际效果就是变成负数，再-1
```javascript
a = 25
b = ~a // -26

a = -25
b = ~a // 24
```

### `AND` 操作符 `&`
### `OR` 操作符 `|`
### `XOR` 操作符 `^`
这个可以很容易测试两个数字是否相等，相等则结果为0
### `<<` 左移
乘以2，符号保留

```javascript
a = 1
a << 1 // 2
a << 2 // 4
a << 3 // 8
a << 32 // 1

a = 1.1 // 结果是，先转化为了1

a = -1 
a << 1 // -2
a << 2 // -4
a << 3 // -8
a << 32 // -1
```

### `>>` 右移
除以2，符号保留
```javascript
a = 1
a >> 1 // 0
a >> 2 // 0
a >> 32 // 1
```

### `>>>` 无符号右移
如果是正数，则没有任何影响。
如果是负数，则因为开头的1表示的负数，且存的是补码，会被误认为是正数，再开头添加0移动。会是一个非常大的数字。

```javascript
a = -1
a >>> 1 // 2147483647

a = 10
a >>> 1 // 5
```

## 布尔操作符
和上面讲的一样，先要把值经过`Boolean(a)`转化才行。

### `!`取反
没什么好讲的，注意`Boolean()`的起的后台转化作用。

### `&&` 逻辑和
**划黑板敲重点**
```javascript
a && b
// a = {} (对象) 则直接返回b, 因为a总是Boolean({}) = true
// b = {} (对象) 则只有Boolean(a) = true 时候返回b对象
// a 或 b = null, undefined, NaN, 直接返回 null, undefined, NaN

var backup = {x:10}
var found = true
var value = found && backup // value = {x:10}

var backup = {x:10}
var found = false
var value = found && {x:10} // value = false
```

这么死记硬背太差了。其实就是这样一个事实：
- `&&` 符号可以连续evaluate: `a && b && c && d`
- 这个表达式返回一个值
- 逐一对表达式内`a/b/c/d`作`Boolean()`操作
- **任一操作下来是`false`则当场停在那里，返回该值原来的值**
- 全部操作下来都是`true`则**返回最后一个值 `d`**

**返回最后一个值**特性挺重要，利用这个特性，做检查一条龙：

```javascript
function getUpperName(user) {
    // 过滤 user = undefined or null or NaN
    // 过滤 user.name = undefined or null or NaN
    return user && user.name && user.name.toUpperCase()
}
```

或者做一个用户登陆检查：
```javascript
userLoggedIn && greet() // 只有userLoogedIn = true, greet() 操作才会执行
```


### `||` 逻辑或
**划黑板敲重点**

```javascript
a || b
```

不要死记硬背，这么记：
- 这个表达式也可以连缀 `a || b || c || d`
- 这个表达式返回一个值
- 逐一进行 `Boolean()` 操作
- 遇上一个能求得 `true` 的就停下，返回该值本身
- 如果所有都检查了都没有产生 `true`，则返回最后一个值本身

**返回最后一个值**特性挺重要，利用这个特性，做缺省的值填充：
```javascript
var backup = 1
var value = getFromConfigFile() || backup
```

## 加性操作符

### `+/-` 符号
```javascript
a + b 

1 + 1 //数字相加，没问题

1 + '1' // '11' 任一是字符串，则转化String()另一个也为字符串，结果为字符串

a - b

1 - 2 // 数字相减, 没问题

// 非数字则要先转化一波
1 - null // null => 0
1 - undefined // undefined = NaN
1 - '' // '' => 0
1 - '2' // '2' => 2
```

## 比较操作符

```javascript
a < b
a > b
a <= b
a >= b

// a 和 b 中但凡有一个数字，另一个东西转化为数字再比较
1 < '3' // 1 < 3, true
NaN > 3 // false
NaN < 3 // false
NaN > NaN // false

'a' < 3 // Number('a') < 3, NaN < 3, false

// a 和 b 全部是 String, 通过字符逐个比较
'abc' < 'abcd' // true
```

## `==` 和 `===` 操作符

Javascript还是一个数字思维的编程语言。所以都要往数字上转换。

- `Boolean`类型的`true/false` 先转为 `1/0`
- `String` 类型的先尝试转为数字(两个都是string则不需要转化)
- `Object` 类型的先尝试转为数字(两个都是object则不需要转化)
- `Undefined`， `Null` 类型在比较前不能转化为任何其他形式
- `undefined == null` -> `true`

```javascript
[1] == 1 // Number([1]) = Number([1].valueOf().toString()) = Number('1') = 1, true
'5' == 5 // Number('5'), true
false == 0 // Number(false) = 0, true

a = {}
b = {}
a == b // false，两个对应的内存对象
```

使用`===`操作符则不会有潜在类型转换，必须强制比较类型。更加安全，不会有意外，推荐使用。

# 3.6 语句

没啥好讲的，老生常谈。讲两个亮点：

Javascript的for语句比较特殊：

```javascript
for (let item of obj) { // 不适用于所有对象，仅仅适用于可枚举的
    console.log(item)
}

for (let item in obj) { // 对象及对象原型的可枚举“属性名”都会列出
    console.log(item)
}
```
参见
https://blog.csdn.net/crystal6918/article/details/75099816

# 3.7 函数参数

函数参数传入可以取名字也可以不取名字，内部有一个`arguments`列表供调用, 所以函数也不能形成签名，函数也不能重载。

```javascript
function a() {
    console.log(arguments)
    console.log(arguments.length)
}

a(1,2,3) // [Arguments] { '0': 1, '1': 2, '2': 3 }, 3
a(1) // [Arguments] { '0': 1 }, 1
a() // [Arguments] {}, 0
```