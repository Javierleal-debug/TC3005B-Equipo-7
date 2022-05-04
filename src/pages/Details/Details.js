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
import { useParams } from 'react-router-dom';

const actionDropdownItems = ['Lend', 'Acción B', 'Acción C']

const Details = () => {
  const [onEditMode, setOnEditMode] = useState(false)
  const [isDataLoading, setIsDataLoading] = useState(true)
  const [perpheralData, setPerpheralData] = useState(mockDevice)

  const enableEditMode = () => setOnEditMode(true)
  const disableEditMode = () => setOnEditMode(false)

   const { serialNumber } = useParams();

  const getItemRequest = () => {
    
    //const serialNumber = window.location.pathname.split('/').slice(-1)[0];
    console.log(serialNumber);
    setIsDataLoading(true);
    var userInfo = JSON.parse(localStorage.getItem('UserInfo'));
    var requestRowData = {
      headers: {
        'x-access-token': `${userInfo["accessToken"]}`
      }
    };

    axios
      .get(`https://peripheralsloanbackend.mybluemix.net/peripheral/${serialNumber}`, requestRowData)
      .then(({ data }) => {
        console.log(data);
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
