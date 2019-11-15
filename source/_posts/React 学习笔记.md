---
title: React 学习笔记
tags:
- 前端
- React
categories: React
---

## 前言

对于前端的学习也已经有一段时间了，之前一直想学习React框架，有可能是我个人比较懒散，长时间以来都没有抽出空余时间对React进行系统化的学习，由于这个的计划的长时间搁置，
并且发现许多大厂所应用的前端技术框架大部分都是React框架，所以对此，我决定抽出时间开始对React框架进行学习。在学习的过程当中，我发现React和Vue框架还是有许多共同之处的，
有了之前Vue的学习，你会发现在学习其他框架的时候，会显得得心应手。当然，既然是系统化的学习，学习react的过程肯定不能够马虎，因此我决定把学习过程中的笔记记录下来，
方便自己进行温故知新，下面是本人学习过程中的知识网络和一些技术心得。

<!-- more -->

## React Fiber 代码结构

``` bash
import react, { Component } from 'react';
import ReactDOM from 'react-dom'
// 注意：对于react构造函数是的引入，目的是为了让react组件能够解析JSX语法

class ComponentA extend Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
    };

    // 这种绑定是使`this`在回调中起作用所必需的
    this.handleClick = this.handleClick.bind(this);
  }

  render() {
    return (
      <div onClick={this.handleClick}>
        {this.state.value}
      </div>
    );
  }

  handleClick() {
    // do something
  }
}

ReactDOM.render(
  <ComponentA />,
  document.getElementById('root')
)
```

## React 框架优势

## 组件生命周期

首先，我们理解什么是生命周期函数，生命周期函数组件实例在某个时期会自动自行的钩子函数，每个组件都有在处理环节的特定时期运行的生命周期函数方法，方法中带有前缀will的在特定环节之前被调用，而带有前缀did的方法则会在特定环节之后被调用。

### 挂载

这些方法都会在组件实例被创建和插入DOM中时被调用：
* constructor() 