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

const ResetDevicePopUp = ({ open, setOpen }) => (
  <Modal
    open={open}
    modalLabel="Peripheral device"
    modalHeading="Reset"
    primaryButtonText="Confirm"
    secondaryButtonText="Cancel"
    onSecondarySubmit={() => setOpen(false)}
    onRequestClose={() => setOpen(false)}
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
      labelText="Comments"
      helperText="Please add comments on why this device is being reset."
      cols={50}
      rows={4}
      id="text-area-1"
    />
  </Modal>
)

const Details = () => {
  const [onEditMode, setOnEditMode] = useState(false)
  const [isDataLoading, setIsDataLoading] = useState(true)
  const [peripheralData, setperipheralData] = useState(device)
  const [requestPopUpOpen, setRequestPopUpOpen] = useState(false)
  const [resetDevicePopUpOpen, setResetDevicePopUpOpen] = useState(false)
  const [requisitorNotification, setRequisitorNotification] = useState({})

  // const enableEditMode = () => setOnEditMode(true)
  const disableEditMode = () => setOnEditMode(false)

  const { userType } = useUserType()

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
          // ----- NEW -----
          isAvailable: true,
          currentUser: 'Fulano De Ibm',
          location: 'Area A',
          isRequested: false,
          requestedBy: 'Fulano De Ibm',
        }
        setperipheralData(device)
        setIsDataLoading(false)
      })
  }

  const postDeviceLoanRequest = () => {
    // Posts request to loan a device
    // Changes to peripheral data:
    //    isRequested: true
    //    requestedBy: "Employee Name"
    //    isAvailable: false
    //    acceptedConditions: true

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
    setRequisitorNotification({
      title: 'Request confirmed',
      subtitle: 'Please contact your corresponding focal to get your device.',
      timeout: 5,
      iconDescription: 'Close',
    })
  }

  useEffect(() => {
    getItemRequest()
    // eslint-disable-next-line
  }, [])

  const actionsBlock = () => {
    switch (userType) {
      case 'focal':
        return (
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
              disabled={onEditMode}
              kind={'secondary'}
              onClick={() => {
                setResetDevicePopUpOpen(true)
              }}
            >
              Reset
            </Button>

            <Button renderIcon={TrashCan} disabled={onEditMode} kind={'danger'}>
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
            <Button renderIcon={Exit} disabled={!peripheralData.isAvailable}>
              Authorize exit
            </Button>
          </ButtonSet>
        )
      default:
        break
    }
  }

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
      />
      {/* Toasts */}

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
          {peripheralData.isRequested && (
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
