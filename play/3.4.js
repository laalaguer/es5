/**
 * Chapter 3 Variables.
 */
var b
console.log(b, typeof b)

b = '123'
console.log(b, typeof b)

b = 123
console.log(b, typeof b)

b = 123.123
console.log(b, typeof b)

b = false
console.log(b, typeof b)

b = {}
console.log(b, typeof b)

b = null
console.log(b, typeof b)

b = function () {}
console.log(b, typeof b)

// Undefined
var c
console.log("c", c, c === undefined) // true

// Null
console.log("undefined == null", undefined == null) // true
console.log("undefined === null", undefined === null) // false

// Boolean
console.log("Boolean('')", Boolean(''))
console.log("Boolean('abc')", Boolean('abc'))

console.log("Boolean(1)", Boolean(1))
console.log("Boolean(0)", Boolean(0))
console.log("Boolean(Number('a'))", Boolean(Number('a'))) // NaN is turned to false

console.log("Boolean({})", Boolean({}))
console.log("Boolean(null)", Boolean(null))

console.log("Boolean(undefined)", Boolean(undefined))

console.log("Boolean({})", Boolean({})) // any object is true
console.log("Boolean([])", Boolean([])) // any object is true

// Number
console.log(Number.MAX_VALUE)
console.log(Number.MIN_VALUE)

console.log(Number.MAX_VALUE + Number.MIN_VALUE) // strange

console.log(Number.MAX_VALUE + Number.MAX_VALUE) // Infinite

console.log('isNaN(10)', isNaN(10))
console.log('isNaN(null)', isNaN(null))
console.log('NaN - Nan', NaN - NaN) // NaN

console.log('Number(true)', Number(true))
console.log('Number(false)', Number(false))
console.log('Number(null)', Number(null))
console.log('Number(undefined)', Number(undefined))
console.log("Number('')", Number(''))
console.log("Number('1')", Number('1'))
console.log("Number('1.1')", Number('1.1'))
console.log("Number('1.1.1')", Number('1.1.1'))
console.log("Number('0xff')", Number('0xff'))
console.log("Number(NaN)", Number(NaN))
console.log("Number({})", Number({}))
console.log("Number([])", Number([])) // valueOf() then toString() => which comes ''
console.log("Number([1])", Number([1])) // valueOf() then toString() => which comes '1'
console.log("Number([1,2])", Number([1,2])) // valueOf() then toString() => which comes '1,2'

// String
var d = 10
console.log("10 toString()", d.toString())
console.log("10 toString(2)", d.toString(2))
console.log("10 toString(16)", d.toString(16))

d = 10.123
console.log("10.123 toString()", d.toString())
console.log("10.123 toString(2)", d.toString(2)) // 保留小数点, 后面数字有点奇怪
console.log("10.123 toString(16)", d.toString(16)) // 保留小数点, 后面数字有点奇怪