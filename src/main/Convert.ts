
export { convertFiles }

import type { OutputFormat } from '../preload/Types'

import { existsSync , mkdirSync , statSync } from 'fs'
import { join, extname, basename } from 'path'
import { unlink , readdir } from 'fs/promises'
import { FormatEnum } from 'sharp'

import sharp from 'sharp'


// ファイルの変換関数
const convertFile = async (
  filePath: string,
  outputFilePath: string,
  format: keyof FormatEnum,
  removeFile: boolean
) => {
  await sharp(filePath).toFormat(format).toFile(outputFilePath)
  if (removeFile) {
    await new Promise((resolve) => setTimeout(resolve, 500)) // 500msの遅延
    await unlink(filePath) // 元のファイルを削除
  }
}

const convertFiles = async (
  folderPath: string,
  conversionType: OutputFormat,
  removeFile: boolean
) => {
  const files = await readdir(folderPath)
  if (!removeFile) {
    if (conversionType === 'png') {
      if (!existsSync(folderPath + '/png')) {
        mkdirSync(folderPath + '/png', { recursive: true })
      }
    } else if (conversionType === 'webp') {
      if (!existsSync(folderPath + '/webp')) {
        mkdirSync(folderPath + '/webp', { recursive: true })
      }
    }
    const tasks = files.map(async (file) => {
      const filePath = join(folderPath, file)
      if (statSync(filePath).isDirectory()) {
        return convertFiles(filePath, conversionType, removeFile) // サブフォルダも再帰的に処理
      } else {
        if (conversionType === 'png' && extname(file) === '.webp') {
          const outputFilePath = join(folderPath + '/png', basename(file, '.webp') + '.png')
          return convertFile(filePath, outputFilePath, 'png', removeFile)
        } else if (conversionType === 'webp' && extname(file) === '.png') {
          const outputFilePath = join(folderPath + '/webp', basename(file, '.png') + '.webp')
          return convertFile(filePath, outputFilePath, 'webp', removeFile)
        }
      }
    })
    await Promise.all(tasks)
  } else if (removeFile) {
    const tasks = files.map(async (file) => {
      const filePath = join(folderPath, file)
      if (statSync(filePath).isDirectory()) {
        return convertFiles(filePath, conversionType, removeFile) // サブフォルダも再帰的に処理
      } else {
        if (conversionType === 'png' && extname(file) === '.webp') {
          const outputFilePath = join(folderPath, basename(file, '.webp') + '.png')
          return convertFile(filePath, outputFilePath, 'png', removeFile)
        } else if (conversionType === 'webp' && extname(file) === '.png') {
          const outputFilePath = join(folderPath, basename(file, '.png') + '.webp')
          return convertFile(filePath, outputFilePath, 'webp', removeFile)
        }
      }
    })
    await Promise.all(tasks)
  }
}
