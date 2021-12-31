import { exec } from 'child_process'
import { promisify } from 'util'
// import webpack from 'webpack'
// webpack({})

import pug from 'pug'
import path from 'path'
import fs from 'fs/promises'

// 生成主页 HTML
const html = pug.renderFile(path.resolve(__dirname, '../views/index.pug'))

// 生成

fs.writeFile(path.resolve(__dirname, '../build/test.html'), html)

// (
//   async () => {
//     try {
//       await promisify(exec)('yarn webpack')
//       await promisify(exec)('cd public/dist/ && ls | grep .js | grep -v bundle.js | xargs rm')

//       await promisify(exec)('rm -rf build')
//       await promisify(exec)('yarn tsc')
//       await promisify(exec)('cp -r public views build')
//       // 图片资源
//       await promisify(exec)('mkdir -p build/posts/images')
//       await promisify(exec)('cp -r posts/images build/posts')
//     } catch (error) {
//       console.log(error)
//     }
//   }
// )()
