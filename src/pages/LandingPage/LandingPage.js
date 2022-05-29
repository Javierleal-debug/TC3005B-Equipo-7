import React, { useEffect } from 'react'

import { Grid, Column } from 'carbon-components-react'
import { useSessionData } from '../../global-context'

import { checkAuth } from '../../util'
import { useLocation } from 'react-router-dom'

const LandingPage = () => {
  const { sessionData, setSessionData } = useSessionData()
  const location = useLocation()

  useEffect(() => {
    checkAuth(sessionData, setSessionData, location.pathname)
    // eslint-disable-next-line
  }, [])

  return (
    <div className="landing-page-container">
      <h2>IBM Peripheral Loans</h2>
    </div>
  )
}

export default LandingPage
