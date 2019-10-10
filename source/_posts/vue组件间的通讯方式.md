---
title: Vue组件通讯方式详解
tags:
- 前端
- Vue
categories: Vue 框架
---

组件式开发作为 Vue 框架的核心思想，在实际的项目开发中，开发者主要都是通过组件的形式进行开发。Vue 的每个组件实例都拥有独立函数作用域，实现组件与组件之间的数据通讯、共享状态，掌握各种组件的通讯方式，才能帮助我们在开发的过程中更加高效。下面将悉数展示所有 Vue 组件之间的通讯方式。

<!-- more -->

## 组件通讯方式

---

### props 和 $emit

props 属性是最常用的父组件向子组件传值的属性，通过props属性传的值是所传属性的空间地址，当父组件该属性变换时，子组件也会自动变换。props 可以是数组或者对象，对象允许配置高级选项。

``` bash
// 简单语法
props: ['size', 'myMessage']

// 对象语法
props: {
  property: {
    type: Number, // 传参限定类型
    default: any, // 指定默认值
    required: Boolean, // 定义是否微必填项
    validator: Function, // 自定义验证函数
  }
}
```

$emit 属性是最常用的子组件向父组件传值的属性，其作用是触发当前实例上的事件，同时附加参数传给监听器回调。

``` bash
// 子组件
Vue.component('magic-eight-ball', {
  data: function () {
    return {
      possibleAdvice: ['Yes', 'No', 'Maybe']
    }
  },
  methods: {
    giveAdvice: function () {
      var randomAdviceIndex = Math.floor(Math.random() * this.possibleAdvice.length)
      this.$emit('give-advice', this.possibleAdvice[randomAdviceIndex])
    }
  },
  template: `
    <button v-on:click="giveAdvice">
      Click me for advice
    </button>
  `
})

// 父组件
<template>
  <div id="emit-example-argument">
    <magic-eight-ball v-on:give-advice="showAdvice"><magic-eight-ball>
  </div>
</template>
<script>
  new Vue({
    el: '#emit-example-argument',
    methods: {
      showAdvice: function (advice) {
        alert(advice)
      }
    }
  })
</script>
```

### v-model

众所周知，v-model 用于模板中输入框value值的数据双向绑定，但在组件中 v-model 则会等价于

``` bash
<custom-input
  v-bind:value="searchText"
  v-on:input="searchText = $event"
></custom-input>
```

为了让它正常工作，这个组件内的 \<input> 必须：

将其 value 特性绑定到一个名叫 value 的 prop 上
在其 input 事件被触发时，将新的值通过自定义的 input 事件抛出

``` bash
// 子组件
Vue.component('custom-input', {
  props: ['value'],
  template: `
    <input
      v-bind:value="value"
      v-on:input="$emit('input', $event.target.value)"
    >
  `
})

父组件
<custom-input v-model="searchText"></custom-input>
```

### refs

通过给子组件添加 ref 属性，然后通过该属性访问子组件实例。

``` bash
// 父组件
<home ref="home"/>

mounted(){
  console.log(this.$refs.home) //即可拿到子组件的实例,就可以直接操作 data 和 methods
}
```

### .sync

在 vue@1.x 的时候曾作为双向绑定功能存在，即子组件可以修改父组件中的值; 在 vue@2.0 的由于违背单项数据流的设计被干掉了; 在 vue@2.3.0+ 以上版本又重新引入了这个 .sync 修饰符。

``` bash
// 父组件
<home :title.sync="title" />
//编译时会被扩展为
<home :title="title"  @update:title="val => title = val"/>

// 子组件
// 所以子组件可以通过$emit 触发 update 方法改变
mounted(){
  this.$emit("update:title", '这是新的title')
}
```

### $attrs 和 $listeners

$attrs 包含了父作用域中不作为 prop 被识别 (且获取) 的特性绑定 (class 和 style 除外)。当一个组件没有声明任何 prop 时，这里会包含所有父作用域的绑定 (class 和 style 除外)，并且可以通过 v-bind="$attrs" 传入内部组件——在创建高级别的组件时非常有用。

$listeners 包含了父作用域中的 (不含 .native 修饰器的) v-on 事件监听器。它可以通过 v-on="$listeners" 传入内部组件——在创建更高层次的组件时非常有用。

