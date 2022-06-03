import React, { useState, useEffect } from 'react'
import QRCode from 'react-qr-code'
// import { useParams } from 'react-router-dom'

import DeviceStructuredTable from './components/DeviceStructuredTable'

import axios from 'axios'

// mock data
import device from '../../mock_data/device.json'

import { getDeviceStatus } from '../../util'

// Carbon Styling
import {
  Grid,
  Column,
  Modal,
  ComboBox,
  TextArea,
  InlineNotification,
  InlineLoading,
  Stack,
  TextInput,
} from 'carbon-components-react'
import SkeletonStructure from './components/SkeletonStructure'
import { useLocation, useParams } from 'react-router-dom'
import StatusStructuredTable from './components/StatusStructuredTable'
import { useSessionData } from '../../global-context'

import { checkAuth } from '../../util'
import ButtonBar from './components/ButtonBar'

/*
  PopUps
*/
const RequestDevicePopUp = ({ open, closeFunction, submit, isDataLoading }) => {
  const [input, setInput] = useState({
    employeeSerial: '',
    employeeName: '',
    employeeEmail: '',
  })

  const handleSerialInput = (e) => {
    setInput({ ...input, employeeSerial: e.target.value })
  }

  const handleNameInput = (e) => {
    setInput({ ...input, employeeName: e.target.value })
  }

  const handleEmailInput = (e) => {
    setInput({ ...input, employeeEmail: e.target.value })
  }

  return (
    <Modal
      open={open}
      modalHeading="Lend Device"
      modalLabel="Peripheral Loans"
      primaryButtonText={
        isDataLoading ? (
          <InlineLoading description="Loading..." />
        ) : (
          'Agree and create request'
        )
      }
      primaryButtonDisabled={isDataLoading}
      secondaryButtonText="Cancel"
      size="sm"
      onRequestClose={closeFunction}
      onSecondarySubmit={closeFunction}
      onRequestSubmit={() =>
        submit(input.employeeSerial, input.employeeName, input.employeeEmail)
      }
    >
      <p style={{ marginBottom: '10px' }}>Please fill the borrower's data.</p>
      <Stack gap={5}>
        <TextInput
          id="employeeSerial"
          labelText="Employee ID"
          placeholder="Employee ID"
          onChange={handleSerialInput}
          required
        ></TextInput>
        <TextInput
          id="employeeName"
          labelText="Employee name"
          placeholder="Employee name"
          onChange={handleNameInput}
          required
        ></TextInput>
        <TextInput
          id="employeeEmail"
          labelText="Employee Email"
          placeholder="Employee Email"
          onChange={handleEmailInput}
          required
        ></TextInput>
      </Stack>
    </Modal>
  )
}

const CancelRequestPopUp = ({ open, closeFunction, submit, isDataLoading }) => (
  <Modal
    open={open}
    modalHeading="Cancel request"
    modalLabel="Request a peripheral"
    primaryButtonText={
      isDataLoading ? <InlineLoading description="Loading..." /> : 'Confirm'
    }
    primaryButtonDisabled={isDataLoading}
    secondaryButtonText="Cancel"
    size="sm"
    onRequestClose={closeFunction}
    onSecondarySubmit={closeFunction}
    onRequestSubmit={submit}
  >
    Are you sure you want to cancel this request?
  </Modal>
)

const ResetDevicePopUp = ({ open, closeFunction, submit, isDataLoading }) => (
  <Modal
    open={open}
    modalLabel="Peripheral device"
    modalHeading="Reset"
    primaryButtonText={
      isDataLoading ? <InlineLoading description="Loading..." /> : 'Confirm'
    }
    primaryButtonDisabled={isDataLoading}
    secondaryButtonText="Cancel"
    onSecondarySubmit={closeFunction}
    onRequestClose={closeFunction}
    onRequestSubmit={submit}
  >
    <p>
      Resetting a device cancels any request, takes ownership away from any
      requisitor, cancels user agreement, cancels security authorization and
      allows to specify a new area.
    </p>
    <ComboBox
      ariaLabel="ComboBox"
      id="carbon-combobox-example"
      items={['Area A', 'Area B', 'Area C']}
      label="Select or type area (leave blank to use corresponding default area)"
      placeholder={device.location}
      titleText="Area (leave blank to use corresponding default area)"
      onChange={() => {}}
    />
    <TextArea
      labelText="Comments (optional)"
      helperText="Please add comments on why this device is being reset."
      cols={50}
      rows={4}
      id="text-area-1"
    />
  </Modal>
)

