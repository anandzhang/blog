---
typora-root-url: ../
tags: antd
createTime: 2020-04-01
updateTime: 2020-04-01
keywords: antdesign form值,获取antdesign表单form值
summary: Ant Design 4 中去除了Form.create方法创建Form实例去获取常用的表单方法，那么在类组件中应该如何去得到Form实例呢？。
---

# Antd 4 获取Form字段值

由于 `Antd 4` 中去除了 `Form.create` 方法创建 `Form` 实例得到 `getFieldDecorator` 、`validateFields` 等方法，我们使用类组件想要 `Form` 上的方法就需要用到 `Ref` 来获得实例。

```jsx
import React, { Component } from 'react'
import { Form, Input, Button } from 'antd'

class Example extends Component {
  // 通过 Ref 来获取 Form 实例
  // 同样的，你可以不使用createRef()方法而用this.refs.XXX也可以
  formRef = React.createRef()

  // 通过 Form 的 Submit监听 得到字段值
  onFinish = values => {
    console.log(values)
  }

  getValues= () => {
    // 得到 Form 实例
    const form = this.formRef.current
    // 使用 getFieldsValue 获取多个字段值
    const values = form.getFieldsValue(['name','age'])
    console.log(values)
  }

  render() {
    const { Item } = Form
    return (
      <Form ref={this.formRef} onFinish={this.onFinish}>
        <Item name='name' label='姓名' >
          <Input />
        </Item>
        <Item name='age' label='年龄'>
          <Input />
        </Item>
        <Item>
          <Button type='primary' htmlType='submit'>提交</Button>
          <Button type='link' onClick={this.getValues}>非 Submit 方式</Button>
        </Item>
      </Form>
    )
  }
}

export default Example
```

上诉就是 `Antd 4` 中怎么在类组件中获得表单组件的值，主要就是去除了 `Form.create` 后的一些变化。通过 `Ref` 获得实例后使用 `getFieldValue` 获取单个字段值、`getFieldsValue` 获取多个字段值，主动去得到表单的值。

