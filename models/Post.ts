import { Schema, model, Document } from 'mongoose'

const stringRequired = { type: String, required: true }
const postSchema: Schema = new Schema({
  no: stringRequired,
  title: stringRequired,
  keywords: stringRequired,
  summary: String,
  category: stringRequired,
  requestPath: stringRequired,
  tags: Array,
  createTime: stringRequired,
  updateTime: stringRequired,
  content: stringRequired
})

interface IPost extends Document {
  no: string,
  title: string,
  keywords: string,
  summary?: string,
  category: string,
  requestPath: string,
  tags: string[],
  createTime: string,
  updateTime: string,
  content: string
}

const Post = model<IPost>('Post', postSchema)

export default Post
