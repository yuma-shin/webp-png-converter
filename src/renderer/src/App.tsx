
export { Component as App }

import { Button, Typography , Box , Container, Alert, CircularProgress, Radio, RadioGroup, FormControlLabel, FormLabel, FormControl, Select , MenuItem } from '@mui/material';
import { FormatSelector } from '../Components/FormatSelector'
import { useTranslation } from 'react-i18next'
import { FolderChooser } from '../Components/FolderChooser'
import { OutputFormat } from '../../preload/Types'
import { useState } from 'react'

import '../../preload/Types'
import './I18n'
import { CleanupSelector } from '../Components/CleanupSelector';



const { electron } = window


function Component (){

  const { i18n , t } = useTranslation('Conversion')

  const [ isLoading , setIsLoading ] = useState(false)
  const [ message , setMessage ] = useState('')

  const [ format , setFormat ] =
    useState<OutputFormat>('webp')

  const [ folder , setFolder ] =
    useState< null | string >(null)

  const [ cleanup , setCleanup ] =
    useState(false)


  const convertFiles = async () => {

    if( ! folder )
      return

    setIsLoading(true)

    const result = await electron
      .convertWebPToPNG(folder,format,cleanup)  // IPC通信

    setIsLoading(false)
    setMessage(result)
  }

  return (
    <Container maxWidth = 'sm' >

      <Box sx={{display : "flex", justifyContent : "space-between", alignItems : "center"}} my = { 4 }>
        
        <Typography
            children = { `WebP - PNG Converter` }
            variant = 'h4'
          />

        <Select
          value = { i18n.language }
          onChange = { ( event ) => {

            const language = event.target.value

            i18n.changeLanguage(language)
          }}
        >

          <MenuItem
            children = { 'JP' }
            value = { 'jp' }
          />

          <MenuItem
            children = { 'EN' }
            value = { 'en' }
          />

        </Select>
      </Box>

      <Box
        textAlign = 'center'
        my = { 6 }
      >

        <FolderChooser
          isDisabled = { isLoading }
          onChange = { setFolder }
          value = { folder }
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-around' }} my = { 2 }>

          <FormatSelector
            isDisabled = { isLoading }
            onChange = { setFormat }
            value = { format }
          />

          <CleanupSelector
            isDisabled = { isLoading }
            onChange = { setCleanup }
            value = { cleanup }
          />

        </Box>

        <Button
          children = { t('Convert') }
          disabled = { isLoading || ! folder }
          onClick = { convertFiles }
          variant = 'contained'
          color = 'secondary'
        />

        <Box my = { 2 } >

          { isLoading && <CircularProgress /> }

          { ! isLoading && message && (
            <Alert
              children = { message }
              severity = { message.includes('エラー') ? 'error' : 'success' }
            />
          )}

        </Box>

      </Box>
    </Container>
  )
}
