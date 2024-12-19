---
typora-root-url: ../
tags: antd
priority: 0.8
createTime: 2020-04-06
updateTime: 2020-04-06
keywords: resetFields不生效无效,antd resetFields无效,antd resetFields重置表单不生效
summary: Antd Form组件的resetFields方法为什么重置表单没有正常生效？
---

# Antd 4 Form resetFields无效

## 简介

使用 `Ant Design 4` 的 `Form` 表单实例的 `resetFields` 方法重置表单数据时没有产生理想的重置效果。

我的项目逻辑：使用一个 `Antd` 提供的 `Table` 表格组件渲染一堆数据，并在表格的最后一列展示几个操作该行数据按钮。点击操作数据的按钮后使用 `Modal` 组件显示一个表单对话窗让用户修改数据。`Modal` 组件中的表单 `Form` 组件拿到该行数据进行初始化，让用户方便修改。

问题：用户第一次点击修改按钮弹出 `Modal` 组件后，表单正常初始化数据；第二次点击另外一行进行修改时，表单初始化的数据仍是上一次点击行的数据；第三次点击另一行后表单的初始化数据为第二次点击行的数据。

## 案例代码

按照简介中的项目逻辑写了一个精简案例：

```jsx
import React, { Component, Fragment } from 'react'
import { Button, Table, Modal, Form, Input } from 'antd'

const { Item } = Form
// Table组件 表格每行数据
const dataSource = [
  { key: 1, name: 'Tom' },
  { key: 2, name: 'Bob' },
  { key: 3, name: 'Kevin' },
  { key: 4, name: 'Jack' },
  { key: 5, name: 'Jay' }
]

class Example extends Component {
  state = {
    visible: false,
    name: ''
  }

  // Table组件 表格列的配置
  columns = [
    {
      title: '名称',
      dataIndex: 'name'
    },
    {
      title: '操作',
      render: item => (
        <Button type='link' onClick={() => this.initModal(item)}>修改名称</Button>
      )
    }
  ]

  initModal = item => {
    this.setState({
      visible: true,
      name: item.name
    })
  }

  changeModalVisible = () => {
    this.refs.form.resetFields()
    this.setState({
      visible: !this.state.visible
    })
  }

  handleOk = () => {
    // ...
    // 省略表单处理代码
    this.changeModalVisible()
  }

  render() {
    const { visible, name } = this.state
    return (
      <Fragment>
        <Table dataSource={dataSource} columns={this.columns} rowKey='key' />
        <Modal
          title='修改名称'
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.changeModalVisible}
        >
          <Form ref='form' initialValues={{ name: name }}>
            <Item name='name'>
              <Input />
            </Item>
          </Form>
        </Modal>
      </Fragment>
    )
  }
}

export default Example
```

### 运行效果

![resetfields-problem](/images/frontend/13/resetfields-problem.gif)

## 分析问题

第一次点击能正常初始化表单；第二次点击，表单的数据为第一次点击的数据；第三次点击，表单初始化的数据为第二次的值。

我首先想到了 `resetFields` 重置表单这个方法使用的时机存在问题，表单的重置应该在每一次点击表格中 `修改名称` 按钮后显示 `Modal` 时，但是这样处理的话，第一次显示 `Modal` 通过 `this.refs.form` 获取不到表单实例：

```jsx
initModal = item => {
  // 应该在表单中按钮触发显示Modal的操作
  // 在 setState 函数的回调中执行重置操作，保证Modal的visible状态已经改变
  this.setState({
    visible: true,
    name: item.name
  }, () => this.refs.form.resetFields())
}

changeModalVisible = () => {
  // 不应该在这里重置表单
  // this.refs.form.resetFields()
  this.setState({
    visible: !this.state.visible
  })
}
```

出现报错：

```javascript
Example.js Uncaught TypeError: Cannot read property 'resetFields' of undefined
```

说明 `this.refs.form` 是 `undefined` ，没有拿到 `form` 实例，所有没有 `resetFields` 方法。

打开 `React Developer Tools` 发现 `Modal` 组件在最开始 `visible` 属性为 `false` 时是没有初始化的，第一次点击表单按钮改变 `Modal` 的 `visible` 后才得到加载。

![react-modal](/images/frontend/13/react-modal.gif)

然后我找了一下 `Modal` 没有初始化完后触发事件的接口，所以我就直接加一个 `if` 判断吧：

```javascript
initModal = item => {
  // 应该在表单中按钮触发显示Modal的操作
  // 在 setState 函数的回调中执行重置操作，保证Modal的visible状态已经改变
  this.setState({
    visible: true,
    name: item.name
  }, () => {
    const { form } = this.refs
    if (form) form.resetFields()
  })
}
```

可以了，这样就达到了正常的表单重置效果。

![result](/images/frontend/13/result.gif)

## 补充

对于上面简单的逻辑，我觉得将表单重置放在 `componentDidUpdate` 生命周期里也是可以的：

```javascript
initModal = item => {
  this.setState({
    visible: true,
    name: item.name
  }, () => {
    // const { form } = this.refs
    // if (form) form.resetFields()
  })
}

componentDidUpdate() {
  const { form } = this.refs
  if (form) form.resetFields()
}
```

### resetFields 方法

对于 `Antd` 提供的重置表单的方法，和传统原生的JS中 `form` 表单的 `type="reset"` 的效果不同，它并不是清空表单，而是重置到 `Form` 组件的 `initialValues` 属性的值，如果没有 `initialValues` 属性当然就重置为空，也就是清空表单。
