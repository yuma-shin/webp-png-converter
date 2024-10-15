
export { Component as FormatSelector }

import { useTranslation } from 'react-i18next'
import { OutputFormat } from '../../preload/Types'

import {
  ToggleButtonGroup , ToggleButton ,
  FormControl , FormLabel , Box
} from '@mui/material'


interface Args {
  isDisabled : boolean
  onChange : ( value : OutputFormat ) => void
  value : OutputFormat
}


function Component (
  { isDisabled , onChange , value } : Args
){

  const { t } = useTranslation('Conversion')

  return (
    <Box my = { 2 } >
      <FormControl
        style = {{
          alignItems : 'center'
        }}
      >

        <FormLabel
          component = 'legend'
          children = { t('Format.Heading') }
        />

        <ToggleButtonGroup
          aria-label = 'Output Format'
          exclusive = { true }
          onChange = { ( _ , format ) => onChange(format) }
          disabled = { isDisabled }
          color = 'primary'
          value = { value }
          style={{ marginTop : 4 }}
        >

          <ToggleButton
            children = { `WEBP` }
            value = 'webp'
          />

          <ToggleButton
            children = { `PNG` }
            value = 'png'
          />

        </ToggleButtonGroup>

      </FormControl>
    </Box>
  )
}
