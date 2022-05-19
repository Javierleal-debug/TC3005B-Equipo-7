import React, { useState, useEffect } from 'react'
import QRCode from 'react-qr-code'
// import { useParams } from 'react-router-dom'

import DeviceStructuredTable from './components/DeviceStructuredTable'
import DeviceForm from './components/DeviceForm'

import axios from 'axios'

// mock data
import device from '../../mock_data/device.json'

// Carbon Styling
import {
  Grid,
  Column,
  Button,
  ButtonSet,
  Modal,
  ComboBox,
  TextArea,
  InlineNotification,
  ToastNotification,
} from 'carbon-components-react'
import {
  Edit,
  Exit,
  Friendship,
  Undo,
  Reset,
  TrashCan,
} from '@carbon/icons-react'
import SkeletonStructure from './components/SkeletonStructure'
import { useParams } from 'react-router-dom'
import StatusStructuredTable from './components/StatusStructuredTable'
import { useUserType } from '../../global-context'

import { checkAuth } from '../../util'

/*
  PopUps
*/
const RequestDevicePopUp = ({ open, setOpen, submit }) => (
  <Modal
    open={open}
    modalHeading="User agreement"
    modalLabel="Request a peripheral"
    primaryButtonText="Agree and create request"
    secondaryButtonText="Cancel"
    size="sm"
    onRequestClose={() => setOpen(false)}
    onSecondarySubmit={() => setOpen(false)}
    onRequestSubmit={submit}
  >
    <p>
      Sunt non dolore quis consectetur. Non magna in excepteur amet ullamco.
      Cupidatat ex esse fugiat mollit amet.
    </p>
    <p>
      Ullamco velit eiusmod aliqua occaecat quis sit. Cillum nostrud eiusmod
      minim id eiusmod veniam duis ipsum enim exercitation laborum proident.
      Amet esse aliqua enim dolore. Adipisicing dolor quis fugiat voluptate
      eiusmod commodo mollit laboris incididunt culpa qui veniam mollit. Ullamco
      in nulla laboris elit tempor ea ad labore voluptate.
    </p>
    <p>
      Nulla eu sunt do voluptate labore amet nostrud tempor nisi anim magna enim
      reprehenderit. Id veniam minim fugiat officia laboris qui non exercitation
      dolore est minim. Consectetur minim eiusmod ipsum non. Do commodo tempor
      dolor velit sunt culpa cillum fugiat minim eiusmod duis.
    </p>
    <p>
      Incididunt proident minim commodo et duis ex et aute sit nulla nulla. Do
      pariatur amet proident incididunt enim non tempor magna aliquip
      exercitation irure sint. Aute non magna magna quis cupidatat nostrud sit
      cupidatat. Cupidatat sit dolor voluptate adipisicing.
    </p>
    <p>
      Adipisicing excepteur magna cillum anim fugiat ipsum laborum enim elit
      deserunt. Dolor eiusmod esse reprehenderit exercitation laboris commodo
      elit dolor nisi quis sint amet. Commodo veniam sit voluptate irure mollit
      exercitation enim sint incididunt exercitation Lorem minim occaecat.
      Aliquip excepteur anim id aliquip pariatur enim.
    </p>
    <p>
      Ullamco aliquip nostrud mollit id veniam proident. Eu nulla nostrud
      incididunt qui fugiat mollit aute proident irure nostrud. Tempor irure
      officia eiusmod ea velit ut cupidatat sunt incididunt velit Lorem quis ea.
      Cupidatat qui excepteur sunt irure labore amet cillum enim irure esse.
      Irure Lorem do ad quis quis.
    </p>
  </Modal>
)

