import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { seedHistory } from './seedData.js'

// Load imported history on a fresh install (does nothing if data already exists).
seedHistory()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
