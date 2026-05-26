/**
 * 打包工具，将构建产物打包为 tar.gz 格式，输出文件为：web.tar.gz
 */
import { createWriteStream } from 'fs'
import path from 'path'
import archiver from 'archiver'

const output = createWriteStream(path.resolve('./web.tar.gz'))
const archive = archiver('tar', { gzip: true, gzipOptions: { level: 9 } })

archive.pipe(output)
archive.directory(path.resolve('.output'), '.output', null)
archive.directory(path.resolve('distribution', 'bin'), 'bin', null)
archive.file(path.resolve('ecosystem.config.js'), { name: 'ecosystem.config.js' })
archive.file(path.resolve('nuxt.config.ts'), { name: 'nuxt.config.ts' })
archive.file(path.resolve('package.json'), { name: 'package.json' })

archive.finalize().then(() => {
  console.log('打包成功，请查看根目录下的：web.tar.gz')
})
