
export { convertFiles }

import type { OutputFormat } from '../preload/Types'

import { existsSync , mkdirSync , statSync } from 'fs'
import { join, extname, basename } from 'path'
import { unlink , readdir } from 'fs/promises'
import { FormatEnum } from 'sharp'

import sharp from 'sharp'


interface ConvertFileArgs {
  cleanup : boolean
  format : OutputFormat
  output : string
  input : string
}


// ファイルの変換関数
async function convertFile (
  args : ConvertFileArgs
){

  const { cleanup , format , output , input } = args

  await sharp(input).toFormat(format).toFile(output)

  if (cleanup) {
    await new Promise((resolve) => setTimeout(resolve, 500)) // 500msの遅延
    await unlink(input) // 元のファイルを削除
  }
}


interface ConvertFilesArgs {
  cleanup : boolean
  format : OutputFormat
  folder : string
}


async function convertFiles (
  args : ConvertFilesArgs
){

  const { cleanup , format , folder } = args

  const files = await readdir(folder)
  if (!cleanup) {
    if (format === 'png') {
      if (!existsSync(folder + '/png')) {
        mkdirSync(folder + '/png', { recursive: true })
      }
    } else if (format === 'webp') {
      if (!existsSync(folder + '/webp')) {
        mkdirSync(folder + '/webp', { recursive: true })
      }
    }
    const tasks = files.map(async (file) => {
      const filePath = join(folder, file)
      if (statSync(filePath).isDirectory()) {
        return convertFiles({ folder : filePath , format , cleanup }) // サブフォルダも再帰的に処理
      } else {
        if (format === 'png' && extname(file) === '.webp') {
          const outputFilePath = join(folder + '/png', basename(file, '.webp') + '.png')
          return convertFile({
            output : outputFilePath ,
            format : 'png' ,
            input : filePath ,
            cleanup
          })
        } else if (format === 'webp' && extname(file) === '.png') {
          const outputFilePath = join(folder + '/webp', basename(file, '.png') + '.webp')
          return convertFile({
            output : outputFilePath ,
            format : 'webp' ,
            input : filePath ,
            cleanup
        })
        }
      }
    })
    await Promise.all(tasks)
  } else if (cleanup) {
    const tasks = files.map(async (file) => {
      const filePath = join(folder, file)
      if (statSync(filePath).isDirectory()) {
        return convertFiles({ folder : filePath , cleanup , format }) // サブフォルダも再帰的に処理
      } else {
        if (format === 'png' && extname(file) === '.webp') {
          const outputFilePath = join(folder, basename(file, '.webp') + '.png')
          return convertFile({
            input : filePath ,
            output : outputFilePath ,
            format : 'png' ,
            cleanup
          })
        } else if (format === 'webp' && extname(file) === '.png') {
          const outputFilePath = join(folder, basename(file, '.png') + '.webp')
          return convertFile({
            output : outputFilePath ,
            format : 'webp' ,
            input : filePath ,
            cleanup
          })
        }
      }
    })
    await Promise.all(tasks)
  }
}
