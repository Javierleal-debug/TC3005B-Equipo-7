import React, { useState, useEffect } from 'react'
import QRCode from 'react-qr-code'
// import { useParams } from 'react-router-dom'

import DeviceStructuredTable from './components/DeviceStructuredTable'
import DeviceForm from './components/DeviceForm'

import axios from 'axios'

// mock data
import device from '../../mock_data/device.json'

// Carbon Styling
import { Grid, Column, Button, ButtonSet } from 'carbon-components-react'
import { Edit, Play, Friendship, Undo } from '@carbon/icons-react'
import SkeletonStructure from './components/SkeletonStructure'
import { useParams } from 'react-router-dom'
import StatusStructuredTable from './components/StatusStructuredTable'

function checkAuth() {
  var userInfo = JSON.parse(localStorage.getItem('UserInfo'))
  fetch('https://peripheralsloanbackend.mybluemix.net/auth/hasAccess', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'x-access-token': `${userInfo['accessToken']}`,
    },
  })
    .then((response) => response.json())
    .then((json) => {
      console.log(json.accessToken)
      if (json.access) {
      } else {
        window.location.hash = '/login'
      }
    })
}

const Details = () => {
  const [onEditMode, setOnEditMode] = useState(false)
  const [isDataLoading, setIsDataLoading] = useState(true)
  const [peripheralData, setperipheralData] = useState(device)

  const enableEditMode = () => setOnEditMode(true)
  const disableEditMode = () => setOnEditMode(false)

  const { serialNumber } = useParams()

  useEffect(() => {
    checkAuth()
  }, [])

  const getItemRequest = () => {
    //const serialNumber = window.location.pathname.split('/').slice(-1)[0];
    console.log(serialNumber)
    setIsDataLoading(true)
    var userInfo = JSON.parse(localStorage.getItem('UserInfo'))
    var requestRowData = {
      headers: {
        'x-access-token': `${userInfo['accessToken']}`,
      },
    }

    axios
      .get(
        `https://peripheralsloanbackend.mybluemix.net/peripheral/${serialNumber}`,
        requestRowData
      )
      .then(({ data }) => {
        console.log(data)
        device = {
          type: data[0],
          brand: data[1],
          model: data[2],
          serialNumber: data[3],
          acceptedConditions: data[4] === 'true' ? true : false,
          isInside: data[5] === 'true' ? true : false,
          securityAuthorization: data[6] === 'true' ? true : false,
          isAvailable: true,
          currentUser: 'Fulano De Ibm',
          location: 'Area A',
        }
        setperipheralData(device)
        setIsDataLoading(false)
      })
  }

  useEffect(() => {
    getItemRequest()
    // eslint-disable-next-line
  }, [])

  return isDataLoading ? (
    <SkeletonStructure />
  ) : (
    <>
      <Grid className="page-content">
        <Column sm={4} md={8} lg={4} className="actions-block">
          <h1>{peripheralData.model}</h1>
          <ButtonSet stacked>
            {peripheralData.isAvailable ? (
              <Button
                renderIcon={Friendship}
                disabled={onEditMode}
                onClick={() => {
                  setperipheralData({ ...peripheralData, isAvailable: false })
                }}
              >
                Lend
              </Button>
            ) : (
              <Button
                renderIcon={Undo}
                disabled={onEditMode}
                onClick={() => {
                  setperipheralData({ ...peripheralData, isAvailable: true })
                }}
              >
                Return
              </Button>
            )}

            <Button
              renderIcon={Edit}
              disabled={onEditMode}
              kind={'secondary'}
              onClick={enableEditMode}
            >
              Edit
            </Button>
          </ButtonSet>
          <div className="qr-code-area">
            <p>QR Code</p>
            <QRCode
              value={`https://peripheral-loans-equipo7.mybluemix.net/#/devices/${serialNumber}`}
              size={200}
            />
          </div>
        </Column>
        <Column sm={4} md={8} lg={12} className="table-block">
          {onEditMode ? (
            <DeviceForm
              device={peripheralData}
              disableEditMode={disableEditMode}
            />
          ) : (
            <>
              <StatusStructuredTable device={peripheralData} />
              <DeviceStructuredTable device={peripheralData} />
            </>
          )}
        </Column>
      </Grid>
    </>
  )
}

export default Details
