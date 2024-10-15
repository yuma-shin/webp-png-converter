
export { Component as CleanupSelector }

import { useTranslation } from 'react-i18next'
import { OutputFormat } from '../../preload/Types'

import {
  ToggleButtonGroup, ToggleButton,
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
        style = {{
          alignItems : 'center'
        }}
      >

        <FormLabel
          component = 'legend'
          children = { t('Cleanup.Heading') }
        />

        <ToggleButtonGroup
          aria-label = 'Remove File'
          exclusive = { true }
          onChange = { ( _ , value ) => onChange( value === true ) }
          disabled = { isDisabled }
          color = 'primary'
          value = { value }
          style={{ marginTop : 4 }}
        >

          <ToggleButton
            children = { `TRUE` }
            value = { true }
          />

          <ToggleButton
            children = { `FALSE` }
            value = { false }
          />

        </ToggleButtonGroup>
      </FormControl>
    </Box>
  )
}
