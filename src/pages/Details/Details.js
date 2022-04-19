import React from 'react'

import { Grid, Column } from 'carbon-components-react'

const Details = () => {
  return (
    <>
      <Grid fullWidth className="">
        <Column lg={4}>Span 4 of 16</Column>
        <Column lg={4}>Span 4 of 16</Column>
        <Column lg={4}>Span 4 of 16</Column>
        <Column lg={4}>Span 4 of 16</Column>
      </Grid>
      <Grid fullWidth>
        <Column lg={4}>Span 4 of 16</Column>
        <Column lg={4}>Span 4 of 16</Column>
        <Column lg={4}>Span 4 of 16</Column>
        <Column lg={4}>Span 4 of 16</Column>
      </Grid>
    </>
  )
}

export default Details