``` bash
// 组件A
Vue.component('A', {
  template: `
    <div>
      <p>this is parent component!</p>
      <B :messagec="messagec" :message="message" v-on:getCData="getCData" v-on:getChildData="getChildData(message)"></B>
    </div>
  `,
  data() {
    return {
      message: 'hello',
      messagec: 'hello c' //传递给c组件的数据
    }
  },
  methods: {
    // 执行B子组件触发的事件
    getChildData(val) {
      console.log(`这是来自B组件的数据：${val}`);
    },

    // 执行C子组件触发的事件
    getCData(val) {
      console.log(`这是来自C组件的数据：${val}`);
    }
  }
});

// 组件B
Vue.component('B', {
  template: `
    <div>
      <input type="text" v-model="mymessage" @input="passData(mymessage)">
      <!-- C组件中能直接触发 getCData 的原因在于：B组件调用 C组件时，使用 v-on 绑定了 $listeners 属性 -->
      <!-- 通过v-bind 绑定 $attrs 属性，C组件可以直接获取到 A组件中传递下来的 props（除了 B组件中 props声明的） -->
      <C v-bind="$attrs" v-on="$listeners"></C>
    </div>
  `,
  /**
   * 得到父组件传递过来的数据
   * 这里的定义最好是写成数据校验的形式，免得得到的数据是我们意料之外的
   *
   * props: {
   *   message: {
   *     type: String,
   *     default: ''
   *   }
   * }
   *
  */
  props: ['message'],
  data(){
    return {
      mymessage: this.message
    }
  },
  methods: {
    passData(val){
      //触发父组件中的事件
      this.$emit('getChildData', val)
    }
  }
});

// 组件C
Vue.component('C', {
  template: `
    <div>
      <input type="text" v-model="$attrs.messagec" @input="passCData($attrs.messagec)">
    </div>
  `,
  methods: {
    passCData(val) {
      // 触发父组件A中的事件
      this.$emit('getCData',val)
    }
  }
});

var app=new Vue({
  el:'#app',
  template: `
    <div>
      <A />
    </div>
  `
});
```

### $parent 和 $children

$parent 属性指向的父实例，通过 this.$parent.property 可以范围父实例的所有属性，但是会导致组件无法进行复用，不建议使用。

$children 属性指向当前实例的直接子组件数组，需要注意 $children 并不保证顺序，也不是响应式的。

> 提示：这两个属性不利于实现组件的复用，所以不建议使用。

``` bash
// 定义 parent 组件
Vue.component('parent', {
  template: `
    <div>
      <p>this is parent component!</p>
      <button @click="changeChildValue">test</button>
      <child />
    </div>
  `,
  data() {
    return {
      message: 'hello'
    }
  },
  methods: {
    changeChildValue(){
      this.$children[0].mymessage = 'hello';
    }
  },
});

// 定义 child 组件
Vue.component('child', {
  template:`
    <div>
      <input type="text" v-model="mymessage" @change="changeValue" />
    </div>
  `,
  data() {
    return {
      mymessage: this.$parent.message
    }
  },
  methods: {
    changeValue(){
      this.$parent.message = this.mymessage;//通过如此调用可以改变父组件的值
    }
  },
});

const app = new Vue({
  el: '#app',
  template: `
    <div>
      <parent />
    </div>
  `
});
```

### 中央事件总线 EventBus

当需要实现兄弟组件间通讯，并且项目规模不大的情况下，我们可以通过使用中央事件总线 EventBus 的方式实现。

EventBus 通过新建一个 Vue 事件 bus 对象，然后通过 bus.$emit 触发事件，bus.$on 监听触发的事件。

``` bash
// 组件 A
Vue.component('A', {
  template: `
    <div>
      <p>this is A component!</p>
      <input type="text" v-model="mymessage" @input="passData(mymessage)">
    </div>
  `,
  data() {
    return {
      mymessage: 'hello brother1'
    }
  },
  methods: {
    passData(val) {
      //触发全局事件globalEvent
      this.$EventBus.$emit('globalEvent', val)
    }
  }
});

// 组件 B
Vue.component('B', {
  template:`
    <div>
      <p>this is B component!</p>
      <p>组件A 传递过来的数据：{{brothermessage}}</p>
    </div>
  `,
  data() {
    return {
      mymessage: 'hello brother2',
      brothermessage: ''
    }
  },
  mounted() {
    //绑定全局事件globalEvent
    this.$EventBus.$on('globalEvent', (val) => {
      this.brothermessage = val;
    });
  }
});

//定义中央事件总线
const EventBus = new Vue();

// 将中央事件总线赋值到 Vue.prototype 上，这样所有组件都能访问到了
Vue.prototype.$EventBus = EventBus;

const app = new Vue({
  el: '#app',
  template: `
    <div>
      <A />
      <B />
    </div>
  `
});
```

