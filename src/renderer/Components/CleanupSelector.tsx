
export { Component as CleanupSelector }

import { useTranslation } from 'react-i18next'
import { OutputFormat } from '../../preload/Types'

import {
  FormControlLabel , RadioGroup , Radio ,
  FormControl , FormLabel , Box
} from '@mui/material'


interface Args {
  isDisabled : boolean
  onChange : ( value : boolean ) => void
  value : boolean
}


function Component (
  { isDisabled , onChange , value } : Args
){

  const { t } = useTranslation('Conversion')

  return (
    <Box my = { 2 } >
      <FormControl
        disabled = { isDisabled }
      >

        <FormLabel
          component = 'legend'
          children = { t('Cleanup.Heading') }
        />

        <RadioGroup
          onChange = { ( _ , value ) => onChange( value === 'true' ) }
          style = {{ width : 'auto' }}
          value = { value }
          row = { true }
        >

          <FormControlLabel
            control = { <Radio /> }
            value = { true }
            label = 'True'
          />

          <FormControlLabel
            control = { <Radio /> }
            value = { false }
            label = 'False'
          />

        </RadioGroup>
      </FormControl>
    </Box>
  )
}
