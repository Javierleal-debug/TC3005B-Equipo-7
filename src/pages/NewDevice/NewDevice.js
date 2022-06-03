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
  ToastNotification
} from 'carbon-components-react'
import { Misuse, Save } from '@carbon/icons-react'
import { useSessionData } from '../../global-context'
import { useLocation, useParams } from 'react-router-dom'
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
      users. <b>You will be redirected to the 'Device List' page.</b>
    </p>
  </Modal>
)

const deviceData = {}

const NewDevice = () => {
  const [createDevicePopUpOpen, setCreateDevicePopUpOpen] = useState(false)
  const [isRequestLoading, setIsRequestLoading] = useState(false)
  const [isNotificationErrorActive, setIsNotificationErrorActive] = useState(false)
  const [isWarningNotificationActive, setIsWarningNotificationActive] = useState(false)
  

  const [isTypeNotSelected, setIsTypeNotSelected] = useState(false)
  const [isBrandInvalid, setIsBrandInvalid] = useState(false)
  const [isModelInvalid, setIsModelInvalid] = useState(false)
  const [isSerialInvalid, setIsSerialInvalid] = useState(false)

  const { sessionData, setSessionData } = useSessionData()
  const location = useLocation()
  const { orgPage } = useParams()

  useEffect(() => {
    checkAuth(sessionData, setSessionData, location.pathname)
    // eslint-disable-next-line
    if(!(orgPage==="devices" || orgPage==="my-inventory")){
      window.location.hash = 'not-found'
    }
  }, [sessionData, setSessionData, location.pathname, orgPage])

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
        console.log(data.message)
        setCreateDevicePopUpOpen(false)
        setIsRequestLoading(false)
        if(data.message === "SerialNumber is already registered"){
          setIsWarningNotificationActive(true)
        }else{
          window.location.hash = `/${orgPage}`
        }
      })
      .catch((error) => {
        setCreateDevicePopUpOpen(false)
        setIsRequestLoading(false)
        console.error(`There was an error!`, error)
        setIsNotificationErrorActive(true)
      })
  }

  return (
    <>
      {isWarningNotificationActive ? 
      <div className="error-notification">
        <ToastNotification
          kind="warning"
          lowContrast={true}
          title="Already exists!"
          onCloseButtonClick={()=>{setIsWarningNotificationActive(false)}}
          subtitle="This peripheral serial number is already registered"/>
      </div> : <div></div>}
      {isNotificationErrorActive ? 
        <div className="error-notification">
          <ToastNotification
            kind="error"
            lowContrast={true}
            title="Error"
            onCloseButtonClick={()=>{setIsNotificationErrorActive(false)}}
            subtitle="Something went wrong, try it later"/>
        </div> 
        : 
        <div></div>
      }
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
              onChange={(event) => {
                handleTypeChange(event)
                if(!deviceData.type){
                  setIsTypeNotSelected(true)
                }else{
                  setIsTypeNotSelected(false)
                }
              }}
              label="Select Device Type"
              titleText="Type"
              items={items}
              invalid={isTypeNotSelected}
            />
            <TextInput
              onChange={(event) => {
                handleBrandChange(event)
                if(!deviceData.brand){
                  setIsBrandInvalid(true)
                }else{
                  setIsBrandInvalid(false)
                }
              }}
              className="cds--list-box__wrapper"
              placeholder="Device Brand"
              labelText="Brand"
              invalid={isBrandInvalid}
            />
          </Stack>
        </Column>
        <Column sm={4} md={8} lg={8}>
          <Stack>
            <TextInput
              onChange={(event)=>{
                handleModelChange(event)
                if(!deviceData.model){
                  setIsModelInvalid(true)
                }else{
                  setIsModelInvalid(false)
                }
              }}
              className="cds--list-box__wrapper"
              placeholder="Model"
              labelText="Model"
              invalid={isModelInvalid}
            />
            <TextInput
              onChange={(event) => {
                handleSerialChange(event)
                if(!deviceData.serial){
                  setIsSerialInvalid(true)
                }else{
                  setIsSerialInvalid(false)
                }
              }}
              className="cds--list-box__wrapper"
              placeholder="Serial Number"
              labelText="Serial"
              invalid={isSerialInvalid}
            />
          </Stack>
        </Column>
        <Column sm={4} md={8} lg={16}>
          <TextArea
            onChange={handleCommentChange}
            className="cds--list-box__wrapper"
            placeholder="Optional Comment"
            labelText="Comment"
            rows={6}
          />
        </Column>
        <Column sm={4} md={8} lg={16}>
          <ButtonSet className="new-device-button-set">
            <Button 
              renderIcon={Misuse} 
              onClick={()=>{
                window.location.hash = `/${orgPage}`
              }}
              kind="secondary">
              Cancel
            </Button>
            <Button
              renderIcon={Save}
              kind="primary"
              type="button"
              onClick={() => {
                let allowPopUp = true

                if(!deviceData.type){
                  setIsTypeNotSelected(true)
                  allowPopUp = false
                }
                if(!deviceData.brand){
                  setIsBrandInvalid(true)
                  allowPopUp = false
                }
                if(!deviceData.model){
                  setIsModelInvalid(true)
                  allowPopUp = false
                }
                if(!deviceData.serial){
                  setIsSerialInvalid(true)
                  allowPopUp = false
                }

                if(allowPopUp){
                  setCreateDevicePopUpOpen(true)
                }else{
                  setCreateDevicePopUpOpen(false)
                }
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
