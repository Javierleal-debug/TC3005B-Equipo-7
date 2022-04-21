import './App.scss'
import { Routes, Route } from 'react-router-dom'

import { Content, Theme } from 'carbon-components-react'

import Header from './components/header'
import LandingPage from './pages/LandingPage/LandingPage'
import Devices from './pages/Devices/Devices'
import Login from './pages/Login'
import Details from './pages/Details/Details'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <>
      <Theme>
        <Header />
      </Theme>
      <Content className="page-area">
        <Routes>
          <Route exact path="/" element={<LandingPage />} />
          <Route exact path="/devices" element={<Devices />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/details" element={<Details />} />
          <Route exact path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Content>
    </>
  )
}

export default App
