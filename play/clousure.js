function createF() {
  var result = new Array();
  for (var i = 0; i < 10 ;i++) {
    result[i] = function() { return i }
  }
  return result
}


funcs = createF()
for (let y = 0; y < funcs.length; y++) {
  console.log(funcs[y]())
}

// 全部都是 10, func小函数里面包含自己的<活动对象>，
// 同时包含一份引用到creatF的<活动对象>，
// 10个小函数都引用同一份 createF<活动对象>
// 当createF执行完毕以后，内部的i就已经是10了。
// 当小函数运行的时候，对着createF活动对象的尸体取得i，那就是10

function createF2() {
  var result = new Array();
  for (var i = 0; i < 10 ;i++) {
    result[i] = (function(number) { return number }(i)) // 立即执行了！
  }
  return result
}


funcs = createF2()
for (let y = 0; y < funcs.length; y++) {
  console.log(funcs[y])
}
// 0..1...2...9