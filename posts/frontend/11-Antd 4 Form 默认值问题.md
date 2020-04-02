---
typora-root-url: ../
tags: antd
createTime: 2020-04-02
updateTime: 2020-04-02
keywords: antdesign form默认值,antdesign form默认值undefined,为什么antd表单的默认值为undefined
summary: 为什么在Ant Design的Form表单中设置了默认值但是拿到的却是undefined？在学习antd时需要注意Form表单initialValues属性的使用。
---

# Antd 4 Form 默认值问题

## 问题

通过设置 `Input` 、`Select` 这些表单组件的 `defaultValue` 属性值去设置默认值后，`onFinish` 方法获取的值为 `undefined` ，而不是设置的默认值。

这是一个使用 `defaultValue` 的示例：

```jsx
import React, { Component } from 'react'
import { Form, Input, Select, Button } from 'antd'

class Example extends Component {
  onFinish = values => {
    console.log(values)
    // 结果: {name: undefined, gender: undefined}
  }

  render() {
    const { Item } = Form
    const { Option } = Select
    return (
      <Form onFinish={this.onFinish}>
        <Item name='name' label='姓名' >
          <Input defaultValue='Anand Zhang' />
        </Item>
        <Item name='gender' label='性别'>
          <Select defaultValue='0'>
            <Option value='0'>男</Option>
            <Option value='1'>女</Option>
          </Select>
        </Item>
        <Item>
          <Button type='primary' htmlType='submit'>提交</Button>
        </Item>
      </Form>
    )
  }
}

export default Example
```

## 解决方法

使用 `Form` 组件上的 `initialValues` 属性去设置表单字段的默认值，`initialValues` 属性值的类型为对象。

```jsx
<Form
  onFinish={this.onFinish}
  initialValues={{
    name: 'Anand Zhang',
    gender: '0'
  }}
>
  <Item name='name' label='姓名' >
    <Input />
  </Item>
  <Item name='gender' label='性别'>
    <Select>
      <Option value='0'>男</Option>
      <Option value='1'>女</Option>
    </Select>
  </Item>
  <Item>
    <Button type='primary' htmlType='submit'>提交</Button>
  </Item>
</Form>
```

`console` 打印结果为：`{name: "Anand Zhang", gender: "0"}` ，获得了默认值。总之学习使用 `Antd` 时需要注意使用`Form` 组件的 `initialValues` 去设置表单字段的默认值。