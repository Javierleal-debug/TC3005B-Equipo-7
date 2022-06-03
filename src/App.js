import './App.scss'
import { Routes, Route, useLocation } from 'react-router-dom'

import { Content, Theme } from 'carbon-components-react'

import Header from './components/header'
import LandingPage from './pages/LandingPage/LandingPage'
import Devices from './pages/Devices/Devices'
import Login from './pages/Login'
import Details from './pages/Details/Details'
import MyInventory from './pages/MyInventory/MyInventory'
import Dashboard from './pages/Dashboard'
import NewDevice from './pages/NewDevice/NewDevice'
import UserManagement from './pages/UserManagement/UserManagement'
import NewUser from './pages/NewUser/NewUser'
import UserDetails from './pages/UserDetails'

import { useSessionData } from './global-context'
import { useEffect } from 'react'
import NotFound from './pages/NotFound'
import UserAgreementConfirmation from './pages/UserAgreementConfirmation/UserAgreementConfirmation'

function App() {
  const { sessionData } = useSessionData()
  const location = useLocation()

  useEffect(() => {
    const path = location.path

    if (path && !path.match(/\/confirmation\/.*/i)) {
      if (!sessionData.loggedIn || !localStorage.getItem('UserInfo')) {
        window.location.hash = '/login'
      }
    }

    // eslint-disable-next-line
  }, [sessionData])

  return (
    <>
      <Theme>
        <Header />
      </Theme>
      <Content className="page-area">
        <Routes>
          <Route exact path="/" element={<LandingPage />} />
          <Route exact path="/devices" element={<Devices />} />
          <Route exact path="/my-inventory" element={<MyInventory />} />
          <Route exact path="/:orgPage/new-device" element={<NewDevice />} />
          <Route exact path="/devices/:serialNumber" element={<Details />} />
          <Route exact path="/my-inventory/:serialNumber" element={<Details />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/dashboard" element={<Dashboard />} />
          <Route exact path="/confirmation/:serialNumber" element={<UserAgreementConfirmation />} />
          <Route exact path="/confirmation/:serialNumberUrl" element={<UserAgreementConfirmation />} />
          <Route exact path="/users" element={<UserManagement />} />
          <Route exact path="/users/new-user" element={<NewUser />} />
          <Route exact path="/users/:email" element={<UserDetails />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Content>
    </>
  )
}

export default App
