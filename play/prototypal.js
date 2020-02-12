// 融合 原型式继承 和 组合继承的经典 
// https://tylermcginnis.com/javascript-inheritance-and-the-prototype-chain/
// https://blog.bitsrc.io/understanding-javascripts-prototypal-inheritance-354292253bcb
// Or Object.create()
function replica(o) {
  function f(){}
  f.prototype = o
  return new f()
}

function Person(name) {
  this.name = name
}

Person.prototype.sayName = function () {
  console.log('name:', this.name)
}

/* --- above code maybe from a foreign library --- */

function Father(name, job) {
  Person.call(this, name) // 经典式继承
  this.job = job
}

Father.prototype = replica(Person.prototype) // 组合了原型继承的高级版：原型式继承 replica() create a new empty object and put Person.prototype into its [[prototype]] field
Father.prototype.sayJob = function () {
  console.log('job:', this.job)
}

console.log(Father.prototype.constructor)
console.log(Father.prototype)
console.log(Father.prototype.__proto__)
console.log(Father.prototype.__proto__.constructor)

f = new Father('John', 'worker')
f.sayJob()
f.sayName()