// 用立即执行函数包裹的一段代码，最后反出来一个Object
// (function(){ ... }());

// 下面这段，把所有方法，赋值给一个对象 person
// 让person这个新对象具有数个新方法

let person = (function(){

  let a = 10;

  return {
    increase: function() {
      a++;
    },
    get: function() {
      return a
    }
  }

}());

console.log(person)
person.increase()
console.log(person.get())


// 下面这段，把所有方法，“装配”给一个现有的对象 dog
// 让 dog 这个旧对象具有数个新方法

let dog = { a: 1 }

function inhance(obj) {
  let a = 10; // 这个 a 和外部那个 a 完全没有关系, function 天然是一个clousure, 内部这个 a 无法被外部访问

  obj.increase = function() {
    a++;
  }

  obj.get = function() {
    return a
  }
}

inhance(dog);

console.log(dog)
dog.increase()
console.log(dog)
console.log(dog.get())