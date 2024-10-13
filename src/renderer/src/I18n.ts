import { initReactI18next } from 'react-i18next'

import * as en from '../Locales/en.json'
import * as jp from '../Locales/jp.json'

import LanguageDetector from 'i18next-browser-languagedetector'
import I18n from 'i18next'


I18n
.use(LanguageDetector)
.use(initReactI18next)
.init({

  resources : { en , jp } ,

  fallbackLng : 'en' ,
  defaultNS : 'common' ,

  interpolation : {
    escapeValue : false
  }
})


export default I18n
