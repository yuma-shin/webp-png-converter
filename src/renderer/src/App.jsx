import React, { useState } from 'react';
import { Button, Typography, TextField, Box, Container, Alert, CircularProgress, Radio, RadioGroup, FormControlLabel, FormLabel, FormControl } from '@mui/material';
import { useTranslation } from 'react-i18next'

import './I18n'


const App = () => {

  const { t } = useTranslation('Conversion')

  const [folderPath, setFolderPath] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversionType, setConversionType] = useState('webp-to-png');  // 変換タイプの状態管理
  const [removeFile, setRemoveFile] = useState("false")

  const selectFolder = async () => {
    const folder = await window.electron.selectFolder();  // preload経由でIPC通信
    setFolderPath(folder || 'フォルダが選択されていません');
  };

  const convertFiles = async () => {
    if (folderPath && folderPath !== 'フォルダが選択されていません') {
      setIsLoading(true)
      const result = await window.electron.convertWebPToPNG(folderPath, conversionType, removeFile);  // IPC通信
      setIsLoading(false)
      setMessage(result);
    } else {
      setMessage('フォルダを選択してください');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box my={4} textAlign="center">
        <Typography variant="h4" gutterBottom>
          WebP - PNG Converter
        </Typography>

        <Button variant="contained" color="primary" onClick={selectFolder} disabled={isLoading}>
          { t('Select-Folder') }
        </Button>

        <Box my={2}>
          <TextField
            fullWidth
            variant="outlined"
            label={ t('Folder-Path') }
            value={folderPath}
            InputProps={{
              readOnly: true,
            }}
          />
        </Box>

        <Box my={2}>
          <FormControl>
            <FormLabel component="legend">
              { t('Select-Type') }
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
            <FormLabel component="legend" mt={4}>
              { t('Delete-Original') }
            </FormLabel>
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


        <Button variant="contained" color="secondary" onClick={convertFiles} disabled={isLoading}>
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
