export {}

declare global {
  var electron: {
    convertWebPToPNG: (folder: string, type: string, removeFile: boolean) => string
    selectFolder: () => undefined | string
  }
}
