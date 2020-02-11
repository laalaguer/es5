# 5
各种各样的`引用类型`。

引用类型区别于传统的基本值类型。引用类型的实例是`对象`, 由一个`构造函数`和`new`关键字配合在一起创建。构造函数和普通函数也没什么区别。

## 5.1  `Object` 类型
```javascript
// 传统方式
a = new Object()
a.name = "Tom"
a.age = 18

// 简化方式
a = {
    name: "Tom",
    age: 18
}

// 通用原型方法
object.toString()
object.toLocaleString()
object.valueOf()
```

## 5.2 `Array` 类型
```javascript
// 传统方式
var colors = new Array();
// 简化方式
var colors = [1,2,3]
// length 读取
colors.length // 3
// length 来触发扩容
colors.length = 4 // 扩容了一个，最后一个为undefined
```

### 确定对象是不是数组

```javascript
Array.isArray(object) // 永远适用
object instanceof Array // 在多iframe环境下不适用
```

### `join`方法

```javascript
var a = [1,2,3]
a.join('||') // 1||2||3
```

### 栈模仿

```javascript
var a = []
a.push(1)
a.push(2)
a.pop() // 2
a.pop() // 1
a.pop() // undefined
```

### 队列模仿

```javascript
var a = []
a.push(1)
a.push(2)
a.shift() // 1
a.shift() // 2
a.shift() // undefined
```

### 排序方法

```javascript
var a = [1,2,3]
a.reverse() // <原地>重新排序，也有返回值，返回值也是一样的
a // 3,2,1
```

```javascript
var a = [1, 10, 5]

a.sort() // <原地>重新排序，item.toString() 以后进行两两比较，不是很合理, 返回还是 1，10，5 ，因为 '10' 比 `5` 在字符串上要小

a.sort(function (a, b) { return a - b }) // 通过传入一个比较函数，相对比较合理
```

### 操作方法

```javascript
var a = [1,2,3]

// concat方法
var b = a.concat() // 复制
b = a.concat(4) // [1,2,3,4]
b = a.concat(4, [5,6]) // [1,2,3,4,5,6]

var c = a.concat(b) // 成功组合两个数组

// slice方法
var c = a.slice() // 复制
c = a.slice(1) // [2,3]
c = a.slice(1,2) // [2]

// splice方法：其实位置，删除数目，插入的对象

//(替换作用)
a.splice(0, 1, 4) // 0号位，删除一个，同时插入一个数字4
a // [4,2,3]

//(删除作用)
a = [1,2,3]
a.splice(1, 1) // 1号位删除一个元素
a // [1,3]

//(插入作用)
a = [1,2,3]
a.splice(1, 0, 'red') // 1号位，不删除，但是插入red
a // [1, 'red', 2, 3 ]
```

### 位置方法

```javascript
var a = [1,2,3,4]

a.indexOf(3) // === 比较法，找不到则返回-1
a.lastIndexOf(3)
```

### 其他方法

```javascript
some()
every()
filter()
forEach()
map()
```

## 5.3 `Date`类型

`Date`用`1970/1/1`的前后毫秒数量，来决定日期。所以可以正负28万年。
```javascript
var a = new Date() // 创建一个当前日期
var a = new Date(-100) // 1970/1/1 - 100 毫秒 1969-12-31T23:59:59.900Z
