
export { convertFiles }

import type { OutputFormat } from '../preload/Types'

import { basename , relative , dirname , extname , join } from 'path'
import { existsSync , mkdirSync , statSync } from 'fs'
import { unlink , readdir , stat } from 'fs/promises'

import sharp from 'sharp'


const DryRun = true


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

  if( DryRun ){
    console.debug('Convert',args)
    return
  }

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


  const paths = await collectPaths(args)

  if( DryRun )
    console.debug('Paths',paths)

  for ( const input of paths ){

    const extension = extname(input)

    const directory = dirname(input)

    const relation = relative(folder,directory)

    const filename = basename(input,extension)

    const name = `${ filename }.${ format }`

    const output = join(outputFolder,relation,name)

    await convertFile({
      cleanup , output ,
      format , input
    })
  }
}


async function collectPaths (
  args : ConvertFilesArgs
){

  const { folder , format } = args

  const files = new Array<string>
  const paths = new Array<string>

  async function collectFolder (
    folder : string
  ){
    const items = await readdir(folder)

    const absolute = items.map(
      ( item ) => join(folder,item))

    paths.push( ... absolute )
  }

  await collectFolder(folder)

  while ( true ){

    const path = paths.shift()

    if( ! path )
      break

    const extension = extname(path)

    if( extension === `.${ format }` )
      continue

    const stats = await stat(path)

    if( stats.isFile() ){
      files.push(path)
      continue
    }

    if( stats.isDirectory() ){
      await collectFolder(path)
      continue
    }
  }

  return files
}



async function wait (
  milliseconds : number
){
  await new Promise(( resolve ) =>
    setTimeout(resolve,milliseconds))
}
