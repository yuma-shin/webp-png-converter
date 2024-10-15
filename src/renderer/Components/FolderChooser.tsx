
export { Component as FolderChooser }

import { TextField , Button , Box } from '@mui/material'
import { useTranslation } from 'react-i18next'

import SearchIcon from '@mui/icons-material/Search'


interface Args {
  isDisabled : boolean
  onChange : ( value : null | string ) => void
  value : null | string
}


function Component (
  { isDisabled , onChange , value } : Args
){

  const { t } = useTranslation('Conversion')


  const selectFolder = async () => {
    const folder = await electron.selectFolder()
    onChange( folder ?? null )
  }

  return (
    <Box
      textAlign = 'center'
      style = {{ position : 'relative' }}
      my = { 2 }
    >

      <TextField
        aria-readonly = 'true'
        aria-disabled = 'true'
        fullWidth = { true }
        disabled = { true }
        variant = 'outlined'
        value = { value ?? t('Folder.Placeholder') }
        label = { t('Folder.Label') }
      />

      <Button

        aria-description = { t('Folder.Select') }
        children = { <SearchIcon /> }
        disabled = { isDisabled }
        onClick = { selectFolder }
        variant = 'contained'
        color = 'primary'

        style = {{
          translate : '0 -50%' ,
          position : 'absolute' ,
          right : '1rem' ,
          top : '50%'
        }}
      />

    </Box>
  )
}
