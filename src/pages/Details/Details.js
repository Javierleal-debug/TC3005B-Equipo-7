import React from 'react'
import QRCode from 'react-qr-code'

// mock data
import mockDevice from '../../mock_data/device.json'

import {
  Grid,
  Column,
  StructuredListWrapper,
  StructuredListHead,
  StructuredListRow,
  StructuredListCell,
  StructuredListBody,
  Button,
  Dropdown,
} from 'carbon-components-react'

import { Edit, Play, CheckmarkFilled, Misuse } from '@carbon/icons-react'

const actionDropdownItems = ['Acción A', 'Acción B', 'Acción C']

const statusIcon = (status) =>
  status ? (
    <CheckmarkFilled size={20} className="icon-check" />
  ) : (
    <Misuse size={20} className="icon-fail" />
  )

const Details = () => {
  return (
    <>
      <Grid className="page-content">
        <Column sm={4} md={8} lg={4} className="actions-block">
          <h1>Detalles del dispositivo</h1>
          <Dropdown
            id="dropdown-actions"
            items={actionDropdownItems}
            titleText="Acciones"
            label="Seleccionar"
            aria-label="Dropdown"
            className="actions-dropdown"
          />
          <Button renderIcon={Play} className="button-icon">
            Ejecutar acción
          </Button>
          <Button renderIcon={Edit} kind="secondary" className="button-icon">
            Editar
          </Button>
          <div className="qr-code-area">
            <p>Número serial (QR)</p>
            <QRCode value={mockDevice.serialNumber} size={200} />
          </div>
        </Column>
        <Column sm={4} md={8} lg={12} className="table-block">
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
                <StructuredListCell>{mockDevice.type}</StructuredListCell>
              </StructuredListRow>
              <StructuredListRow tabIndex={0}>
                <StructuredListCell>Marca</StructuredListCell>
                <StructuredListCell>{mockDevice.brand}</StructuredListCell>
              </StructuredListRow>
              <StructuredListRow tabIndex={0}>
                <StructuredListCell>Modelo</StructuredListCell>
                <StructuredListCell>{mockDevice.model}</StructuredListCell>
              </StructuredListRow>
              <StructuredListRow tabIndex={0}>
                <StructuredListCell>Serial</StructuredListCell>
                <StructuredListCell>
                  {mockDevice.serialNumber}
                </StructuredListCell>
              </StructuredListRow>
              <StructuredListRow tabIndex={0}>
                <StructuredListCell>Condiciones aceptadas</StructuredListCell>
                <StructuredListCell className="icon-padding">
                  {statusIcon(mockDevice.acceptedConditions)}
                </StructuredListCell>
              </StructuredListRow>
              <StructuredListRow tabIndex={0}>
                <StructuredListCell>¿Está dentro?</StructuredListCell>
                <StructuredListCell className="icon-padding">
                  {statusIcon(mockDevice.isInside)}
                </StructuredListCell>
              </StructuredListRow>
              <StructuredListRow tabIndex={0}>
                <StructuredListCell>
                  Autorización de seguridad
                </StructuredListCell>
                <StructuredListCell className="icon-padding">
                  {statusIcon(mockDevice.securityAuthorization)}
                </StructuredListCell>
              </StructuredListRow>
            </StructuredListBody>
          </StructuredListWrapper>
        </Column>
      </Grid>
    </>
  )
}

export default Details
