/**
 * 打包工具，方便将打包后的dist进行管理，打包后的文件为：web.zip
 */
import { createWriteStream } from 'fs'
import path from 'path'
import archiver from 'archiver'

const output = createWriteStream(path.resolve('./web.zip'))
const archive = archiver('zip', { zlib: { level: 9 } })

archive.pipe(output)
archive.directory(path.resolve('node_modules'), 'node_modules', null)
archive.directory(path.resolve('.output'), '.output', null)
archive.directory(path.resolve('distribution', 'bin'), 'bin', null)
archive.file(path.resolve('ecosystem.config.js'), { name: 'ecosystem.config.js' })
archive.file(path.resolve('nuxt.config.ts'), { name: 'nuxt.config.ts' })
archive.file(path.resolve('package.json'), { name: 'package.json' })

archive.finalize().then(() => {
  console.log('打包成功，请查看根目录下的：web.zip')
})
