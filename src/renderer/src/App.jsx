import React, { useState } from 'react';
import { Button, Typography, TextField, Box, Container, Alert, CircularProgress, Radio, RadioGroup, FormControlLabel, FormLabel, FormControl } from '@mui/material';

import './I18n'


const App = () => {
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
          フォルダを選択
        </Button>

        <Box my={2}>
          <TextField
            fullWidth
            variant="outlined"
            label="フォルダパス"
            value={folderPath}
            InputProps={{
              readOnly: true,
            }}
          />
        </Box>

        <Box my={2}>
          <FormControl>
            <FormLabel component="legend">変換タイプを選択</FormLabel>
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
            <FormLabel component="legend" mt={4}>元のファイルを削除</FormLabel>
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
          変換
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
