---
typora-root-url: ../
tags: antd
createTime: 2020-04-01
updateTime: 2020-04-01
keywords: antdesign form值,获取antdesign表单form值
summary: Ant Design 4 中去除了Form.create方法创建Form实例去获取常用的表单方法，那么在类组件中应该如何去得到Form实例呢？。
---

# Antd 4 获取Form字段值

## 类组件获取表单字段值

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

  getValidateValues= async () => {
    const form = this.formRef.current
    // 使用 validateFields 获取验证后字段值
    try {
      const values = await form.validateFields(['name','age'])
      console.log(values)
    } catch (err) {
      console.log(err)
    }
  }

  render() {
    const { Item } = Form
    return (
      <Form ref={this.formRef} onFinish={this.onFinish}>
        <Item name='name' label='姓名' rules={[{required:true,message:'请输入姓名'}]}>
          <Input />
        </Item>
        <Item name='age' label='年龄'>
          <Input />
        </Item>
        <Item>
          <Button type='primary' htmlType='submit'>提交</Button>
          <Button type='link' onClick={this.getValues}>非 Submit 方式（不验证）</Button>
          <Button type='link' onClick={this.getValidateValues}>非 Submit 方式（验证）</Button>
        </Item>
      </Form>
    )
  }
}

export default Example
```

上诉就是 `Antd 4` 中怎么在类组件中获得表单组件的值，主要就是去除了 `Form.create` 后的一些变化。

## 补充

通过 `Ref` 获得实例后得到 `getFieldValue` 获取单个字段值、`getFieldsValue` 获取多个字段值、`validateFields` 获取验证后字段值等，使用这些方法主动去得到表单的值。

`Form` 组件的 `onFinish` 属性绑定的方法，在触发表单提交的操作时会进行调用，并传入字段的值作为参数。这个方法会对表单的 `rules` 规则进行验证。

`Form` 实例的 `getFieldValue` 和 `getFieldsValue` 方法获取表单的字段值时不会对 `rules` 规则进行验证。需要主动获取表单字段值并进行 `rules` 验证就需要用到 `validateFields` 方法，它的返回值时一个 `Promise` 对象。



