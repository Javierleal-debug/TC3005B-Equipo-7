import React, { useState, useEffect} from 'react'
import QRCode from 'react-qr-code'
// import { useParams } from 'react-router-dom'

import DeviceStructuredTable from './components/DeviceStructuredTable'
import DeviceForm from './components/DeviceForm'

import axios from "axios";

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
import SkeletonStructure from './components/SkeletonStructure'

const actionDropdownItems = ['Lend', 'Acción B', 'Acción C']

const Details = () => {
  const [onEditMode, setOnEditMode] = useState(false)
  const [isDataLoading, setIsDataLoading] = useState(true)
  const [perpheralData, setPerpheralData] = useState(mockDevice)

  const enableEditMode = () => setOnEditMode(true)
  const disableEditMode = () => setOnEditMode(false)

  // const { serial } = useParams()

  const getItemRequest = () => {
    const serialNumber = window.location.pathname.split('/').slice(-1)[0];
    setIsDataLoading(true);
    let requestRowData = {
      headers: {
        'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Imx1aXMtYXJtYW5kb3NsQGhvdG1haWwuY29tIiwiaWF0IjoxNjUxNTE0NTQ3LCJleHAiOjE2NTE2MDA5NDd9.GlcjaPBv1C9tNTJn1UVcVdehyf1nb0tKjcnLY3TqCM0'
      }
    };

    axios
      .get(`http://localhost:3001/peripheral/${serialNumber}`, requestRowData)
      .then(({ data }) => {
        mockDevice = {
          type: data[0],
          brand: data[1],
          model: data[2],
          serialNumber: data[3],
          acceptedConditions: data[4]==='true'? true: false,
          isInside: data[5]==='true'? true: false,
          securityAuthorization: data[6]==='true'? true: false
        }
        setPerpheralData(mockDevice);
        setIsDataLoading(false);
      });
  }

  useEffect(() => {getItemRequest()},[]);

  return (isDataLoading?
    <SkeletonStructure/>
    :
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
            <QRCode value={perpheralData.serialNumber} size={200} />
          </div>
        </Column>
        <Column sm={4} md={8} lg={12} className="table-block">
          {onEditMode ? (
            <DeviceForm device={perpheralData} disableEditMode={disableEditMode} />
          ) : (
            <DeviceStructuredTable device={perpheralData} />
          )}
        </Column>
      </Grid>
    </>
  )
}

export default Details
