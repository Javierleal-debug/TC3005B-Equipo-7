import './App.scss'
import { Routes, Route } from 'react-router-dom'

import { Content } from '@carbon/react'

import Header from './components/header'
import LandingPage from './pages/LandingPage/LandingPage'
import Devices from './pages/Devices/Devices'

function App() {
  return (
    <>
      <Header />
      <Content className="page-area">
        <Routes>
          <Route exact path="/" element={<LandingPage />} />
          <Route exact path="/devices" element={<Devices />} />
        </Routes>
      </Content>
    </>
  )
}

export default App
