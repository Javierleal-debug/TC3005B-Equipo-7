import React from 'react'

import {
  StructuredListWrapper,
  StructuredListHead,
  StructuredListRow,
  StructuredListCell,
  StructuredListBody,
} from 'carbon-components-react'

import { CheckmarkFilled, Misuse } from '@carbon/icons-react'

const DeviceStructuredTable = ({ device }) => {
  return (
    <StructuredListWrapper aria-label="Product details list">
      <StructuredListHead>
        <StructuredListRow head tabIndex={0}>
          <StructuredListCell head>Spec</StructuredListCell>
          <StructuredListCell head>Value</StructuredListCell>
        </StructuredListRow>
      </StructuredListHead>
      <StructuredListBody>
        <StructuredListRow tabIndex={0}>
          <StructuredListCell>Device type</StructuredListCell>
          <StructuredListCell>{device.type}</StructuredListCell>
        </StructuredListRow>
        <StructuredListRow tabIndex={0}>
          <StructuredListCell>Brand</StructuredListCell>
          <StructuredListCell>{device.brand}</StructuredListCell>
        </StructuredListRow>
        <StructuredListRow tabIndex={0}>
          <StructuredListCell>Model</StructuredListCell>
          <StructuredListCell>{device.model}</StructuredListCell>
        </StructuredListRow>
        <StructuredListRow tabIndex={0}>
          <StructuredListCell>Serial</StructuredListCell>
          <StructuredListCell>{device.serialNumber}</StructuredListCell>
        </StructuredListRow>
      </StructuredListBody>
    </StructuredListWrapper>
  )
}

export default DeviceStructuredTable
