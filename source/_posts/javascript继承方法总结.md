---
title: javascript继承方法总结
date: 2019-09-30 16:21:21
tags:
- 前端
- javascript
categories: web前端
---

继承是 OOP 语言中一个比较重要的概念，继承可以使得子类具有父类的属性和方法或者重新定义、新追加属性和方法等，由于 Javascript 语言没有真正的对象类，所以其实现继承的方法相对而言会比较特殊，实现继承主要是依靠原型链来实现的。
实现继承的方法主要有以下几种：

<!-- more -->

## 1、原型链继承

将一个原型对象的实例赋值给另一个原型对象的原型，从而继承该原型对象的属性和方法。

``` bash
function SuperType() {
  this.property = true;
}

SuperType.prototype.getSuperValeu = function () {
  return this.property;
}

function SubType() {
  this.subproperty = false;
}

// 创建 SuperType 实例，并将该实例赋值给 SubType.prototype
SubType.prototype.getSubValvue = function () {
  return this.subproperty;
}

var instance = new SubType();
console.log(instance.getSuperValue());    // true
```

【注意事项】

1. 当子类需要覆盖父类的方法或者添加方法时，给原型添加的方法一定要放在替换原型的语句之后，
    否则子类实例调用该函数时，该函数将会被父类的原型方法给覆盖掉。
2. 通过原型链实现继承时，不能使用对象字面量创建原型方法，否则将会重写原型链，导致继承失败。

**优点：**

* 每一个子类实例都可以继承父类函数的属性和方法以及父类函数原型链上的属性和方法

**缺点：**

* 包含引用类型值的原型属性会被所有实例共享，多个实例对引用类型的操作会被篡改

``` bash
function SuperType() {
  this.colors = ['red', 'blue', 'green'];
}

function SubType() {
}

// 继承 SuperType
SubType.prototype = new SuperType();

var instance1 = new SubType();
instance1.colors.push('black');
console.log(instance1.colors);    // 'red, blue, green, black'

var instance2 = new SubType();
console.log(instance2.colors);    // 'red, blue, green, black'
```

## 2、借用构造函数继承

在子类构造函数中调用执行父类构造函数，并将this指针指向子类的构造函数的作用域,
使得子类的每个实例都会复制一份父类函数中的属性。

``` bash
function SuperType() {
  this.colors = ['red', 'blue' , 'green'];
}

function SubType() {
  // 执父类构造函数，继承父类
  SuperType.call(this);
}

var instance1 = new SubType();
instance1.colors.push('blck');
console.log(instance1.colors);    // 'red, blue, green, black'

var instance2 = new SubType();
console.log(instance2.colors);    // 'red, blue, green'
```

**优点：**

* 在子类的构造函数中可以向父类函数传递参数

``` bash
function SuperType(name) {
  this.name = name;
}

function SubType() {
  // 继承 SuperType，同时传递参数
  SuperType.call(this, 'Nicholas');

  // 实例属性
  this.age = 29;
}

var instance = new SubType()
console.log(instance.name);   // 'Nicholas'
console.log(instance.age);    // 29
```

**缺点：**

* 只能继承父类的实例属性和方法，不能继承父类原型的属性和方法
* 每一个子类实例都有父类实例函数的副本，无法实现属性/方法复用

## 3、组合继承

组合继承指的是组合原型链和借用构造函数技术的继承方法，使用原型链实现对原型属性和方法的继承，
通过借用构造函数来实现对实例属性的继承。

``` bash
function SuperType(name) {
  this.name = name;
  this.colors = ['red', 'blue', 'green'];
}

SuperType.prototype.sayName = function () {
  console.log(this.name);
};

function SubType(name, age) {
  // 继承属性
  // 第二次借用构造函数，调用 SuperType
  SuperType.call(this, name);

  this.age = age;
}

// 继承方法
// 第一次构造原型链，调用 SuperType
SubType.prototype = new SuperType();
// 重写 SubType.prototype 的 constructor 属性，指向自己的构造函数 SubType
SubType.prototype.constructor = SubType;
SubType.prototype.sayAge = function () {
  console.log(this.age);
};

var instance1 = new SubType('Nicholas', 29);
instance1.colors.push('black');
console.log(instance1.colors);    // 'red, blue, green, black'
instance1.sayName();    // 'Nicholas'
instance1.sayAge();    // 29

var instance12 = new SubType('Greg', 27);
console.log(instance2.colors);    // 'red, blue, green'
instance2.sayName();    // 'Greg'
instance2.sayAge();    // 27
```

**缺点：**

* 子类的实例对象会分别两次调用 SuperType,在实例对象上拷贝了父类函数的属性，同时也在原型上创建了父类函数的属性，实例上的属性覆盖了原型对象上的同名属性。

## 4、原型式继承

利用空对象作为中介，将某个对象直接复制给空对象搞糟函数的原型。

``` bash
function object(obj) {
  function F() {}
  F.prototype = obj;
  return new F();
}

object()对传入的对象执行了一次*浅复制*，将构造函数的原型直接指向传入的对象。

var person = {
  name: 'Nicholas',
  friends: ['Shelby', 'Court', 'Van']
};

var anotherPerson = object(person);
anotherPerson.name = 'Greg';
anotherPerson.friends.push('Rob');

var yetAnotherPerson = object(person);
yetAnotherPerson.name = 'Linda';
yetAnotherPerson.friends.push('Barbie');

console.log(person.friends);    // 'Shelby, Court, Van, Rob, Barbie'
```

