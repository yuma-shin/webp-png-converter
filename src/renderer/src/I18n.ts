import { initReactI18next } from 'react-i18next'

import * as en from '../Locales/en.json'
import * as jp from '../Locales/jp.json'

import i18n from 'i18next'


i18n
.use(initReactI18next)
.init({

  resources : { en, jp } ,
  lng : 'jp',

  interpolation : {
    escapeValue : false
  }
})


export default i18n
