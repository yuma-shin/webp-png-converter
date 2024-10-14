
import React from 'react'
import DOM from 'react-dom/client'
import App from './App'


const host = document
  .getElementById(`root`)

if( ! host )
  throw `Host element is missing!`


const node = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
)


DOM
.createRoot(host)
.render(node)
