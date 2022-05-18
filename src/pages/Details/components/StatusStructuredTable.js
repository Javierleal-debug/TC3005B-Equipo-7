import React from 'react'

import {
  StructuredListWrapper,
  StructuredListHead,
  StructuredListRow,
  StructuredListCell,
  StructuredListBody,
} from 'carbon-components-react'

import { CheckmarkFilled, Misuse } from '@carbon/icons-react'

const statusIcon = (status) =>
  status ? (
    <CheckmarkFilled size={20} className="icon-check" />
  ) : (
    <Misuse size={20} className="icon-fail" />
  )

const StatusStructuredTable = ({ device }) => {
  return (
    <StructuredListWrapper aria-label="Product details list">
      <StructuredListHead>
        <StructuredListRow head tabIndex={0}>
          <StructuredListCell head>Loans</StructuredListCell>
        </StructuredListRow>
      </StructuredListHead>
      <StructuredListBody>
        <StructuredListRow tabIndex={0}>
          <StructuredListCell>Availability</StructuredListCell>
          <StructuredListCell>
            {device.isAvailable ? 'Available' : 'Unavailable'}{' '}
          </StructuredListCell>
        </StructuredListRow>
        <StructuredListRow tabIndex={0}>
          <StructuredListCell>Current User</StructuredListCell>
          <StructuredListCell>{device.currentUser}</StructuredListCell>
        </StructuredListRow>
        <StructuredListRow tabIndex={0}>
          <StructuredListCell>Location</StructuredListCell>
          <StructuredListCell>{device.location}</StructuredListCell>
        </StructuredListRow>
      </StructuredListBody>
    </StructuredListWrapper>
  )
}

export default StatusStructuredTable
