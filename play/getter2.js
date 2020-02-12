function describe(object, propName) {
  console.log(propName)
  console.log('ownProperty?',object.hasOwnProperty(propName))
  console.log('details:', Object.getOwnPropertyDescriptor(object, propName))
  console.log()
}

// How to keep _name invisible from outside and cannot be tampered with from outside?
// What if we use 'inheritance'?

var person = {}

Object.defineProperty(person, '_name', {
  configurable: true,
  enumerable: false,
  writable: true,
  value: 'default'
})

function replica(o) {
  function F() {}
  F.prototype = o
  return new F()
}

person2 = replica(person) // 原型式继承

Object.defineProperty(person2, 'name', {
  configurable: true,
  enumerable: true,
  get: function(){
    return this._name
  },
  set: function(value) {
    if (typeof(value) == 'string') {
      this._name = value // this won't go up the prototype chain, but only shadow the '_name' in prototype
    }
  }
})

function test() {
  // freeze it or not freeze it?
  Object.freeze(person2)

  describe(person2, 'name')
  // console.log('name', person2.name)
  describe(person2, '_name')
  // console.log('_name', person2._name)
  describe(Object.getPrototypeOf(person2), '_name')

  // Try to set a value via setter function.
  person2.name = 'nicolas'
  describe(person2, 'name')
  // console.log('name', person2.name)
  describe(person2, '_name')
  // console.log('_name', person2._name)
  describe(Object.getPrototypeOf(person2), '_name')
}

test();