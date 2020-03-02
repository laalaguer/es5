# Variable Object 变量对象
从 ES3 到 ES5 概念略有变化。VO 这个概念和 Execution Context 紧密相连。同时和 Activation Object (AO) 也紧密相连。

可见它是在执行时候才存在的！在各种定义时候是不存在的。

## 总览
[Global VO] = [this == global]
[Function VO] = [VO == AO, <arguments>, <parameters>]

## Global VO

```javascript
global = {
    Math,
    String, 
    ...,
    window: global,
}
```
全局的VO在熟悉不过了，就是我们赖以生存的 浏览器环境 和 NodeJs 环境。很多基本的库都在这个环境里初始化好了。我们只需要引用就可以了。

## Function VO

```javascript
function foo(a,b,c) {
    var x = 30;
    function y(){};

    x++;
}

foo(1,2,3)
```

OK, 在 `函数被执行`的瞬间，AO创建出来，它吸收了paramters，arguments。
然后执行 VO = AO 操作。

```javascript
// foo() 执行瞬间
foo.AO = [<arguments>: [1,2,3], a:1, b:2, c:3,]
foo.VO = foo.AO
```
OK, 接着函数持续执行，所有的内部申明的变量、函数都被添加进去. 有点“变量提升”的意味。

```javascript
// foo() 继续逐行执行
foo.VO['x'] = 30;
foo.VO['y'] = Function;
```

OK，接着函数正式执行，进行变量的变更
```javascript
// foo() 继续执行
foo.VO['x'] = 31;
```

那么，那些函数执行时候没有在本段 Context 里面申明的变量，（例如引用了父环境中的变量，是如何被引用的呢？）请看下一张关于 Scope Chain 的问题。