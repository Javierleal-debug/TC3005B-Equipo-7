import React from 'react'

import {
  StructuredListWrapper,
  StructuredListHead,
  StructuredListRow,
  StructuredListCell,
  StructuredListBody,
} from 'carbon-components-react'

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
          <StructuredListCell>{device.availability}</StructuredListCell>
        </StructuredListRow>
        <StructuredListRow tabIndex={0}>
          <StructuredListCell>Employee Name</StructuredListCell>
          <StructuredListCell>{device.employeeName}</StructuredListCell>
        </StructuredListRow>
        <StructuredListRow tabIndex={0}>
          <StructuredListCell>Employee Email</StructuredListCell>
          <StructuredListCell>{device.employeeEmail}</StructuredListCell>
        </StructuredListRow>
        <StructuredListRow tabIndex={0}>
          <StructuredListCell>Employee Serial</StructuredListCell>
          <StructuredListCell>{device.employeeSerial}</StructuredListCell>
        </StructuredListRow>
        <StructuredListRow tabIndex={0}>
          <StructuredListCell>Area</StructuredListCell>
          <StructuredListCell>{device.employeeArea}</StructuredListCell>
        </StructuredListRow>
        <StructuredListRow tabIndex={0}>
          <StructuredListCell>Manager Name</StructuredListCell>
          <StructuredListCell>{device.mngrName}</StructuredListCell>
        </StructuredListRow>
        <StructuredListRow tabIndex={0}>
          <StructuredListCell>Manager Email</StructuredListCell>
          <StructuredListCell>{device.mngrEmail}</StructuredListCell>
        </StructuredListRow>
        <StructuredListRow tabIndex={0}>
          <StructuredListCell>Date</StructuredListCell>
          <StructuredListCell>{device.date}</StructuredListCell>
        </StructuredListRow>
        <StructuredListRow tabIndex={0}>
          <StructuredListCell>Comment</StructuredListCell>
          <StructuredListCell>{device.comment}</StructuredListCell>
        </StructuredListRow>
      </StructuredListBody>
    </StructuredListWrapper>
  )
}

export default StatusStructuredTable
