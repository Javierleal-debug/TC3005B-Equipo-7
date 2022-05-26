import React, { useEffect } from 'react'

import { Grid, Column } from 'carbon-components-react'
import { useSessionData } from '../../global-context'

import { checkAuth } from '../../util'

const LandingPage = () => {
  const { sessionData, setSessionData } = useSessionData()

  useEffect(() => {
    try {
      checkAuth(sessionData, setSessionData)
    } catch (e) {
      window.location.hash = '/login'
    }
    // eslint-disable-next-line
  }, [])

  return (
    <Grid className="home-banner">
      <Column sm={4} md={8} lg={16} className="page-title-block">
        <h1>Peripheral Loans</h1>
      </Column>
    </Grid>
  )
}

export default LandingPage
