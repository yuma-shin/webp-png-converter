export type { OutputFormat }


type OutputFormat =
  | 'webp'
  | 'png'

interface Electron {

  convertWebPToPNG : (
    folder : string ,
    type : OutputFormat ,
    removeFile : boolean
  ) => Promise<string> ,

  selectFolder : () =>
    Promise< undefined | string >
}


declare global {
  var electron : Electron
}
