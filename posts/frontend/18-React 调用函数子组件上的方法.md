---
typora-root-url: ../
tags: react
createTime: 2020-05-30
updateTime: 2020-05-30
keywords: react调用子组件方法,react调用函数组件上方法,使用react hooks调用函数组件上方法
summary: 通过 React Hooks 在父组件调用函数子组件上的方法
---

# React 调用函数子组件上的方法

## 前言

最近学习使用 `React Hooks` 时，父组件使用 `ref` 到函数组件上时出现：

```
Function components cannot be given refs.
```

函数组件不能被给予 `refs` 的错误提示，那么我该如何在父组件上调用子组件的方法呢。

参考：[react useImperativeHandle](https://zh-hans.reactjs.org/docs/hooks-reference.html#useimperativehandle) 

## 解决

举一个简单的案例，父组件上有一个 `Button` 按钮，用户点击按钮后显示子组件的 `Modal` 弹窗让用户填写数据。那么我们就需要通过父组件调用子组件改变 `Modal` 显示状态的方法让弹窗显示出来。

### 父组件

父组件使用 `useRef` 钩子创建一个可变的 `ref` 对象，然后把这个 `ref` 传递给子组件。父组件上使用 `ref` 对象的 `current` 属性调用子组件上的方法，

```jsx
import React, { useRef } from 'react'
import { Button } from 'antd'

const Parent = () => {
  // useRef 返回一个ref对象
  const modal = useRef(null)

  const showModal = () => {
    // 调用子组件上的 changeVisible 方法
    modal.current.changeVisible()
  }

  return (
    <>
      <Button onClick={showModal}>添加数据</Button>
      <Child ref={modal} />
    </>
  )
}

export default Parent
```

### 子组件

`forwardRef` 会把组件接受到的 `ref` 属性作为组件的第二个参数，然后通过 `useImperativeHandle` 自定义需要暴露给父组件的方法。

`useImperativeHandle` 钩子第一个参数为组件接受的 `ref` ，第二个参数为返回一个对象的函数。

```jsx
import React, {
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react'
import { Modal, Form } from 'antd'

const Child = (props, ref) => {
  const [visible, setVisible] = useState(false)
  // useImperativeHandle 可以自定义暴露给父组件的方法
  // 与 forwardRef 一起使用
  useImperativeHandle(ref, () => ({
    changeVisible() {
      setVisible(!visible)
    }
  }))

  return (
    <Modal visible={visible}>
      <Form></Form>
    </Modal>
  )
}

export default forwardRef(Child)
```

## 补充

使用 `useImperativeHandle` 钩子第二个参数函数返回对象中定义的方法在该函数组件当然是无法调用的。如果该子组件也需要使用这个方法的话，我们就放在外面定义，然后在 `useImperativeHandle` 中使用就可以啦。

```js
useImperativeHandle(ref, () => ({ changeVisible }))
const changeVisible = () => setVisible(!visible)
```

这样使用 `ES6` 的语法简写后看上去也比较舒服了。

### PropTypes

通常我们都会使用到 `prop-types` 对 `pops` 进行类型检查，但是向上面的方法那样使用 `forwardRef` 钩子创建组件后会出现一个警告：

```
Warning: forwardRef render functions do not support propTypes or defaultProps. 
```

提示不支持 `propTypes` 和 `defaultProps` 了，所有我们应该这样创建函数组件：

```jsx
import React, {
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react'
import PropTypes from 'prop-types'
import { Modal, Form } from 'antd'

const Child = forwardRef(function Component(props, ref) {
  const [visible, setVisible] = useState(false)
  useImperativeHandle(ref, () => ({
    changeVisible() {
      setVisible(!visible)
    }
  }))

  return (
    <Modal visible={visible}>
      <Form></Form>
    </Modal>
  )
})

// 这样就可以使用 propTypes 啦
Child.propTypes = {}

export default Child
```

细心的小伙伴会发现 `forwardRef` 钩子传入的组件并不是匿名组件，这是因为匿名组件的话使用 `eslint` 规范检测的时候会出现一个错误：

```
Component definition is missing display name  react/display-name
```