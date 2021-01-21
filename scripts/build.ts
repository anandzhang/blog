import { exec } from 'child_process'
import { promisify } from 'util'

(
  async () => {
    try {
      await promisify(exec)('yarn webpack')
      await promisify(exec)('cd public/dist/ && ls | grep .js | grep -v bundle.js | xargs rm')

      await promisify(exec)('rm -rf build')
      await promisify(exec)('yarn tsc')
      await promisify(exec)('cp -r public views build')
      // 图片资源
      await promisify(exec)('mkdir -p build/posts/images')
      await promisify(exec)('cp -r posts/images build/posts')
    } catch (error) {
      console.log(error)
    }
  }
)()
