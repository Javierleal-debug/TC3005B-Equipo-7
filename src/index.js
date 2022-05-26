import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.scss'
import App from './App'
import reportWebVitals from './reportWebVitals'

import { GlobalTheme } from 'carbon-components-react'
import { SessionDataProvider } from './global-context'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  //<React.StrictMode>
  <HashRouter>
    <GlobalTheme>
      <SessionDataProvider>
        <App />
      </SessionDataProvider>
    </GlobalTheme>
  </HashRouter>
  //</React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