const LendDevicePopUp = ({ open, closeFunction, submit, isDataLoading }) => (
  <Modal
    open={open}
    modalLabel="Peripheral device"
    modalHeading="Request approval"
    primaryButtonText={
      isDataLoading ? <InlineLoading description="Loading..." /> : 'Confirm'
    }
    primaryButtonDisabled={isDataLoading}
    secondaryButtonText="Cancel"
    onSecondarySubmit={closeFunction}
    onRequestClose={closeFunction}
    onRequestSubmit={submit}
  >
    <p>
      By clicking the "Accept" button, you confirm that you approve this request
      and you have granted this device to the requisitor.
    </p>
  </Modal>
)

const DeleteDevicePopUp = ({ open, closeFunction, submit, isDataLoading }) => (
  <Modal
    open={open}
    modalLabel="Peripheral device"
    modalHeading="Delete"
    primaryButtonText={
      isDataLoading ? <InlineLoading description="Loading..." /> : 'Delete'
    }
    primaryButtonDisabled={isDataLoading}
    secondaryButtonText="Cancel"
    onSecondarySubmit={closeFunction}
    onRequestClose={closeFunction}
    onRequestSubmit={submit}
    danger
  >
    <p>
      By clicking "Delete", you understand that this device will no longer be
      visible to users.
    </p>
    <TextArea
      labelText="Comments (optional)"
      helperText="Please add comments on why this device is being deleted."
      cols={50}
      rows={4}
      id="text-area-1"
    />
  </Modal>
)

const ReturnDevicePopUp = ({ open, closeFunction, submit, isDataLoading }) => (
  <Modal
    open={open}
    modalLabel="Peripheral device"
    modalHeading="Return"
    primaryButtonText={
      isDataLoading ? <InlineLoading description="Loading..." /> : 'Accept'
    }
    primaryButtonDisabled={isDataLoading}
    secondaryButtonText="Cancel"
    onSecondarySubmit={closeFunction}
    onRequestClose={closeFunction}
    onRequestSubmit={submit}
  >
    <p>
      By clicking "Accept", you confirm that the user has returned the device to
      its corresponding location in campus.
    </p>
    <p>After this action, the device will become available to other users.</p>
    <TextArea
      labelText="Comments (optional)"
      helperText="Please add any related comments."
      cols={50}
      rows={4}
      id="text-area-1"
    />
  </Modal>
)

const SecurityAuthorizePopUp = ({
  open,
  closeFunction,
  submit,
  isDataLoading,
}) => (
  <Modal
    open={open}
    modalLabel="Peripheral device"
    modalHeading="Security Authorization"
    primaryButtonText={
      isDataLoading ? <InlineLoading description="Loading..." /> : 'Accept'
    }
    primaryButtonDisabled={isDataLoading}
    secondaryButtonText="Cancel"
    onSecondarySubmit={closeFunction}
    onRequestClose={closeFunction}
    onRequestSubmit={submit}
  >
    <p>By clicking "Accept", you authorize this device exit.</p>
  </Modal>
)

const SecurityDenyPopUp = ({
  open,
  closeFunction,
  submit,
  isDataLoading,
}) => (
  <Modal
    open={open}
    modalLabel="Peripheral device"
    modalHeading="Security Deny"
    primaryButtonText={
      isDataLoading ? <InlineLoading description="Loading..." /> : 'Accept'
    }
    primaryButtonDisabled={isDataLoading}
    secondaryButtonText="Cancel"
    onSecondarySubmit={closeFunction}
    onRequestClose={closeFunction}
    onRequestSubmit={submit}
  >
    <p>By clicking "Accept", you deny this device exit.</p>
  </Modal>
)

