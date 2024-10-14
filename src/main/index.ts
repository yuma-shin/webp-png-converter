import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join, extname, basename } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import sharp from 'sharp'
import util from 'util'
import fs from 'fs'

// fs.unlinkをPromise化して非同期処理に対応
const unlink = util.promisify(fs.unlink)
const readdir = util.promisify(fs.readdir)

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.setMenu(null)

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

// ファイルの変換関数
const convertFile = async (filePath, outputFilePath, format, removeFile) => {
  await sharp(filePath).toFormat(format).toFile(outputFilePath)
  if (removeFile == 'true') {
    await new Promise((resolve) => setTimeout(resolve, 500)) // 500msの遅延
    await unlink(filePath) // 元のファイルを削除
  }
}

const convertFiles = async (folderPath, conversionType, removeFile) => {
  const files = await readdir(folderPath)
  if (removeFile == 'false') {
    if (conversionType === 'webp-to-png') {
      if (!fs.existsSync(folderPath + '/png')) {
        fs.mkdirSync(folderPath + '/png', { recursive: true })
      }
    } else if (conversionType === 'png-to-webp') {
      if (!fs.existsSync(folderPath + '/webp')) {
        fs.mkdirSync(folderPath + '/webp', { recursive: true })
      }
    }
    const tasks = files.map(async (file) => {
      const filePath = join(folderPath, file)
      if (fs.statSync(filePath).isDirectory()) {
        return convertFiles(filePath, conversionType, removeFile) // サブフォルダも再帰的に処理
      } else {
        if (conversionType === 'webp-to-png' && extname(file) === '.webp') {
          const outputFilePath = join(folderPath + '/png', basename(file, '.webp') + '.png')
          return convertFile(filePath, outputFilePath, 'png', removeFile)
        } else if (conversionType === 'png-to-webp' && extname(file) === '.png') {
          const outputFilePath = join(folderPath + '/webp', basename(file, '.png') + '.webp')
          return convertFile(filePath, outputFilePath, 'webp', removeFile)
        }
      }
    })
    await Promise.all(tasks)
  } else if (removeFile == 'true') {
    const tasks = files.map(async (file) => {
      const filePath = join(folderPath, file)
      if (fs.statSync(filePath).isDirectory()) {
        return convertFiles(filePath, conversionType, removeFile) // サブフォルダも再帰的に処理
      } else {
        if (conversionType === 'webp-to-png' && extname(file) === '.webp') {
          const outputFilePath = join(folderPath, basename(file, '.webp') + '.png')
          return convertFile(filePath, outputFilePath, 'png', removeFile)
        } else if (conversionType === 'png-to-webp' && extname(file) === '.png') {
          const outputFilePath = join(folderPath, basename(file, '.png') + '.webp')
          return convertFile(filePath, outputFilePath, 'webp', removeFile)
        }
      }
    })
    await Promise.all(tasks)
  }
}

ipcMain.handle('select-folder', async (event) => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  })
  return result.filePaths[0] // 選択されたフォルダのパスを返す
})

ipcMain.handle('convert-files', async (event, folderPath, conversionType, removeFile) => {
  try {
    await convertFiles(folderPath, conversionType, removeFile) // 全てのファイルが変換完了するのを待つ
    return '変換完了しました'
  } catch (error) {
    return `エラーが発生しました: ${error.message}`
  }
})
