---
typora-root-url: ../
tags: antd
createTime: 2020-04-18
updateTime: 2020-04-18
keywords: ant design upload怎么用,antd怎么上传图片,antd表单怎么拿到upload值
summary: Ant Design的Upload组件怎么上传图片到服务端？在Form组件中使用Upload怎么自动收集这个字段的数据？
---

# Antd 4 Upload 图片上传（前端篇）

## 简介

记录一下第一次使用 `Ant Design` 的 `Upload` 组件上传图片到后端服务器的基本流程和思路。

前端使用了 `React + Antd` ，后端使用 `Nodejs` 的`Express` 。

主要介绍 `Antd` 中 `Upload` 组件的照片墙，也就是上传多张图片。

![example](/images/frontend/14/example.png)

`Ant Design` 官方 `Upload` 教程地址：[Antd Upload 组件](https://ant.design/components/upload-cn/)

## 实现

### 1. 简单的render

```jsx
import React, { Component } from 'react'
import { Card, Upload } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

class Example extends Component {

  render() {
    return (
      <Card title='图片上传'>
        <Upload listType='picture-card'>
          <PlusOutlined />
          <div style={{ marginTop: 8, color: '#666' }}>上传图片</div>
        </Upload>
      </Card>
    )
  }
}

export default Example
```

也就是先做一个基本的 `Upload` 组件样子：

![1](/images/frontend/14/1.png)

`Card` 组件是为了案例的样式效果好一点。现在的 `Upload` 组件还不具有上传的功能，只是简单的使用，`listType` 属性是 `Upload` 组件的显示效果，有 `picture-card` 、`picture` 、`text` 这三个属性值，对应的效果可在 `Antd` 官网查看。

### 2. 上传功能

给 `Upload` 组件添加 `action` 属性，就可以利用 `FormData` 表格数据的格式提交到后端服务器地址。

```jsx
// 省略部分代码

// 后端API
const SERVER_URL = 'http://localhost:8000'
const UPLOAD_URL = `${SERVER_URL}/upload`

// render 中部分代码
<Upload
  listType='picture-card'
  action={UPLOAD_URL}
>
  <PlusOutlined />
  <div style={{ marginTop: 8, color: '#666' }}>上传图片</div>
</Upload>

```

### 3. 查看图片

1. 添加一个用于查看图片的 `Modal` 对话框组件，设置组件的 `footer` 属性为 `null ` 来隐藏对话框对应的确认和取消按钮；然后在 `Modal` 组件中包含一个原生的 `img` 标签用来显示图片，设置对应的 `src` 和 `alt` 属性。
2. 在 `Upload` 组件中设置 `onPreview` 属性，用户点击查看图片按钮就会触发这个函数。在 `onPreview` 中设置组件的几个状态。

![onPreview](/images/frontend/14/onPreview.png)

```jsx
import React, { Component } from 'react'
import { Card, Upload, Modal } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

// 后端API
const SERVER_URL = 'http://localhost:8000'
const UPLOAD_URL = `${SERVER_URL}/upload`

class Example extends Component {
  state = {
    previewVisible: false,
    previewImage: '',
    previewImageName: ''
  }

  // 显示用于查看图片的 Modal 组件
  showPreview = file => {
    this.setState({
      previewVisible: true,
      previewImage: file.url || file.thumbUrl,
      previewImageName: file.name
    })
  }

  // 隐藏用于查看图片的 Modal 组件
  hidePreview = () => {
    this.setState({
      previewVisible: false
    })
  }

  render() {
    const { previewVisible, previewImage, previewImageName } = this.state
    return (
      <Card title='图片上传'>
        <Upload
          listType='picture-card'
          action={UPLOAD_URL}
          onPreview={this.showPreview}
        >
          <PlusOutlined />
          <div style={{ marginTop: 8, color: '#666' }}>上传图片</div>
        </Upload>
        {/* 用于查看图片的 Modal 对话框 */}
        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={this.hidePreview}
        >
          <img
            src={previewImage}
            alt={previewImageName}
            style={{ width: '100%' }}
          />
        </Modal>
      </Card>
    )
  }
}

export default Example
```

### 4. 处理服务端上传结果

前面实现的上传图片，虽然通过 `action` 属性向服务端发送了请求，但是我们并没有对服务端返回的上传结果进行处理。也就是说，我们没有将服务端的结果反馈给用户，用户并不清楚服务端是否也上传成功，图片是否成功存在服务端。

首先给 `Upload` 组件添加 `onChange` 属性：`onChange={this.handleChange}` 。然后我们定义 `handleChange` 函数：

```javascript
// 处理图片上传
handleChange = ({ file, fileList }) => {
  const { status, response } = file
  // 上传完成？
  if (status === 'done') {
    // 服务端返回JSON：{ok: true/false, message: "", data: ""}
    const { ok, message: msg, data } = response
    if (ok) {
      // antd的message方法
      message.success(msg)
    } else {
      message.error(msg)
    }
  }
  this.setState({ fileList })
}
```

那么这样就有了简单的反馈提示：

![upload-image](/images/frontend/14/upload-image.gif)

### 5. 优化 fileList（可选）

上传了图片后，通过 `React` 开发工具插件看看组件状态 `state` ，`fileList` 中添加了完整的 `file` 对象，我觉得没这个必要吧，因为上传完成后已经用不到里面的一些属性，那么我就在 `onChange` 属性对应的函数中手动做个简单的对象添加到 `fileLIst` 吧。

![fileList-state](/images/frontend/14/fileList-state.png)

写一个 `optimizeFileList` 函数吧：

```javascript
// fileList中file文件对象的属性太多了，上传完成后只留必要的属性
optimizeFileList = (data, fileList) => {
  // 后端数据中取得图片的名称和url地址
  const { name, url } = data
  // 去除上传完成后自动添加到fileList的file对象
  const file = fileList.pop()
  // 拿到需要的uid
  const { uid } = file
  // 创建一个只有必须属性的file对象
  const newFile = { uid, name, url: `${SERVER_URL}/${url}` }
  fileList.push(newFile)
}

// 处理图片上传
handleChange = ({ file, fileList }) => {
  const { status, response } = file
  // 上传成功？
  if (status === 'done') {
    const { ok, message: msg, data } = response
    if (ok) {
      this.optimizeFileList(data, fileList)
      message.success(msg)
    } else {
      message.error(msg)
    }
  }
  this.setState({ fileList })
}
```

现在上传图片后我们看一下组件的 `state` ，只保留了 `uid` 、 `name` 、`url`：

![optimize-fileList](/images/frontend/14/optimize-fileList.png)

### 6. 删除功能

点击删除时不只是清除 `state` 就完了，还需要删除服务端存的图片。设置 `onRemove` 属性绑定 `handleRemove` 函数，在函数里向后端发送删除请求，根据后端返回的结果再做处理。

```javascript
// 添加一个后端API
const DELETE_URL = `${SERVER_URL}/delete`

// 类组件中：
handleRemove = async file => {
  // 有url属性说明上传到了服务器
  const { url } = file
  if (url) {
    const path = url.replace(`${SERVER_URL}/`, '')
    const response = await fetch(DELETE_URL, {
      method: 'delete',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ path })
    })
    const { ok, message: msg } = await response.json()
    if (ok) {
      message.success(msg)
    } else {
      message.error(msg)
      return false
    }
  }
}
```

## 补充：Form自动收集Upload数据

在 `Form` 组件中使用 `Uploda` 组件让用户上传图片，在表单提交的时候我们也想让 `Form` 自动收集到 `Upload` 组件的数据，我们需要配合 `Form` 组件提供给子组件 `props` 中的 `onChange` 方法来完成。

### 1. 修改 Upload 组件

在 `Upload` 组件的 `onChange` 属性绑定的 `handleChange` 方法中调用 `props` 的 `onChange` 方法：

```javascript
handleChange = ({ file, fileList }) => {
  const { status, response } = file
  // 上传成功？
  if (status === 'done') {
    const { ok, message: msg, data } = response
    if (ok) {
      this.optimizeFileList(data, fileList)
      // 调用 onChange 方法
      this.props.onChange(fileList)
      message.success(msg)
    } else {
      message.error(msg)
    }
  }
  this.setState({ fileList })
}
```

### 2. 在 Form 组件中使用 Upload

```jsx
import React, { Component } from 'react'
import { Card, Form, Input, Button } from 'antd'
// 引入写好的Upload组件
import UploadImage from './UploadImage'

const { Item } = Form

class FormExample extends Component {
  handleSubmit = values => {
    console.log(values)
  }

  render() {
    return (
      <Card title='表单案例'>
        <Form onFinish={this.handleSubmit}>
          <Item label='商品名称' name='name'>
            <Input />
          </Item>
          <Item label='商品图片' name='images'>
            <UploadImage />
          </Item>
          <Button type='primary' htmlType='submit'>提交</Button>
        </Form>
      </Card>
    )
  }
}

export default FormExample
```

提交数据我们就收集到 `Upload` 组件的 `fileList` 数据，然后自己用需要的数据提交给后端就OK。

![form-example](/images/frontend/14/form-example.png)