
export {}

declare global {
  var electron : {

    convertWebPToPNG : (
      folder : string ,
      type : string ,
      removeFile : string
    ) => string ,

    selectFolder : () =>
      undefined | string
  }
}
