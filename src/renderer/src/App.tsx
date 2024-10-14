import React, { useState } from 'react';
import { Button, Typography, TextField, Box, Container, Alert, CircularProgress, Radio, RadioGroup, FormControlLabel, FormLabel, FormControl, Select , MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next'

import '../../preload/Types'
import './I18n'


const { electron } = window


const App = () => {

  const { i18n , t } = useTranslation('Conversion')

  const [folderPath, setFolderPath] = useState< null | string >(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversionType, setConversionType] = useState('webp-to-png');  // 変換タイプの状態管理
  const [removeFile, setRemoveFile] = useState("false")

  const selectFolder = async () => {
    const folder = await electron.selectFolder();  // preload経由でIPC通信
    setFolderPath( folder ?? null );
  };

  const convertFiles = async () => {

    if( ! folderPath )
      return

    setIsLoading(true)
    const result = await window.electron.convertWebPToPNG(folderPath, conversionType, removeFile);  // IPC通信
    setIsLoading(false)
    setMessage(result);
  };

  return (
    <Container maxWidth="sm">
      <Select
        value = { i18n.language }
        onChange = { ( event ) => {

          const language = event.target.value

          i18n.changeLanguage(language)
        }}
      >
        <MenuItem value={'jp'}>JP</MenuItem>
        <MenuItem value={'en'}>EN</MenuItem>
      </Select>
      <Box my={4} textAlign="center">
        <Typography variant="h4" gutterBottom>
          WebP - PNG Converter
        </Typography>

        <Button variant="contained" color="primary" onClick={selectFolder} disabled={isLoading}>
          { t('Folder.Select') }
        </Button>

        <Box my={2}>
          <TextField
            fullWidth
            variant="outlined"
            label={ t('Folder.Label') }
            value={folderPath ?? t('Folder.Placeholder') }
            aria-readonly = 'true'
            aria-disabled = 'true'
            disabled = { true }
          />
        </Box>

        <Box my={2}>
          <FormControl>
            <FormLabel component="legend">
              { t('Type.Heading') }
            </FormLabel>
            <RadioGroup
              row
              value={conversionType}
              onChange={(e) => setConversionType(e.target.value)}
              style={{ width: 'auto' }}
            >
              <FormControlLabel value="webp-to-png" control={<Radio />} label="WebP → PNG" />
              <FormControlLabel value="png-to-webp" control={<Radio />} label="PNG → WebP" />
            </RadioGroup>
          </FormControl>
        </Box>

        <Box my={2}>
          <FormControl>
            <FormLabel
              children = { t('Cleanup.Heading') }
              component = 'legend'
            />
            <RadioGroup
              row
              value={removeFile}
              onChange={(e) => setRemoveFile(e.target.value)}
              style={{ width: 'auto' }}
            >
              <FormControlLabel value="true" control={<Radio />} label="True" />
              <FormControlLabel value="false" control={<Radio />} label="False" />
            </RadioGroup>
          </FormControl>
        </Box>


        <Button
          variant="contained"
          color="secondary"
          onClick={convertFiles}
          disabled={isLoading || ! folderPath }
        >
          { t('Convert') }
        </Button>

        <Box my={2}>
          {isLoading && <CircularProgress />}

          {!isLoading && message && (
            <Alert severity={message.includes('エラー') ? 'error' : 'success'}>
              {message}
            </Alert>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default App;
