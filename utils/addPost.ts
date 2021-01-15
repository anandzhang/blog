import fs from 'fs/promises'
import path from 'path'
import mongoose from 'mongoose'
import Post from '../models/post'
import Database from './Database'

Database.connect(async () => {
  await Post.deleteMany()

  try {
    const files = await readFileInDir('posts')
    console.log('result', files)
  } catch (error) {
    console.log(error)
  }

  mongoose.disconnect()
})

const readFileInDir = async (dirPath: string) => {
  const files: string[] = []
  const dir = await fs.readdir(dirPath, { withFileTypes: true })
  for (const dirent of dir) {
    const { name } = dirent
    // 跳过 images 目录
    if (name === 'images') continue
    if (dirent.isDirectory()) {
      const subFiles = await readFileInDir(path.join(dirPath, name))
      console.log(subFiles)
      files.concat(subFiles)
    } else if (path.extname(name) === '.md') {
      files.push(name)
    }
  }
  return files
}
