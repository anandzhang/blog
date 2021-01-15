import fs from 'fs/promises'
import path from 'path'
import mongoose from 'mongoose'
import Post from '../models/post'
import Database from './Database'
import MarkdownParser from './MarkdownParser'

Database.connect(async () => {
  await Post.deleteMany({})

  try {
    const files = await readFileInDir('posts')
    for (const file of files) {
      const [no, title] = parseFilename(file.name)
      const category = path.basename(file.directory)
      const requestPath = path.resolve('/', file.directory, no)
      const mdParser = new MarkdownParser(file.path)
      const fields = mdParser.parseYAMLFrontMatter()
      const content = mdParser.parseContent(requestPath)
      await Post.create({
        no,
        title,
        category,
        requestPath,
        content,
        ...fields
      })
    }
  } catch (error) {
    console.log(error)
  }

  mongoose.disconnect()
})

interface IFile {
  name: string,
  directory: string,
  path: string
}

const readFileInDir = async (dirPath: string) => {
  const files: IFile[] = []
  const dir = await fs.readdir(dirPath, { withFileTypes: true })
  for (const dirent of dir) {
    const { name } = dirent
    // 跳过 images 目录
    if (name === 'images') continue
    if (dirent.isDirectory()) {
      const subFiles = await readFileInDir(path.join(dirPath, name))
      files.splice(0, 0, ...subFiles)
    } else if (path.extname(name) === '.md') {
      files.push({
        name,
        directory: dirPath,
        path: path.join(dirPath, name)
      })
    }
  }
  return files
}

const parseFilename = (filename: string) => {
  const extname = path.extname(filename)
  return filename.replace(extname, '').split('-')
}
