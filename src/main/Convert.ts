
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

  await sharp(input)
    .toFormat(format)
    .toFile(output)

  if( ! cleanup )
    return

  await wait(500)

  // 元のファイルを削除
  await unlink(input)
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

    const input = join(folder,file)

    // サブフォルダも再帰的に処理

    if( statSync(input).isDirectory() )
      return convertFiles({
        cleanup , format ,
        folder : input
      })


    const extension = extname(file)

    const filename = basename(file,extension)

    const name = `${ filename }.${ format }`

    const output = join(outputFolder,name)

    return convertFile({
      cleanup , output ,
      format , input
    })
  })

  await Promise.all(tasks)
}


async function wait (
  milliseconds : number
){
  await new Promise(( resolve ) =>
    setTimeout(resolve,milliseconds))
}
