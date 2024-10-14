
export { Component as App }

import React, { useState } from 'react';
import { Button, Typography, TextField, Box, ToggleButtonGroup , ToggleButton , Container, Alert, CircularProgress, Radio, RadioGroup, FormControlLabel, FormLabel, FormControl, Select , MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next'
import { OutputFormat } from '../../preload/Types'

import '../../preload/Types'
import './I18n'
import { FormatSelector } from '../Components/FormatSelector';


const { electron } = window


function Component (){

  const { i18n , t } = useTranslation('Conversion')

  const [ folderPath , setFolderPath ] = useState< null | string >(null)
  const [ removeFile , setRemoveFile ] = useState(false)
  const [ isLoading , setIsLoading ] = useState(false)
  const [ message , setMessage ] = useState('')

  const [ format , setFormat ] =
    useState<OutputFormat>('webp')

  const selectFolder = async () => {
    const folder = await electron.selectFolder()  // preload経由でIPC通信
    setFolderPath( folder ?? null )
  }

  const convertFiles = async () => {

    if( ! folderPath )
      return

    setIsLoading(true)

    const result = await electron
      .convertWebPToPNG(folderPath,format,removeFile)  // IPC通信

    setIsLoading(false)
    setMessage(result)
  }

  return (
    <Container maxWidth = 'sm' >

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

      <Box
        textAlign = 'center'
        my = { 4 }
      >

        <Typography
          gutterBottom = { true }
          children = { `WebP - PNG Converter` }
          variant = 'h4'
        />

        <Button
          children = { t('Folder.Select') }
          disabled = { isLoading }
          onClick = { selectFolder }
          variant = 'contained'
          color = 'primary'
        />

        <Box my = { 2 } >
          <TextField
            aria-readonly = 'true'
            aria-disabled = 'true'
            fullWidth = { true }
            disabled = { true }
            variant = 'outlined'
            value = { folderPath ?? t('Folder.Placeholder') }
            label = { t('Folder.Label') }
          />
        </Box>

        <FormatSelector
          onChange = { setFormat }
          value = { format }
        />

        <Box my = { 2 } >
          <FormControl>

            <FormLabel
              component = 'legend'
              children = { t('Cleanup.Heading') }
            />

            <RadioGroup
              onChange = { ( event ) => setRemoveFile(event.target.value === 'true') }
              value = { removeFile ? 'true' : 'false' }
              style = {{ width : 'auto' }}
              row = { true }
            >

              <FormControlLabel
                control = { <Radio /> }
                label = 'True'
                value = 'true'
              />

              <FormControlLabel
                control = { <Radio /> }
                label = 'False'
                value = 'false'
              />

            </RadioGroup>
          </FormControl>
        </Box>


        <Button
          children = { t('Convert') }
          disabled = { isLoading || ! folderPath }
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
