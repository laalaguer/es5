# ES5

《Javascript高级程序设计 (第三版)》的学习笔记。

这本书老了。当时2012年`ES5`刚出不久。书架上放着一本`ES6`，我日后来更新。

有空的同学还是看一下英文版本。比中文好懂。

`ES3->ES5->TypeScript` 语言发展迅速。然而跟着网上教程、博客，框架的文档总是学一些皮毛。碰上一些问题就无法解决。对语言的特性没有从 `过去发展到现在` 的历史性、发展的观点。就没法掌握现在的最新版语言。

## 很多问题一知半解

为什么`var that = this` 来规避 `Context` 转移？

`Vue` 框架怎么做到的`this` 不转移？

为什么会有` === ` 符号？

`Typescript` 的 `Class` 实现基本原理是什么？

为什么 `import/export` 和 `require/module.export` 在打包工具会报错？不能混用？

`() => {}` 这种语法究竟是什么？怎么发展来的？

Javascript有没有继承？究竟能不能继承？

`函数` 为什么是一等公民？究竟什么意思？

基本的`内置`类型有哪些 会和 Java一样多吗？

`访问器`是什么？库函数为何喜欢用这种东西？

`Immutable`库这种究竟怎么做到变量不可更改的？


## 解决方案

所有这些都不是看看博客、文章，依葫芦画瓢能够学好的。这样学语言学不好。所以老老实实从 `ES5` 开始，买本书看。搞清楚JS解释机制，它的运行环境和变量的基本特性。了解清楚以后再去`带着发展的眼光`看 `ES6` 的新特性。更容易理解。

## 目录

```
// 文档
Ch.3    Variables.md
Ch.4    Reference.md
Ch.5    Reference Types.md
Ch.6.1  Object Define.md
Ch.6.2  Constructor or Prototype.md
Ch.6.3  Inheritance.md
Ch.7    Function Expression.md
Ch.7.1  Execution Context.md
Ch.7.2  Variable Object.md
Ch.7.3  Scope Chain.md
Ch.7.4  Closure.md
Ch.7.5  This.md
Ext.1 Import Export.md

// 一些snippet
play
// 额外
Ext.1 Export.md
// 有趣的视频
Fuckedup.md
```