另外，ES5 存在 Object.create() 的方法，能够代替上面的 object 方法。

## 5、寄生式继承

在原型式继承的基础上，增强对象，返回构造函数

``` bash
funciton createAnother(original) {
  var clone = object(orginal); // 通过调用 object() 函数创建一个新对象
  clone.sayHi = function () { // 以某种方式来增强对象
    console.log('HI');
  }
  return clone; // 返回这个对象
}
```

通过函数的作用增强新对象，即给新对象添加属性和方法

``` bash
var person = {
  name: 'Nicholas',
  friends: ['Shelby', 'Court', 'Van']
};

var anotherPerson = createAnother(person);
anotherPerson.sayHi();    // 'HI'
```

**缺点：**

* 引用属性被多个实例共享，存在多个实例篡改属性的可能
* 与构造函数模式类似，不能做到函数复用而降低效率

## 6、寄生组合式继承

结合借用构造函数传递参数和寄生模实现继承

``` bash
function inheritPrototype(subType, superType) {
  var prototype = Object.create(superType.prototype); // 创建对象
  prototype.constructor = subType;                    // 增强对象
  subType.prototype = prototype;                      // 指定对象
}

function SuperType(name) {
  this.name = name;
  this.colors = ['red', 'blue', 'green'];
}

SuperType.prototype.sayName = function () {
  console.log(this.name);
};

function SubType(name, age) {
  SuperType.call(this, name);

  this.age = age;
}

inheritPrototype(SubType, SuperType);

SubType.prototype.sayAge = function () {
  console.log(this.age);
};
```

**优点：**

* 避免在实例的原型上创建不必要的、多余的属性，同时保持原型链不变
  
寄生组合式继承式引用类型最理想的继承范式。

## 7、圣杯模式继承

圣杯模式：其原理依然遵循的是寄生组合式

``` bash  
// 圣杯模式
function inherit(subType, superType) {
  function F() {};
  F.prototype = superType.prototype;
  subType.prototype = new F();
  subType.prototype.constructor = superType;
  subType.prototype.uber = superType.prototype;
}

// 高级圣杯
// 通过闭包函数实现属性私有化的作用
var inherit = (function () {
  var F = function () {};
  return function (subType, superType) {
    // 定义私有属性
    //var prop
    F.prototype = superType.prototype;
    subType.prototype = new F();
    subType.prototype.constructor = superType;
    subType.prototype.uber = superType.prototype;
    // 获取私有属性
    subType.prototype.getProp = function () {
      // get prop
    }
  }
})
```

## 8、混入方式继承多个对象

通过 Object.assign 把其他原型构造函数拷贝到实例子类原型上。

``` bash
function MyClass() {
  SuperClass.call(this);
  OtherSuperClass.call(this);
}

// 继承 SuperClass
MyClass.prototype = Object.create(SuperClass.prototype);
// 混合其他类
Object.assign(MyClass.prototype, OtherSuperClass.prototype);
// 重新指定 constructor
MyClass.prototype.constructor = MyClass;

MyClass.prototype.myMethod = function () {
  // do something
}
```

## 9、ES6 类继承 extends

extends关键字主要用于类声明或者类表达式中，以创建一个类，该类是另一个类的子类。其中constructor表示构造函数，一个类中只能有一个构造函数，有多个会报出SyntaxError错误,如果没有显式指定构造方法，则会添加默认的 constructor方法

``` bash
class Rectangle {
  // constructor
  constructor(height, width) {
    this.height = height;
    this.width = width;
  }
  
  // Getter
  get area() {
    return this.calcArea()
  }
  
  // Method
  calcArea() {
    return this.height * this.width;
  }
}

const rectangle = new Rectangle(10, 20);
console.log(rectangle.area);
// 输出 200

-----------------------------------------------------------------
// 继承
class Square extends Rectangle {

  constructor(length) {
    super(length, length);
    // 如果子类中存在构造函数，则需要在使用“this”之前首先调用 super()。
    this.name = 'Square';
  }

  get area() {
    return this.height * this.width;
  }
}

const square = new Square(10);
console.log(square.area);
// 输出 100
```

extends 继承的核心代码如下，其实现和上述的寄生组合式继承方式一样

``` bash
function _inherits(subType, superType) {

  // 创建对象，创建父类原型的一个副本
  // 增强对象，弥补因重写原型而失去的默认的constructor 属性
  // 指定对象，将新创建的对象赋值给子类的原型
  subType.prototype = Object.create(superType && superType.prototype, {
    constructor: {
      value: subType,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  
  if (superType) {
    Object.setPrototypeOf
      ? Object.setPrototypeOf(subType, superType)
      : subType.__proto__ = superType;
  }
}
```

ES5继承和ES6继承的区别

* ES5的继承实质上是先创建子类的实例对象，然后再将父类的方法添加到this上（Parent.call(this)）.

* ES6的继承有所不同，实质上是先创建父类的实例对象this，然后再用子类的构造函数修改this。因为子类没有自己的this对象，所以必须先调用父类的super()方法，否则新建实例报错。

<br/>

>[JavaScript常用八种继承方案](https://github.com/yygmind/blog/issues/7)
>
>NicholasC.Zakas. JavaScript高级程序设计. JAVASCRIPT高级程序设计. 2012.
