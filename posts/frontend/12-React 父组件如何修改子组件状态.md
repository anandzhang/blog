---
typora-root-url: ../
tags: backend
createTime: 2020-04-03
updateTime: 2020-04-03
keywords: react父组件修改子组件状态,react父组件调用子组件方法,react ref怎么用
summary: 在 React 中父组件如何修改子组件的状态值？父组件又如何调用子组件中的方法呢？。
---

# React 父组件如何修改子组件状态

## 简介

由于一个 `组件A` 中渲染的结构较多，所以我决定把 `组件A` 中使用的 `Antd` 的 `Modal组件` 拆分出去，成为一个 `组件B` 去负责处理自己的业务逻辑。

这时奇怪的问题增加了，我们需要通过 `组件A` 去控制 `组件B` 中 `Modal组件` 的显示，也就是控制 `Modal组件` 的 `visible属性` 。如果把 `visible` 放在 `组件A` 的状态中，那么 `组件B` 的 `Modal` 的 `onOK` 和 `onCancel` 属性也需要通过调用 `组件A` 定义的函数才能修改 `visible` 值。

## 最初想法

按照上面简介中说的，我们把 `组件B` 中 `Modal` 的 `visible` 放在 `组件A` 中进行管理，这也就是常见的父组件给子组件传值，然后通过父组件给子组件提供的方法去修改父组件的值，那么就是这样：

```jsx
import React, { Component } from 'react'
import { Card, Button, Modal, Form } from 'antd'

class A extends Component {
  state = {
    visible: false
  }

  changeModalVisible = () => {
    this.setState({
      visible: !this.state.visible
    })
  }

  render() {
    const { visible } = this.state
    return (
      <Card title='示例'>
        <B
          visible={visible}
          changeVisible={this.changeModalVisible}
        />
        <Button onClick={this.changeModalVisible}>显示Modal</Button>
      </Card>
    )
  }
}

class B extends Component {
  handleOK = () => {
    this.props.changeVisible()
    // ...
    // 省略很多代码
  }

  render() {
    const { visible, changeVisible } = this.props
    return (
      <Modal
        title='Modal'
        visible={visible}
        onOk={this.handleOK}
        onCancel={changeVisible}
      >
        <Form></Form>
      </Modal>
    )
  }
}

export default A
```

上面这个案例代码省略了真实项目的大部分逻辑，项目的主要逻辑就是用户触发 `父组件A` 的一个按钮点击事件，然后显示 `子组件B` 的 `Modal` ，提供给用户一个 `Form` 表单，用户填写数据后，点击确定的时候对表单的数据进行手动收集并提交给后端，用户点击取消就隐藏掉这个 `Modal`。

案例中的操作并没有什么不可，但实际上在我的组件A中状态和方法已经足够多了，实在是不想再往里面塞，然后我就想怎么让 `父组件A` 去修改 `子组件B` 的状态（父组件修改子组件的状态）。

## 使用 Refs 获得子组件

我在 `子组件B` 上添加 `ref` 属性，然后 `父组件A` 通过调用 `this.refs` 拿到子组件实例，这时就可以访问到子组件的属性和方法了。

那么，我们在 `子组件B` 中定义一个方法，这个方法实现组件对自己状态的修改操作，然后我们再在 `父组件A` 中调用这个方法就好了。

```jsx
import React, { Component } from 'react'
import { Card, Button, Modal, Form } from 'antd'

class A extends Component {
  showModal = () => {
    // this.refs.XXX 拿到对应ref属性的组件
    this.refs.B.changeVisible()
  }

  render() {
    return (
      <Card title='示例'>
        <B ref='B' />
        <Button onClick={this.showModal}>显示Modal</Button>
      </Card >
    )
  }
}

class B extends Component {
  state = {
    visible: false
  }

  changeVisible = () => {
    this.setState({
      visible: !this.state.visible
    })
  }

  handleOK = () => {
    this.changeVisible()
    // ...
    // 省略很多代码
  }

  render() {
    const { visible } = this.state
    return (
      <Modal
        title='Modal'
        visible={visible}
        onOk={this.handleOK}
        onCancel={this.changeVisible}
      >
        <Form></Form>
      </Modal>
    )
  }
}

export default A
```

对于子组件上 `ref` 属性的使用还有一个方法，给 `ref` 传一个函数而不是字符串，这时传入这个函数的参数就是组件本身，然后我们再把这个组件赋值到父组件 `this` 的一个属性上就可以更方便的调用了，比如：

```jsx
class A extends Component {
  showModal = () => {
    // this.B 就可以拿到B组件了
    this.B.changeVisible()
  }

  render() {
    return (
      <Card title='示例'>
        <B ref={B => this.B = B} />
        <Button onClick={this.showModal}>显示Modal</Button>
      </Card >
    )
  }
}
```

另外你还可以通过 `React.createRef` 方法去创建 `ref` 然后去绑定，比如： 

```jsx
class A extends Component {
  B = React.createRef()

  showModal = () => {
    // this.XXX.current 就可以拿到ref绑的组件
    this.B.current.changeVisible()
  }

  render() {
    return (
      <Card title='示例'>
        <B ref={this.B} />
        <Button onClick={this.showModal}>显示Modal</Button>
      </Card >
    )
  }
}
```

## 题外话

其实最开始我都还没想到用 `ref` 实现父组件调用子组件的方法来修改子组件的状态，然后我竟然把 `Modal` 的 `visible` 放到了 `redux` 去管理，哎，我真的是脑短路。

另外，提醒下案例中用到的命名方式（比如：A、B）只为了撰写文章方便，真实开发这样用，你会凉凉的。