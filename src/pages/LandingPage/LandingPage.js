import React, { useEffect } from 'react'

import { useSessionData } from '../../global-context'

import { checkAuth } from '../../util'
import { useLocation } from 'react-router-dom'

const LandingPage = () => {
  const { sessionData, setSessionData } = useSessionData()
  const location = useLocation()

  useEffect(() => {
    try {
      JSON.parse(localStorage.getItem('UserInfo'))
      checkAuth(sessionData, setSessionData, location.pathname)
      window.location.href = '/?#/devices'
    } catch (e) {
      window.location.href = '/?#/login'
    }
    // eslint-disable-next-line
  }, [])

  return (
    <div className="landing-page-container">
      <h2>IBM Peripheral Loans</h2>
    </div>
  )
}

export default LandingPage
