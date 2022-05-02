import React, { useState } from 'react'
import QRCode from 'react-qr-code'
// import { useParams } from 'react-router-dom'

import DeviceStructuredTable from './components/DeviceStructuredTable'
import DeviceForm from './components/DeviceForm'

// mock data
import mockDevice from '../../mock_data/device.json'

// Carbon Styling
import {
  Grid,
  Column,
  Button,
  ButtonSet,
  Dropdown,
} from 'carbon-components-react'
import { Edit, Play } from '@carbon/icons-react'

const actionDropdownItems = ['Lend', 'Acción B', 'Acción C']

const Details = () => {
  const [onEditMode, setOnEditMode] = useState(false)

  const enableEditMode = () => setOnEditMode(true)
  const disableEditMode = () => setOnEditMode(false)

  // const { serial } = useParams()

  return (
    <>
      <Grid className="page-content">
        <Column sm={4} md={8} lg={4} className="actions-block">
          <h1>Device details view</h1>
          <Dropdown
            id="dropdown-actions"
            items={actionDropdownItems}
            titleText="Actions"
            label="Select"
            aria-label="Dropdown"
            className="actions-dropdown"
          />
          <ButtonSet stacked>
            <Button
              renderIcon={Edit}
              disabled={onEditMode}
              kind={'secondary'}
              onClick={enableEditMode}
            >
              Edit
            </Button>
            <Button renderIcon={Play} disabled={onEditMode}>
              Run action
            </Button>
          </ButtonSet>
          <div className="qr-code-area">
            <p>Serial number (QR)</p>
            <QRCode value={mockDevice.serialNumber} size={200} />
          </div>
        </Column>
        <Column sm={4} md={8} lg={12} className="table-block">
          {onEditMode ? (
            <DeviceForm device={mockDevice} disableEditMode={disableEditMode} />
          ) : (
            <DeviceStructuredTable device={mockDevice} />
          )}
        </Column>
      </Grid>
    </>
  )
}

export default Details
