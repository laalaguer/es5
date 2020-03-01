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

// 全部都是 10, 
// 仔细分析：funcs 小函数，在执行的时候funcs[y]，
// 1. 创建了自己的<活动对象>，这个活动对象里面没有参数，也没有变量。
// 2. 包含一份引用到createF的当时的快照，这个快照包含一个活动对象，活动对象里包含了 var i （未被解释器销毁）
// 3. 10个小函数都引用同一份 createF<活动对象>
// 当createF执行完毕以后，内部的i就已经是10了。
// 当小函数运行的时候，对着createF活动对象的尸体（未被解释器销毁），取i，那就是10

function createF2() {
  var result = new Array();
  for (var i = 0; i < 10 ;i++) {
    result[i] = (function(number) { return number }(i)) // 立即执行了！是一个值
  }
  return result
}


funcs = createF2()
for (let y = 0; y < funcs.length; y++) {
  console.log(funcs[y])
}
// 0..1...2...9
// 其实这里的立即执行函数，形成了一个小小封闭的scope
// i还是引用了外部，但是执行完毕后，已经是一个值 result[i] = 值
// 所以没有关系