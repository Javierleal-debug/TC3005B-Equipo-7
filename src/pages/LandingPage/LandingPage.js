import React from 'react'

import { Grid, Column } from 'carbon-components-react'

const LandingPage = () => {
  return (
    <Grid className="home-banner">
      <Column sm={4} md={8} lg={16} className="page-title-block">
        <h1>Peripheral Loans</h1>
      </Column>
    </Grid>
  )
}

export default LandingPage