/* 
Page 
*/
const Details = () => {
  // States
  // const [onEditMode, setOnEditMode] = useState(false)
  const [isDataLoading, setIsDataLoading] = useState(true)
  const [isRequestLoading, setIsRequestLoading] = useState(false)
  const [peripheralData, setperipheralData] = useState(device)
  const [currentAction, setCurrentAction] = useState('')

  // const enableEditMode = () => setOnEditMode(true)
  // const disableEditMode = () => setOnEditMode(false)

  const { orgPage, serialNumber } = useParams()

  const { sessionData, setSessionData } = useSessionData()
  const location = useLocation()

  useEffect(() => {
    checkAuth(sessionData, setSessionData, location.pathname)
    if(!(orgPage==="devices" || orgPage==="my-inventory")){
      window.location.hash = 'not-found'
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (localStorage.getItem('UserInfo')) getItemRequest()
    // eslint-disable-next-line
  }, [location])

  // API Calls
  const getItemRequest = () => {
    //const serialNumber = window.location.pathname.split('/').slice(-1)[0];
    console.log(serialNumber)
    setIsDataLoading(true)
    const userInfo = JSON.parse(localStorage.getItem('UserInfo'))
    const requestRowData = {
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
        if (!data) {
          window.location.hash = '/not-found'
          return
        }
        console.log(data)
        device = {
          type: data[0],
          brand: data[1],
          model: data[2],
          serialNumber: data[3],
          acceptedConditions: data[4] === 'true',
          isInside: data[5] === 'true',
          securityAuthorization: data[6] === 'true',
          // ----- NEW -----
          availability: getDeviceStatus(data[4], data[5], data[6], data[7]),
          employeeName: data[7],
          employeeEmail: data[8],
          employeeSerial: data[9],
          employeeArea: data[10],
          mngrName: data[11],
          mngrEmail: data[12],
          date: data[13],
          comment: data[14],
        }
        setperipheralData(device)
        setIsDataLoading(false)
      })
      .catch((e) => {
        window.location.hash = 'not-found'
      })
  }

  const postDeviceLoanRequest = async (
    employeeSerial,
    employeeName,
    employeeEmail
  ) => {
    // Posts request to loan a device
    // Checks that the following is true:
    //    !isRequested
    //    isAvailable
    // Makes this changes to peripheral data:
    //    isRequested: true
    //    requestedBy: "Employee Name"
    //    isAvailable: false
    // Creates a record in the history table

    setIsRequestLoading(true)

    console.log(employeeSerial, employeeName, employeeEmail)

    /**
     * API Request Device
     */
    const userInfo = JSON.parse(localStorage.getItem('UserInfo'))

    const myHeaders = new Headers()
    myHeaders.append('x-access-token', userInfo['accessToken'])
    myHeaders.append('Content-Type', 'application/x-www-form-urlencoded')

    const urlencoded = new URLSearchParams()
    urlencoded.append('serialNumber', serialNumber)
    urlencoded.append('employeeName', employeeName)
    urlencoded.append('employeeEmail', employeeEmail)
    urlencoded.append('employeeSerial', employeeSerial)

    console.log(urlencoded)
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
      redirect: 'follow',
    }

    try {
      const response = await fetch(
        'https://peripheralsloanbackend.mybluemix.net/peripheral/request',
        requestOptions
      )
      const responseJSON = await response.json()
      console.log(responseJSON.message)
    } catch (e) {
      console.log(e)
    }

    closePopUp()
    setIsRequestLoading(false)
    getItemRequest()
  }

  const postLoanConfirmation = async () => {
    // Posts confirmation to loan a device after it was requested
    // Checks that the following is true:
    //    isRequested
    //    isAvailable
    // Makes this changes to peripheral data:
    //    isRequested: false
    //    requestedBy: ""
    //    isAvailable: false
    //    currentUser: user
    //    acceptedConditions: true
    // Creates a record in the history table
    setIsRequestLoading(true)

    const userInfo = JSON.parse(localStorage.getItem('UserInfo'))

    const myHeaders = new Headers()
    myHeaders.append('x-access-token', `${userInfo['accessToken']}`)
    myHeaders.append('Content-Type', 'application/x-www-form-urlencoded')

    const urlencoded = new URLSearchParams()
    urlencoded.append('serialNumber', peripheralData.serialNumber)

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
      redirect: 'follow',
    }

    try {
      let response = await fetch(
        'https://peripheralsloanbackend.mybluemix.net/peripheral/loan',
        requestOptions
      )
      let responseJSON = await response.json()
      console.log(responseJSON.message)
    } catch (e) {
      console.log(e)
    }

    closePopUp()
    setIsRequestLoading(false)
    getItemRequest()
  }

  const postDeviceReset = async () => {
    // Resets device

    // Makes this changes to peripheral data:
    //    isRequested: false
    //    requestedBy: ""
    //    isAvailable: true
    //    currentUser: none
    //    area: default if blank or specified in dropdown
    //    acceptedConditions: false
    //    securityAuthorization: false

    // Creates a record in the history table with the provided comments

    setIsRequestLoading(true)

    const userInfo = JSON.parse(localStorage.getItem('UserInfo'))

    /**
     * API Request Device
     */
    const myHeaders = new Headers()
    myHeaders.append('x-access-token', `${userInfo['accessToken']}`)
    myHeaders.append('Content-Type', 'application/x-www-form-urlencoded')

    const urlencoded = new URLSearchParams()
    urlencoded.append('serialNumber', peripheralData.serialNumber)

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
      redirect: 'follow',
    }

    try {
      const response = await fetch(
        'https://peripheralsloanbackend.mybluemix.net/peripheral/reset',
        requestOptions
      )
      const responseJSON = await response.json()
      console.log(responseJSON.message)
    } catch (e) {
      console.log(e)
    }

    getItemRequest()
    setIsRequestLoading(false)
    closePopUp()
  }

  const postDeleteDevice = async () => {
    // Makes device invisible
    // Checks the following is true:
    //    isAvailable
    //    !isRequested
    // Makes this changes to peripheral data:
    //    isVisible: false

    // Creates a record in the history table with the provided comments
    setIsRequestLoading(true)

    const userInfo = JSON.parse(localStorage.getItem('UserInfo'))

    const myHeaders = new Headers()
    myHeaders.append('x-access-token', userInfo['accessToken'])
    myHeaders.append('Content-Type', 'application/x-www-form-urlencoded')

    const urlencoded = new URLSearchParams()

    const requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      body: urlencoded,
      redirect: 'follow',
    }

    try {
      const response = await fetch(
        `https://peripheralsloanbackend.mybluemix.net/peripheral/${peripheralData.serialNumber}`,
        requestOptions
      )
      const responseJSON = await response.json()
      console.log(responseJSON.message)
    } catch (e) {
      console.log(e)
    }

    closePopUp()
    setIsRequestLoading(false)
    window.location.hash = `/${orgPage}`
  }

  const postReturnDevice = async () => {
    // Returns device back to IBM

    // Makes this changes to peripheral data:
    //    isAvailable: true
    //    currentUser: none
    //    area: default area of manager who received
    //    acceptedConditions: false
    //    securityAuthorization: false

    // Creates a record in the history table with the provided comments

    setIsRequestLoading(true)

    const userInfo = JSON.parse(localStorage.getItem('UserInfo'))

    const myHeaders = new Headers()
    myHeaders.append('x-access-token', userInfo['accessToken'])
    myHeaders.append('Content-Type', 'application/x-www-form-urlencoded')

    const urlencoded = new URLSearchParams()
    urlencoded.append('serialNumber', peripheralData.serialNumber)
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
      redirect: 'follow',
    }

    try {
      const response = await fetch(
        'https://peripheralsloanbackend.mybluemix.net/peripheral/return',
        requestOptions
      )
      const responseJSON = await response.json()
      console.log(responseJSON.message)
    } catch (e) {
      console.log(e)
    }

    getItemRequest()
    setIsRequestLoading(false)
    closePopUp()
  }

  const postAuthorizeExit = async () => {
    setIsRequestLoading(true)

    const userInfo = JSON.parse(localStorage.getItem('UserInfo'))

    const myHeaders = new Headers()
    myHeaders.append('x-access-token', userInfo['accessToken'])
    myHeaders.append('Content-Type', 'application/x-www-form-urlencoded')

    const urlencoded = new URLSearchParams()
    urlencoded.append('serialNumber', peripheralData.serialNumber)

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
      redirect: 'follow',
    }

    try {
      const response = await fetch(
        'https://peripheralsloanbackend.mybluemix.net/peripheral/securityAuthorize',
        requestOptions
      )
      const responseJSON = await response.json()
      console.log(responseJSON.message)
    } catch (e) {
      window.alert(e)
    }

    getItemRequest()
    setIsRequestLoading(false)
    closePopUp()
  }

  // PopUp close function
  const closePopUp = () => {
    setCurrentAction('')
  }

  // Main component
  return isDataLoading ? (
    <SkeletonStructure />
  ) : (
    <>
      {/* PopUps */}
      <RequestDevicePopUp
        open={currentAction === 'request'}
        closeFunction={closePopUp}
        submit={postDeviceLoanRequest}
        isDataLoading={isRequestLoading}
      />
      <CancelRequestPopUp
        open={currentAction === 'cancelRequest'}
        closeFunction={closePopUp}
        submit={postDeviceReset}
        isDataLoading={isRequestLoading}
      />
      <ResetDevicePopUp
        open={currentAction === 'reset'}
        closeFunction={closePopUp}
        submit={postDeviceReset}
        isDataLoading={isRequestLoading}
      />
      <LendDevicePopUp
        open={currentAction === 'approveRequest'}
        closeFunction={closePopUp}
        submit={postLoanConfirmation}
        isDataLoading={isRequestLoading}
      />
      <DeleteDevicePopUp
        open={currentAction === 'delete'}
        closeFunction={closePopUp}
        submit={postDeleteDevice}
        isDataLoading={isRequestLoading}
      />
      <ReturnDevicePopUp
        open={currentAction === 'return'}
        closeFunction={closePopUp}
        submit={postReturnDevice}
        isDataLoading={isRequestLoading}
      />
      <SecurityAuthorizePopUp
        open={currentAction === 'security'}
        closeFunction={closePopUp}
        submit={postAuthorizeExit}
        isDataLoading={isRequestLoading}
      />
      <SecurityDenyPopUp
        open={currentAction === 'securityDeny'}
        closeFunction={closePopUp}
        submit={postDeviceReset}
        isDataLoading={isRequestLoading}
      />

      <Grid className="page-content">
        <Column sm={4} md={8} lg={4} className="actions-block">
          <h1>{peripheralData.model}</h1>

          <div className="qr-code-area">
            <p>QR Code</p>
            <QRCode
              value={`https://peripheral-loans-equipo7.mybluemix.net/#/devices/${serialNumber}`}
              size={194}
            />
          </div>
          <ButtonBar
            currentAction={currentAction}
            setCurrentAction={setCurrentAction}
            peripheralData={peripheralData}
          />
        </Column>
        <Column sm={4} md={8} lg={12} className="table-block">
          {peripheralData.availability === 'Requested' &&
            sessionData.userType === 'focal' &&
            !peripheralData.acceptedConditions && (
              <InlineNotification
                kind="info"
                subtitle={
                  <span>
                    {peripheralData.employeeName} has requested this device.
                    Click the "Lend" button to proceed.
                  </span>
                }
                title="New request"
                lowContrast
                hideCloseButton
                style={{ minWidth: '100%' }}
              />
            )}
          {
            /* Warning: also depends on authentication */
            peripheralData.availability === 'Requested' &&
              sessionData.userType === 'requisitor' && (
                <InlineNotification
                  kind="success"
                  subtitle={
                    <span>
                      The device {peripheralData.serialNumber} has been assigned
                      to you. Contact the corresponding focal to get the device.
                    </span>
                  }
                  title="Request confirmed"
                  lowContrast
                  hideCloseButton
                  style={{ minWidth: '100%' }}
                />
              )
          }
          <DeviceStructuredTable device={peripheralData} />
          {!(sessionData.userType === 'requisitor') && (
            <StatusStructuredTable device={peripheralData} />
          )}
        </Column>
      </Grid>
    </>
  )
}

export default Details
