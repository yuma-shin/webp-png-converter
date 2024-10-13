import { contextBridge, ipcRenderer } from 'electron'

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', {
      selectFolder: () => ipcRenderer.invoke('select-folder'),
      convertWebPToPNG: (folderPath, conversionType, removeFile) =>
        ipcRenderer.invoke('convert-files', folderPath, conversionType, removeFile)
    })
  } catch (error) {
    console.error(error)
  }
}
