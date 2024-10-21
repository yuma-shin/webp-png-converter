
export { convertFiles }

import type { OutputFormat } from '../preload/Types'

import { existsSync , mkdirSync , statSync } from 'fs'
import { join, extname, basename } from 'path'
import { unlink , readdir } from 'fs/promises'

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


  const outputFolder = join(folder,format)

  if( ! existsSync(outputFolder) )
    mkdirSync(outputFolder,{ recursive: true })


  const files = await readdir(folder)

  const tasks = files.map( async ( file ) => {

    const extension = extname(file)

    const filename = basename(file,extension)

    const path = join(folder,file)

    // サブフォルダも再帰的に処理
    if( statSync(path).isDirectory() )
      return convertFiles({
        cleanup , format ,
        folder : path
      })

    const name = `${ filename }.${ format }`

    const output = join(folder,format,name)

    return convertFile({
      cleanup , output , format ,
      input : path
    })
  })

  await Promise.all(tasks)
}