const ResetDevicePopUp = ({ open, setOpen, submit }) => (
  <Modal
    open={open}
    modalLabel="Peripheral device"
    modalHeading="Reset"
    primaryButtonText="Confirm"
    secondaryButtonText="Cancel"
    onSecondarySubmit={() => setOpen(false)}
    onRequestClose={() => setOpen(false)}
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

const LendDevicePopUp = ({ open, setOpen, submit }) => (
  <Modal
    open={open}
    modalLabel="Peripheral device"
    modalHeading="Lend"
    primaryButtonText="Accept"
    secondaryButtonText="Cancel"
    onSecondarySubmit={() => setOpen(false)}
    onRequestClose={() => setOpen(false)}
    onRequestSubmit={submit}
  >
    <p>
      By clicking the "Accept" button, you confirm that you have given this
      device to the requisitor.
    </p>
  </Modal>
)

const DeleteDevicePopUp = ({ open, setOpen, submit }) => (
  <Modal
    open={open}
    modalLabel="Peripheral device"
    modalHeading="Delete"
    primaryButtonText="Delete"
    secondaryButtonText="Cancel"
    onSecondarySubmit={() => setOpen(false)}
    onRequestClose={() => setOpen(false)}
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

const ReturnDevicePopUp = ({ open, setOpen, submit }) => (
  <Modal
    open={open}
    modalLabel="Peripheral device"
    modalHeading="Return"
    primaryButtonText="Accept"
    secondaryButtonText="Cancel"
    onSecondarySubmit={() => setOpen(false)}
    onRequestClose={() => setOpen(false)}
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

/* 
Page 
*/
const Details = () => {
  // States
  // const [onEditMode, setOnEditMode] = useState(false)
  const [isDataLoading, setIsDataLoading] = useState(true)
  const [peripheralData, setperipheralData] = useState(device)
  const [requestPopUpOpen, setRequestPopUpOpen] = useState(false)
  const [resetDevicePopUpOpen, setResetDevicePopUpOpen] = useState(false)
  const [lendDevicePopUpOpen, setLendDevicePopUpOpen] = useState(false)
  const [deleteDevicePopUpOpen, setDeleteDevicePopUpOpen] = useState(false)
  const [returnDevicePopUpOpen, setReturnDevicePopUpOpen] = useState(false)

  // const enableEditMode = () => setOnEditMode(true)
  // const disableEditMode = () => setOnEditMode(false)

  const { userType } = useUserType()

  const { serialNumber } = useParams()

  useEffect(() => {
    checkAuth()
  }, [])

  // API Calls
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
          // ----- TENTATIVO -----
          isAvailable: true,
          currentUser: 'Fulano De Ibm',
          location: 'Area A',
          isRequested: false,
          requestedBy: 'Fulano De Ibm',
          // ----- NEW -----
          isAvailable:
            data[4] === false && data[5] === true && data[6] === false
              ? true
              : false,
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
  }

  const postDeviceLoanRequest = () => {
    // Posts request to loan a device
    // Checks that the following is true:
    //    !isRequested
    //    isAvailable
    // Makes this changes to peripheral data:
    //    isRequested: true
    //    requestedBy: "Employee Name"
    //    isAvailable: false
    //    acceptedConditions: true
    // Creates a record in the history table

    // mock functionality:
    setperipheralData({
      ...peripheralData,
      isRequested: true,
      requestedBy: 'Sample User',
      isAvailable: false,
      acceptedConditions: true,
    })

    // good
    setRequestPopUpOpen(false)
  }

  const postLoanConfirmation = () => {
    // Posts confirmation to loan a device after it was requested
    // Checks that the following is true:
    //    acceptedConditions
    //    isRequested
    //    isAvailable
    // Makes this changes to peripheral data:
    //    isRequested: false
    //    requestedBy: ""
    //    isAvailable: false
    //    currentUser: user
    // Creates a record in the history table

    // Mock functionality:
    setperipheralData({
      ...peripheralData,
      isRequested: false,
      requestedBy: '',
      isAvailable: false,
    })

    setLendDevicePopUpOpen(false)
  }

  const postDeviceReset = () => {
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

    // Mock functionality:
    setperipheralData({
      ...peripheralData,
      isRequested: false,
      requestedBy: '',
      isAvailable: true,
      acceptedConditions: false,
    })

    setResetDevicePopUpOpen(false)
  }

  const postDeleteDevice = () => {
    // Makes device invisible
    // Checks the following is true:
    //    isAvailable
    //    !isRequested
    // Makes this changes to peripheral data:
    //    isVisible: false

    // Creates a record in the history table with the provided comments

    setDeleteDevicePopUpOpen(false)
  }

  const postReturnDevice = () => {
    // Returns device back to IBM

    // Makes this changes to peripheral data:
    //    isAvailable: true
    //    currentUser: none
    //    area: default area of manager who received
    //    acceptedConditions: false
    //    securityAuthorization: false

    // Creates a record in the history table with the provided comments

    // Mock functionality:
    setperipheralData({
      ...peripheralData,
      isAvailable: true,
      acceptedConditions: false,
    })

    setReturnDevicePopUpOpen(false)
  }

  useEffect(() => {
    getItemRequest()
    // eslint-disable-next-line
  }, [])

  // Buttons
  const actionsBlock = () => {
    switch (userType) {
      case 'focal':
        return (
          <ButtonSet stacked>
            {peripheralData.isRequested ? (
              <Button
                renderIcon={Friendship}
                onClick={() => setLendDevicePopUpOpen(true)}
              >
                Lend
              </Button>
            ) : (
              !peripheralData.isAvailable && (
                <Button
                  renderIcon={Undo}
                  onClick={() => setReturnDevicePopUpOpen(true)}
                >
                  Return
                </Button>
              )
            )}

            {/*<Button
              renderIcon={Edit}
              disabled={onEditMode}
              kind={'secondary'}
              onClick={enableEditMode}
            >
              Edit
              </Button>*/}

            <Button
              renderIcon={Reset}
              kind={'secondary'}
              onClick={() => {
                setResetDevicePopUpOpen(true)
              }}
            >
              Reset
            </Button>

            <Button
              renderIcon={TrashCan}
              kind={'danger'}
              onClick={() => setDeleteDevicePopUpOpen(true)}
            >
              Delete
            </Button>
          </ButtonSet>
        )
      case 'requisitor':
        return (
          <ButtonSet stacked>
            <Button
              renderIcon={Friendship}
              disabled={!peripheralData.isAvailable}
              onClick={() => setRequestPopUpOpen(true)}
            >
              Request
            </Button>
          </ButtonSet>
        )
      case 'security':
        return (
          <ButtonSet stacked>
            <Button renderIcon={Exit}>Authorize exit</Button>
          </ButtonSet>
        )
      default:
        break
    }
  }

  // Main component
  return isDataLoading ? (
    <SkeletonStructure />
  ) : (
    <>
      {/* PopUps */}
      <RequestDevicePopUp
        open={requestPopUpOpen}
        setOpen={setRequestPopUpOpen}
        submit={postDeviceLoanRequest}
      />
      <ResetDevicePopUp
        open={resetDevicePopUpOpen}
        setOpen={setResetDevicePopUpOpen}
        submit={postDeviceReset}
      />
      <LendDevicePopUp
        open={lendDevicePopUpOpen}
        setOpen={setLendDevicePopUpOpen}
        submit={postLoanConfirmation}
      />
      <DeleteDevicePopUp
        open={deleteDevicePopUpOpen}
        setOpen={setDeleteDevicePopUpOpen}
        submit={postDeleteDevice}
      />
      <ReturnDevicePopUp
        open={returnDevicePopUpOpen}
        setOpen={setReturnDevicePopUpOpen}
        submit={postReturnDevice}
      />

      <Grid className="page-content">
        <Column sm={4} md={8} lg={4} className="actions-block">
          <h1>{peripheralData.model}</h1>
          {actionsBlock()}

          <div className="qr-code-area">
            <p>QR Code</p>
            <QRCode
              value={`https://peripheral-loans-equipo7.mybluemix.net/#/devices/${serialNumber}`}
              size={200}
            />
          </div>
        </Column>
        <Column sm={4} md={8} lg={12} className="table-block">
          {peripheralData.isRequested && userType === 'focal' && (
            <InlineNotification
              kind="info"
              iconDescription="describes the close button"
              subtitle={
                <span>
                  {peripheralData.requestedBy} has requested this device. Click
                  the "Lend" button to proceed.
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
            peripheralData.isRequested && userType === 'requisitor' && (
              <InlineNotification
                kind="success"
                iconDescription="Close"
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
          {/*onEditMode ? (
            <DeviceForm
              device={peripheralData}
              disableEditMode={disableEditMode}
            />
          ) : (
            <>
              <DeviceStructuredTable device={peripheralData} />
              <StatusStructuredTable device={peripheralData} />
            </>
          )*/}
          <DeviceStructuredTable device={peripheralData} />
          <StatusStructuredTable device={peripheralData} />
        </Column>
      </Grid>
    </>
  )
}

export default Details
