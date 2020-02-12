function describe(object, propName) {
  console.log(propName, Object.getOwnPropertyDescriptor(object, propName))
}

var person = {}

Object.defineProperty(person, '_name', {
  configurable: true,
  enumerable: false,
  writable: true,
  value: 'default'
})

Object.defineProperty(person, 'name', {
  configurable: true,
  enumerable: true,
  get: function(){
    return this._name
  },
  set: function(value) {
    if (typeof(value) == 'string') {
      this._name = value
    }
  }
})

function test() {
  describe(person, 'name')
  describe(person, '_name')
  console.log('-')

  person._name = '1'
  describe(person, 'name')
  describe(person, '_name')
  console.log('-')

  person.name = '2'
  describe(person, 'name')
  describe(person, '_name')
  console.log('-')

  person.name = 3
  describe(person, 'name')
  describe(person, '_name')
  console.log('-')

  Object.seal(person)
  person.name = '4' // still can write
  describe(person, 'name')
  describe(person, '_name')
  console.log('-')

  Object.freeze(person)
  person.name = '5' // can't write
  describe(person, 'name')
  describe(person, '_name')
  console.log('-')
}


test();