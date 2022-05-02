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

const DeviceStructuredTable = ({ device }) => {
  return (
    <StructuredListWrapper aria-label="Product details list">
      <StructuredListHead>
        <StructuredListRow head tabIndex={0}>
          <StructuredListCell head>Spec</StructuredListCell>
          <StructuredListCell head>Valor</StructuredListCell>
        </StructuredListRow>
      </StructuredListHead>
      <StructuredListBody>
        <StructuredListRow tabIndex={0}>
          <StructuredListCell>Tipo de dispositivo</StructuredListCell>
          <StructuredListCell>{device.type}</StructuredListCell>
        </StructuredListRow>
        <StructuredListRow tabIndex={0}>
          <StructuredListCell>Marca</StructuredListCell>
          <StructuredListCell>{device.brand}</StructuredListCell>
        </StructuredListRow>
        <StructuredListRow tabIndex={0}>
          <StructuredListCell>Modelo</StructuredListCell>
          <StructuredListCell>{device.model}</StructuredListCell>
        </StructuredListRow>
        <StructuredListRow tabIndex={0}>
          <StructuredListCell>Serial</StructuredListCell>
          <StructuredListCell>{device.serialNumber}</StructuredListCell>
        </StructuredListRow>
        <StructuredListRow tabIndex={0}>
          <StructuredListCell>Condiciones aceptadas</StructuredListCell>
          <StructuredListCell className="icon-padding">
            {statusIcon(device.acceptedConditions)}
          </StructuredListCell>
        </StructuredListRow>
        <StructuredListRow tabIndex={0}>
          <StructuredListCell>¿Está dentro?</StructuredListCell>
          <StructuredListCell className="icon-padding">
            {statusIcon(device.isInside)}
          </StructuredListCell>
        </StructuredListRow>
        <StructuredListRow tabIndex={0}>
          <StructuredListCell>Autorización de seguridad</StructuredListCell>
          <StructuredListCell className="icon-padding">
            {statusIcon(device.securityAuthorization)}
          </StructuredListCell>
        </StructuredListRow>
      </StructuredListBody>
    </StructuredListWrapper>
  )
}

export default DeviceStructuredTable
