---
typora-root-url: ../
tags: react,pit
createTime: 2020-2-28
updateTime: 2020-2-28
keywords: react事件函数,react事件函数传值错误
summary: 在学习React开发的过程中，发现写的案例出现了事件函数传值的问题，自己还是需要继续加油啊。
---

# React 事件函数传值问题

> github地址: [react学习案例](https://github.com/anandzhang/microproject-react) ，[问题的issue位置](https://github.com/anandzhang/microproject-react/issues/4) 

发现案例中存在以下问题：

- `/comment` 案例中

  ```jsx
  deleteComment = index => {
    const list = this.state.list
    list.splice(index, 1)
    this.setState({ list })
  }
  // 省略部分代码
  this.state.list.map((item, index) => (
    <Fragment key={index}>
      <dt>{item.name}说：</dt>
      <dd>{item.content} --- <button onClick={this.deleteComment}>删除评论</button></dd>
    </Fragment>
  ))
  ```

  这里既没有使用bind传值，箭头函数传值也不对。

  因为删除评论成功了的，就没有注意，其实删除了的不是想要的index，index根本不对。

- 正在写的 `/comment-plus` 案例中使用上面的方式后，发现了这个问题。

  但是：出现了新的理解错误 

  ```jsx
  this.props.comments.map((item, index) => (
    <li key={index}>
      <p className='name'>{item.name}说：</p>
      <p className='content'>{item.content}</p>
      <div className='delete' onClick={(index) => this.handleDelete(index)}>删除</div>
    </li>
  ))
  ```

  在箭头函数传值时，index传去的是一个Class，而不是所需的索引。

  **寻找原因：**

  ```jsx
  this.props.comments.map((item, index) => {
    console.log(index)
    return (
      <li key={index}>
        <p className='name'>{item.name}说：</p>
        <p className='content'>{item.content}</p>
        <div className='delete' onClick={(index) => {
          console.log(index)
          console.log(index.target)
          // this.handleDelete(index)
        }}>删除</div>
      </li>
    )
  })
  ```

  **结果：**

  ![image](https://user-images.githubusercontent.com/33146742/75539691-a5498400-5a55-11ea-8c2c-4797f21bcd75.png)

  应该改为这样：

  ```jsx
  <div className='delete' onClick={() => this.handleDelete(index)}>删除</div>
  ```

在学习过程中还需要更加细心。