### provide 和 inject

这对选项需要一起使用，以允许一个祖先组件向其所有子孙后代注入一个依赖，不论组件层次有多深，并在起上下游关系成立的时间里始终生效。

provide 选项应该是一个对象或返回一个对象的函数。该对象包含可注入其子孙的属性。

inject 选项应该是一个数组或一个对象

> 提示：provide 和 inject 绑定并不是可响应的。这是刻意为之的。然而，如果你传入了一个可监听的对象，那么其对象的属性还是可响应的。

``` bash
// 父级组件提供 'foo'
var Provider = {
  provide: {
    foo: 'bar'
  },
  // ...
}

// 子组件注入 'foo'
var Child = {
  inject: ['foo'],
  created () {
    console.log(this.foo) // => "bar"
  }
  // ...
}
```

### $boradcast 和 $dispatch

这也是一对成对出现的方法，不过只是在 Vue1.0 中提供了，而 Vue2.0 被废弃了，废话不多说，直接上代码。

``` bash
// broadcast 方法的主逻辑处理方法
function broadcast(componentName, eventName, params) {
  this.$children.forEach(child => {
    const name = child.$options.componentName;

    if (name === componentName) {
      child.$emit.apply(child, [eventName].concat(params));
    } else {
      broadcast.apply(child, [componentName, eventName].concat(params));
    }
  });
}

export default {
  methods: {
    // 定义 dispatch 方法
    dispatch(componentName, eventName, params) {
      let parent = this.$parent;
      let name = parent.$options.componentName;
      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent;

        if (parent) {
          name = parent.$options.componentName;
        }
      }

      if (parent) {
        parent.$emit.apply(parent, [eventName].concat(params));
      }
    },

    // 定义 broadcast 方法
    broadcast(componentName, eventName, params) {
      broadcast.call(this, componentName, eventName, params);
    }
  }
};
```

上面所示的代码，一般都作为一个 mixins 去混入使用, broadcast 是向特定的父组件触发事件，dispatch 是向特定的子组件触发事件，本质上这种方式还是 on 和 emit 的封装，在一些基础组件中都很实用。

### Vuex 状态管理

Vuex 是状态管理工具，实现了项目状态的集中式管理。工具的实现借鉴了 Flux、Redux、和 The Elm Architecture 的模式和概念。当然与其他模式不同的是，Vuex 是专门为 Vue.js 设计的状态管理库，以利用 Vue.js 的细粒度数据响应机制来进行高效的状态更新。详细的关于 Vuex 的介绍，请查看[官网文档](https://vuex.vuejs.org/zh/)

### vue-router 路由传参

当需要实现跨路由地址的传参时，我们可以通过 vue-router 官方提供给我我们的传参方案实现组件通讯，详情请查看[官方文档](https://router.vuejs.org/zh/guide/essentials/passing-props.html#%E5%B8%83%E5%B0%94%E6%A8%A1%E5%BC%8F)

### Vue.observable

2.6.0 新增
用法:让一个对象可响应。Vue 内部会用它来处理 data 函数返回的对象;
返回的对象可以直接用于渲染函数和计算属性内，并且会在发生改变时触发相应的更新;
也可以作为最小化的跨组件状态存储器，用于简单的场景。
通讯原理实质上是利用Vue.observable实现一个简易的 vuex

``` bash
// 文件路径 - /store/store.js
import Vue from 'vue'

export const store = Vue.observable({ count: 0 })
export const mutations = {
  setCount (count) {
    store.count = count
  }
}

//使用
<template>
    <div>
        <label for="bookNum">数 量</label>
            <button @click="setCount(count+1)">+</button>
            <span>{{count}}</span>
            <button @click="setCount(count-1)">-</button>
    </div>
</template>

<script>
import { store, mutations } from '../store/store' // Vue2.6新增API Observable

export default {
  name: 'Add',
  computed: {
    count () {
      return store.count
    }
  },
  methods: {
    setCount: mutations.setCount
  }
}
</script>
```

## 总结

以上就是 Vue 组件通讯的详细方案说明，涵盖了从 Vue1.0 到 Vue2.6 几乎所有的通讯方案，其中 Vue.observable 将在 Vue3.0 被 reative API所替代，向查看更多更新请查看 [Vue Composition API](https://vue-composition-api-rfc.netlify.com/)，同时我们还可以通过浏览器本地存储的方式进行组件通讯。
