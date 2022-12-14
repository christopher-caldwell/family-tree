import { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { CssBaseline } from '@mui/material'

import { App } from './App'
import './main.css'

ReactDOM.render(
  <StrictMode>
    <CssBaseline />
    <App />
  </StrictMode>,
  document.getElementById('root')
)
