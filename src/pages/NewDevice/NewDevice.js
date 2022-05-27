import React from 'react'

import axios from 'axios'

// Carbon Styling
import {
  Grid,
  Column,
  Button,
  ButtonSet,
  Form,
  Stack,
  TextInput,
  TextArea,
  Dropdown,
} from 'carbon-components-react'
import { Misuse, Save } from '@carbon/icons-react'

const items = [
  'Monitor',
  'Mouse',
  'Keyboard',
  'Headset',
  'Adapter',
  'Computer',
  'Tablet',
  'Laptop',
  'Touchscreen RB Pi',
  'Camera / Webcam',
  'Personal labeler',
  'OTP Hardware',
  'Mobile Phone',
  'Virtual Assistant',
  'Trackpad',
  'Power Adapter / Charger',
  'Apple TV',
  'Articulating Mount',
  'HDD / SSD',
  'HDMI Cable',
  'USB-C Charge cable',
  'USB Memory',
  'Combo Keyboard Mouse',
  'Multiport Adapter',
  'Video Adapter',
  'Docking Station',
  'Others',
]

const deviceData = {}

const NewDevice = () => {
  const handleTypeChange = (event) => {
    deviceData.type = event.selectedItem
  }

  const handleBrandChange = (event) => {
    deviceData.brand = event.target.value
  }

  const handleModelChange = (event) => {
    deviceData.model = event.target.value
  }

  const handleSerialChange = (event) => {
    deviceData.serial = event.target.value
  }

  const handleEmployeeNameChange = (event) => {
    deviceData.employeeName = event.target.value
  }

  const handleEmployeeEmailChange = (event) => {
    deviceData.employeeEmail = event.target.value
  }

  const handleEmployeeSerialChange = (event) => {
    deviceData.employeeSerial = event.target.value
  }

  const handleCommentChange = (event) => {
    deviceData.comment = event.target.value
  }

  const createItemRequest = () => {
    var userInfo = JSON.parse(localStorage.getItem('UserInfo'))
    let requestData = {
      type: deviceData.type,
      brand: deviceData.brand,
      model: deviceData.model,
      serialNumber: deviceData.serial,
      acceptedConditions: false,
      isInside: true,
      securityAuthorization: false,
      employeeName: deviceData.employeeName,
      employeeEmail: deviceData.employeeEmail,
      employeeSerial: deviceData.employeeSerial,
    }
    let requestHeaders = {
      headers: {
        'x-access-token': `${userInfo['accessToken']}`,
        'Content-Type': 'application/json',
      },
    }

    axios
      .post(
        'https://peripheralsloanbackend.mybluemix.net/peripheral',
        requestData,
        requestHeaders
      )
      .then(({ data }) => {
        window.location.hash = '/devices'
      })
      .catch((error) => {
        console.error(`There was an error!`, error)
      })
  }

  return (
    <>
      <Grid className="page-content">
        <Column sm={4} md={8} lg={16}>
          <h1 className="new-device-title">New Device</h1>
        </Column>
        <Column sm={4} md={8} lg={8}>
          <Stack>
            <Dropdown
              id="Type"
              onChange={handleTypeChange}
              label="Select Device Type"
              titleText="Type"
              items={items}
            />
            <TextInput
              id="Brand"
              onChange={handleBrandChange}
              placeholder="Device Brand"
              labelText="Brand"
            />
          </Stack>
        </Column>
        <Column sm={4} md={8} lg={8}>
          <Stack>
            <TextInput
              id="Model"
              onChange={handleModelChange}
              placeholder="Model"
              labelText="Model"
            />
            <TextInput
              id="Serial"
              onChange={handleSerialChange}
              placeholder="Serial Number"
              labelText="Serial"
            />
          </Stack>
        </Column>
        <Column sm={4} md={8} lg={16}>
          <TextArea
            id="Comment"
            onChange={handleCommentChange}
            placeholder="Optional Comment"
            labelText="Comment"
            rows={6}
          />
        </Column>
        <Column sm={4} md={8} lg={16}>
          <ButtonSet  className="new-device-button-set">
              <Button 
                renderIcon={Misuse} 
                kind="secondary" 
                href="#/devices"
                >
                Cancel
              </Button>
              <Button
                renderIcon={Save}
                kind="primary"
                type="button"
                onClick={createItemRequest}
              >
                Save
              </Button>
            </ButtonSet>
        </Column>
      </Grid>
    </>
  )
}

export default NewDevice
