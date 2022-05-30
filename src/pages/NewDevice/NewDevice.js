import React, { useState, useEffect } from 'react'

import axios from 'axios'

// Carbon Styling
import {
  Grid,
  Column,
  Button,
  ButtonSet,
  Stack,
  TextInput,
  TextArea,
  Dropdown,
  Modal,
  InlineLoading,
} from 'carbon-components-react'
import { Misuse, Save } from '@carbon/icons-react'
import { useSessionData } from '../../global-context'
import { useLocation } from 'react-router-dom'
import { checkAuth, redirectIfUserTypeIsNot } from '../../util'

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

const CreateDevicePopUp = ({ open, setOpen, submit, isDataLoading }) => (
  <Modal
    open={open}
    modalLabel="Peripheral device"
    modalHeading="Create"
    primaryButtonDisabled={isDataLoading}
    primaryButtonText={
      isDataLoading ? <InlineLoading description="Loading..." /> : 'Create'
    }
    secondaryButtonText="Cancel"
    onSecondarySubmit={() => setOpen(false)}
    onRequestClose={() => setOpen(false)}
    onRequestSubmit={submit}
    danger={false}
  >
    <p>
      By clicking "Create", you understand that this device will be visible to
      users.
    </p>
  </Modal>
)

const deviceData = {}

const NewDevice = () => {
  const [createDevicePopUpOpen, setCreateDevicePopUpOpen] = useState(false)
  const [isRequestLoading, setIsRequestLoading] = useState(false)

  const { sessionData, setSessionData } = useSessionData()
  const location = useLocation()

  useEffect(() => {
    checkAuth(sessionData, setSessionData, location.pathname)
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (sessionData.userType) {
      redirectIfUserTypeIsNot(sessionData, 'admin', 'focal', 'security')
    }
  }, [sessionData])

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

  const handleCommentChange = (event) => {
    deviceData.comment = event.target.value
  }

  const postCreateDevices = () => {
    setIsRequestLoading(true)
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
        setCreateDevicePopUpOpen(false)
        setIsRequestLoading(false)
        console.log(data.message)
        window.location.hash = '/devices'
        //ACTIVAR NOTIFIACIÓN QUE DIGA QUE NO SE PUDO
      })
      .catch((error) => {
        setCreateDevicePopUpOpen(false)
        setIsRequestLoading(false)
        console.error(`There was an error!`, error)
        //ACTIVAR NOTIFIACIÓN QUE DIGA QUE NO SE PUDO
      })
  }

  return (
    <>
      <CreateDevicePopUp
        open={createDevicePopUpOpen}
        setOpen={setCreateDevicePopUpOpen}
        submit={postCreateDevices}
        isDataLoading={isRequestLoading}
      />
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
          <ButtonSet className="new-device-button-set">
            <Button renderIcon={Misuse} kind="secondary" href="#/devices">
              Cancel
            </Button>
            <Button
              renderIcon={Save}
              kind="primary"
              type="button"
              onClick={() => {
                setCreateDevicePopUpOpen(true)
              }}
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
